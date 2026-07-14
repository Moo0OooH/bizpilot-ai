/**
 * ============================================================
 * File: tests/smoke/public-browser-interaction-smoke.mts
 * Project: BizPilot AI
 * Description: Runs real Chrome interactions against the public marketing shell.
 * Role: Verifies locale clicks, persistence, internal navigation, reloads, reverse switching, mobile-menu containment, overflow, and runtime-error safety.
 * Related:
 * - components/public/marketing-language-menu.tsx
 * - components/public/marketing-compact-menu.tsx
 * - lib/i18n/public-href.ts
 * - proxy.ts
 * Author: MoOoH
 * Created: 2026-07-13
 * Last Updated: 2026-07-13
 * Change Log:
 * - 2026-07-13: Added the Website V3 Phase 3 Chrome interaction and responsive-shell regression smoke.
 * ============================================================
 */

import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import { access, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { getPublicV2Copy } from "../../lib/i18n/public-v2-copy.ts";

type CdpMessage = Readonly<{
  error?: Readonly<{ message: string }>;
  id?: number;
  method?: string;
  params?: unknown;
  result?: unknown;
}>;

type PendingCommand = Readonly<{
  reject: (error: Error) => void;
  resolve: (result: unknown) => void;
}>;

type BrowserSnapshot = Readonly<{
  clientWidth: number;
  h1: string;
  language: string;
  pathname: string;
  scrollWidth: number;
  search: string;
}>;

type MenuSnapshot = Readonly<{
  bottom: number;
  clientHeight: number;
  overflowY: string;
  scrollHeight: number;
  top: number;
  viewportHeight: number;
}>;

type MetadataSnapshot = Readonly<{
  alternates: readonly string[];
  canonical: string;
  ogLocale: string;
  ogTitle: string;
  title: string;
}>;

const DEFAULT_BASE_URL = "http://127.0.0.1:3000";
const WAIT_TIMEOUT_MS = 15_000;

function readCliValue(name: string): string | undefined {
  const prefix = `--${name}=`;
  const inline = process.argv.find((argument) => argument.startsWith(prefix));
  if (inline) {
    return inline.slice(prefix.length);
  }

  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function resolveBaseUrl(): URL {
  const value =
    readCliValue("base-url") ??
    process.env.BIZPILOT_SMOKE_BASE_URL ??
    DEFAULT_BASE_URL;
  const url = new URL(value);

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error("Browser smoke base URL must use HTTP or HTTPS.");
  }

  url.pathname = "/";
  url.search = "";
  url.hash = "";
  return url;
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function findChrome(): Promise<string> {
  const configured = process.env.BIZPILOT_CHROME_PATH;
  const candidates = [
    configured,
    process.platform === "win32"
      ? join(process.env.PROGRAMFILES ?? "C:\\Program Files", "Google/Chrome/Application/chrome.exe")
      : undefined,
    process.platform === "win32" && process.env["PROGRAMFILES(X86)"]
      ? join(process.env["PROGRAMFILES(X86)"], "Google/Chrome/Application/chrome.exe")
      : undefined,
    process.platform === "win32" && process.env.LOCALAPPDATA
      ? join(process.env.LOCALAPPDATA, "Google/Chrome/Application/chrome.exe")
      : undefined,
    process.platform === "darwin"
      ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      : undefined,
    process.platform === "linux" ? "/usr/bin/google-chrome" : undefined,
    process.platform === "linux" ? "/usr/bin/google-chrome-stable" : undefined,
    process.platform === "linux" ? "/usr/bin/chromium" : undefined,
  ].filter((candidate): candidate is string => Boolean(candidate));

  for (const candidate of candidates) {
    if (await fileExists(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    "Chrome was not found. Set BIZPILOT_CHROME_PATH to run the browser interaction smoke.",
  );
}

async function waitForDevToolsPort(profilePath: string): Promise<number> {
  const portFile = join(profilePath, "DevToolsActivePort");
  const startedAt = Date.now();

  while (Date.now() - startedAt < WAIT_TIMEOUT_MS) {
    try {
      const [portLine] = (await readFile(portFile, "utf8")).split(/\r?\n/);
      const port = Number.parseInt(portLine ?? "", 10);
      if (Number.isInteger(port) && port > 0) {
        return port;
      }
    } catch {
      // Chrome creates the port file after its profile is ready.
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error("Timed out waiting for Chrome DevTools to start.");
}

class CdpClient {
  private readonly eventHandlers = new Map<
    string,
    Array<(params: unknown) => void>
  >();
  private nextId = 1;
  private readonly pending = new Map<number, PendingCommand>();
  private readonly socket: WebSocket;

  private constructor(socket: WebSocket) {
    this.socket = socket;
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data)) as CdpMessage;

      if (message.id) {
        const command = this.pending.get(message.id);
        if (!command) {
          return;
        }

        this.pending.delete(message.id);
        if (message.error) {
          command.reject(new Error(message.error.message));
        } else {
          command.resolve(message.result);
        }
        return;
      }

      if (message.method) {
        for (const handler of this.eventHandlers.get(message.method) ?? []) {
          handler(message.params);
        }
      }
    });
  }

  static async connect(url: string): Promise<CdpClient> {
    const socket = new WebSocket(url);

    await new Promise<void>((resolve, reject) => {
      socket.addEventListener("open", () => resolve(), { once: true });
      socket.addEventListener(
        "error",
        () => reject(new Error("Could not connect to the Chrome DevTools page.")),
        { once: true },
      );
    });

    return new CdpClient(socket);
  }

  close(): void {
    this.socket.close();
  }

  on(method: string, handler: (params: unknown) => void): void {
    const handlers = this.eventHandlers.get(method) ?? [];
    handlers.push(handler);
    this.eventHandlers.set(method, handlers);
  }

  async send<T = unknown>(method: string, params: unknown = {}): Promise<T> {
    const id = this.nextId;
    this.nextId += 1;

    const result = new Promise<unknown>((resolve, reject) => {
      this.pending.set(id, { reject, resolve });
    });

    this.socket.send(JSON.stringify({ id, method, params }));
    return (await result) as T;
  }

  async value<T>(expression: string): Promise<T> {
    const response = await this.send<{
      exceptionDetails?: Readonly<{ text?: string }>;
      result: Readonly<{ value?: T }>;
    }>("Runtime.evaluate", {
      awaitPromise: true,
      expression,
      returnByValue: true,
    });

    if (response.exceptionDetails) {
      throw new Error(
        response.exceptionDetails.text ?? "Browser expression failed.",
      );
    }

    return response.result.value as T;
  }
}

async function findPageWebSocket(port: number): Promise<string> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < WAIT_TIMEOUT_MS) {
    const response = await fetch(`http://127.0.0.1:${port}/json/list`);
    const targets = (await response.json()) as Array<{
      type?: string;
      webSocketDebuggerUrl?: string;
    }>;
    const page = targets.find(
      (target) => target.type === "page" && target.webSocketDebuggerUrl,
    );

    if (page?.webSocketDebuggerUrl) {
      return page.webSocketDebuggerUrl;
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error("Chrome did not expose a debuggable page target.");
}

async function waitFor(
  client: CdpClient,
  label: string,
  expression: string,
): Promise<void> {
  const startedAt = Date.now();
  let lastError: unknown;

  while (Date.now() - startedAt < WAIT_TIMEOUT_MS) {
    try {
      if (await client.value<boolean>(expression)) {
        return;
      }
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  const suffix = lastError instanceof Error ? ` ${lastError.message}` : "";
  throw new Error(`Timed out waiting for ${label}.${suffix}`);
}

async function navigate(client: CdpClient, url: URL): Promise<void> {
  await client.send("Page.navigate", { url: url.toString() });
  await waitFor(
    client,
    `navigation to ${url.pathname}${url.search}`,
    `document.readyState === "complete" && location.pathname === ${JSON.stringify(url.pathname)} && location.search === ${JSON.stringify(url.search)}`,
  );
}

async function setViewport(
  client: CdpClient,
  width: number,
  height: number,
): Promise<void> {
  await client.send("Emulation.setDeviceMetricsOverride", {
    deviceScaleFactor: 1,
    height,
    mobile: false,
    width,
  });
}

async function readSnapshot(client: CdpClient): Promise<BrowserSnapshot> {
  return client.value<BrowserSnapshot>(`(() => ({
    clientWidth: document.documentElement.clientWidth,
    h1: document.querySelector("h1")?.textContent?.trim() ?? "",
    language: document.documentElement.lang,
    pathname: location.pathname,
    scrollWidth: document.documentElement.scrollWidth,
    search: location.search
  }))()`);
}

async function readMetadata(client: CdpClient): Promise<MetadataSnapshot> {
  return client.value<MetadataSnapshot>(`(() => ({
    alternates: Array.from(document.querySelectorAll('link[rel="alternate"]')).map((link) =>
      (link.getAttribute("hreflang") ?? link.getAttribute("hrefLang") ?? "") + ":" + (link.getAttribute("href") ?? "")
    ),
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "",
    ogLocale: document.querySelector('meta[property="og:locale"]')?.getAttribute("content") ?? "",
    ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute("content") ?? "",
    title: document.title
  }))()`);
}

function buttonWithLabelPrefix(prefix: string): string {
  return `Array.from(document.querySelectorAll("button")).find((candidate) =>
    candidate.getAttribute("aria-label")?.startsWith(${JSON.stringify(prefix)})
  )`;
}

function menuOptionWithLabel(label: string): string {
  return `Array.from(document.querySelectorAll('[role="menuitemradio"]')).find((candidate) =>
    candidate.textContent?.includes(${JSON.stringify(label)})
  )`;
}

async function realClick(
  client: CdpClient,
  elementExpression: string,
  label: string,
): Promise<void> {
  const point = await client.value<{ x: number; y: number } | null>(`(() => {
    const element = (${elementExpression});
    if (!(element instanceof HTMLElement)) return null;
    element.scrollIntoView({ block: "center", inline: "center" });
    const rect = element.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  })()`);

  assert.ok(point, `${label} should be present and clickable`);
  await client.send("Input.dispatchMouseEvent", {
    button: "left",
    clickCount: 1,
    type: "mousePressed",
    x: point.x,
    y: point.y,
  });
  await client.send("Input.dispatchMouseEvent", {
    button: "left",
    clickCount: 1,
    type: "mouseReleased",
    x: point.x,
    y: point.y,
  });
}

async function runBrowserChecks(client: CdpClient, baseUrl: URL): Promise<void> {
  const english = getPublicV2Copy("en");
  const french = getPublicV2Copy("fr-CA");
  const runtimeErrors: string[] = [];

  client.on("Runtime.exceptionThrown", (params) => {
    runtimeErrors.push(`exception: ${JSON.stringify(params)}`);
  });
  client.on("Runtime.consoleAPICalled", (params) => {
    const event = params as {
      args?: Array<{ description?: string; value?: unknown }>;
      type?: string;
    };
    if (event.type === "error") {
      runtimeErrors.push(
        `console.error: ${(event.args ?? [])
          .map((argument) => argument.description ?? String(argument.value ?? ""))
          .join(" ")}`,
      );
    }
  });

  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await setViewport(client, 1440, 900);

  const initialUrl = new URL("/?language=en&source=browser-smoke#how-it-works", baseUrl);
  await navigate(client, initialUrl);
  await realClick(
    client,
    buttonWithLabelPrefix("Website language:"),
    "English language trigger",
  );
  await waitFor(
    client,
    "French menu option with preserved URL state",
    `Boolean(document.querySelector('[role="menuitemradio"][href*="source=browser-smoke"][href*="language=fr-CA"][href$="#how-it-works"]'))`,
  );
  const frenchClickStartedAt = Date.now();
  await realClick(client, menuOptionWithLabel("Français"), "French menu option");
  await new Promise((resolve) => setTimeout(resolve, 750));
  console.log("  French click state:", await readSnapshot(client));
  await waitFor(
    client,
    "French visible content",
    `document.documentElement.lang === "fr-CA" && document.querySelector("h1")?.textContent?.includes(${JSON.stringify(french.home.hero.title)}) === true`,
  );
  const frenchClickMs = Date.now() - frenchClickStartedAt;

  let snapshot = await readSnapshot(client);
  assert.equal(snapshot.language, "fr-CA");
  assert.equal(snapshot.pathname, "/");
  assert.match(snapshot.search, /language=fr-CA/);
  assert.match(snapshot.search, /source=browser-smoke/);
  let metadata = await readMetadata(client);
  assert.equal(metadata.title, french.home.meta.title);
  assert.equal(metadata.ogTitle, french.home.meta.title);
  assert.equal(metadata.ogLocale, "fr_CA");
  assert.equal(metadata.canonical, "https://bizpilo.com/?language=fr-CA");
  assert.ok(metadata.alternates.includes("en-CA:https://bizpilo.com"));
  assert.ok(
    metadata.alternates.includes(
      "fr-CA:https://bizpilo.com/?language=fr-CA",
    ),
  );

  const frenchProductStartedAt = Date.now();
  await realClick(
    client,
    buttonWithLabelPrefix("Langue du site:"),
    "French language trigger",
  );
  await waitFor(
    client,
    "French selected menu state",
    `Array.from(document.querySelectorAll('[role="menuitemradio"]')).some((option) => option.textContent?.includes("Français") && option.getAttribute("aria-checked") === "true")`,
  );

  await realClick(
    client,
    `document.querySelector('a[href^="/features?language=fr-CA"]')`,
    "French Product link",
  );
  await waitFor(
    client,
    "French Product navigation",
    `location.pathname === "/features" && document.documentElement.lang === "fr-CA" && document.querySelector("h1")?.textContent?.includes(${JSON.stringify(french.features.title)}) === true`,
  );
  const frenchProductMs = Date.now() - frenchProductStartedAt;

  const reloadStartedAt = Date.now();
  await client.send("Page.reload", { ignoreCache: true });
  await waitFor(
    client,
    "French persistence after reload",
    `document.readyState === "complete" && location.pathname === "/features" && document.documentElement.lang === "fr-CA" && document.querySelector("h1")?.textContent?.includes(${JSON.stringify(french.features.title)}) === true`,
  );
  const reloadMs = Date.now() - reloadStartedAt;

  await realClick(
    client,
    buttonWithLabelPrefix("Langue du site:"),
    "French language trigger after reload",
  );
  await waitFor(
    client,
    "English menu option",
    `Array.from(document.querySelectorAll('[role="menuitemradio"]')).some((option) => option.textContent?.includes("English"))`,
  );
  const englishClickStartedAt = Date.now();
  await realClick(client, menuOptionWithLabel("English"), "English menu option");
  await waitFor(
    client,
    "English visible content and explicit persistence URL",
    `document.documentElement.lang === "en" && new URLSearchParams(location.search).get("language") === "en" && document.querySelector("h1")?.textContent?.includes(${JSON.stringify(english.features.title)}) === true`,
  );
  const englishClickMs = Date.now() - englishClickStartedAt;
  metadata = await readMetadata(client);
  assert.equal(metadata.title, english.features.meta.title);
  assert.equal(metadata.ogTitle, english.features.meta.title);
  assert.equal(metadata.ogLocale, "en_CA");
  assert.equal(metadata.canonical, "https://bizpilo.com/features");
  assert.ok(metadata.alternates.includes("en-CA:https://bizpilo.com/features"));
  assert.ok(
    metadata.alternates.includes(
      "fr-CA:https://bizpilo.com/features?language=fr-CA",
    ),
  );

  await realClick(
    client,
    buttonWithLabelPrefix("Website language:"),
    "English language trigger after switching",
  );
  await waitFor(
    client,
    "English selected menu state",
    `Array.from(document.querySelectorAll('[role="menuitemradio"]')).some((option) => option.textContent?.includes("English") && option.getAttribute("aria-checked") === "true")`,
  );
  await realClick(
    client,
    buttonWithLabelPrefix("Website language:"),
    "English language trigger close",
  );

  const themeClickStartedAt = Date.now();
  await realClick(client, buttonWithLabelPrefix("Theme."), "Theme trigger");
  await waitFor(
    client,
    "dark theme option",
    `Array.from(document.querySelectorAll('[role="menuitemradio"]')).some((option) => option.textContent?.includes("Dark"))`,
  );
  await realClick(client, menuOptionWithLabel("Dark"), "Dark theme option");
  await waitFor(
    client,
    "dark theme application",
    `document.documentElement.dataset.theme === "dark" && document.documentElement.dataset.themePreference === "dark"`,
  );
  const themeClickMs = Date.now() - themeClickStartedAt;
  await realClick(client, buttonWithLabelPrefix("Theme."), "Theme trigger reset");
  await waitFor(
    client,
    "light theme option",
    `Array.from(document.querySelectorAll('[role="menuitemradio"]')).some((option) => option.textContent?.includes("Light"))`,
  );
  await realClick(client, menuOptionWithLabel("Light"), "Light theme option");
  await waitFor(
    client,
    "light theme reset",
    `document.documentElement.dataset.theme === "light"`,
  );

  const widths = [320, 360, 390, 430, 768, 1024, 1280, 1440, 1920];
  for (const language of ["en", "fr-CA"] as const) {
    const url = new URL(language === "fr-CA" ? "/?language=fr-CA" : "/", baseUrl);
    await navigate(client, url);

    for (const width of widths) {
      await setViewport(client, width, 900);
      await waitFor(
        client,
        `${width}px viewport application`,
        `window.innerWidth === ${width}`,
      );
      snapshot = await readSnapshot(client);
      assert.ok(
        snapshot.scrollWidth <= snapshot.clientWidth,
        `${language} homepage overflows at ${width}px: ${snapshot.scrollWidth} > ${snapshot.clientWidth}`,
      );
      console.log(
        `  ${language} ${width}px overflow: ${snapshot.scrollWidth - snapshot.clientWidth}px`,
      );
    }
  }

  await navigate(client, new URL("/", baseUrl));
  await setViewport(client, 390, 844);
  await realClick(
    client,
    buttonWithLabelPrefix("Open site navigation"),
    "Mobile navigation trigger",
  );
  await waitFor(client, "mobile navigation panel", `Boolean(document.querySelector("#marketing-compact-menu"))`);
  const menu = await client.value<MenuSnapshot>(`(() => {
    const panel = document.querySelector("#marketing-compact-menu");
    if (!(panel instanceof HTMLElement)) throw new Error("Mobile menu missing");
    const rect = panel.getBoundingClientRect();
    return {
      bottom: rect.bottom,
      clientHeight: panel.clientHeight,
      overflowY: getComputedStyle(panel).overflowY,
      scrollHeight: panel.scrollHeight,
      top: rect.top,
      viewportHeight: window.innerHeight
    };
  })()`);

  assert.ok(menu.bottom <= menu.viewportHeight - 8, `Mobile menu extends below the viewport: ${JSON.stringify(menu)}`);
  assert.ok(menu.scrollHeight <= menu.clientHeight + 1, `Mobile menu has nested scrolling: ${JSON.stringify(menu)}`);
  assert.notEqual(menu.overflowY, "auto");
  assert.notEqual(menu.overflowY, "scroll");

  assert.deepEqual(runtimeErrors, [], `Application runtime errors: ${runtimeErrors.join("\n")}`);
  console.log("  Locale click, navigation, reload, reverse switch: pass");
  console.log(
    `  Local interaction timings: FR ${frenchClickMs}ms, Product ${frenchProductMs}ms, reload ${reloadMs}ms, EN ${englishClickMs}ms, theme ${themeClickMs}ms`,
  );
  console.log(`  Mobile menu containment: pass (${Math.round(menu.top)}–${Math.round(menu.bottom)}px)`);
  console.log("  Application console/runtime errors: 0");
}

async function terminateChrome(process: ChildProcess): Promise<void> {
  if (process.exitCode !== null) {
    return;
  }

  process.kill();
  await new Promise<void>((resolve) => {
    const timeout = setTimeout(resolve, 2_000);
    process.once("exit", () => {
      clearTimeout(timeout);
      resolve();
    });
  });
}

async function main(): Promise<void> {
  const baseUrl = resolveBaseUrl();
  const health = await fetch(baseUrl, { redirect: "manual" });
  if (health.status >= 500) {
    throw new Error(`Browser smoke target returned HTTP ${health.status}.`);
  }

  const chromePath = await findChrome();
  const profilePath = await mkdtemp(join(tmpdir(), "bizpilot-browser-smoke-"));
  const chrome = spawn(
    chromePath,
    [
      "--headless=new",
      "--disable-background-networking",
      "--disable-component-update",
      "--disable-default-apps",
      "--disable-extensions",
      "--disable-gpu",
      "--no-default-browser-check",
      "--no-first-run",
      "--remote-debugging-port=0",
      `--user-data-dir=${profilePath}`,
      "about:blank",
    ],
    { stdio: "ignore", windowsHide: true },
  );

  let client: CdpClient | undefined;
  try {
    const port = await waitForDevToolsPort(profilePath);
    client = await CdpClient.connect(await findPageWebSocket(port));
    console.log(`BizPilot browser interaction smoke: ${baseUrl.origin}`);
    await runBrowserChecks(client, baseUrl);
    console.log("Browser interaction smoke: PASS");
  } finally {
    client?.close();
    await terminateChrome(chrome);
    await rm(profilePath, { force: true, maxRetries: 4, recursive: true, retryDelay: 100 });
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exit(1);
});
