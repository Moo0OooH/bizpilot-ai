# BizPilot AI — تحلیل مقایسه‌ای، بهبود استراتژیک و پیش‌بینی موفقیت

**نسخه:** v1.0  
**تاریخ:** 2026-05-15  
**هدف فایل:** این سند برای تصمیم‌گیری founder، ادامه کار با Cloud Code/Codex، و تعیین اولویت‌های واقعی قبل از pilot ساخته شده است.

---

## 1) حکم نهایی کوتاه

BizPilot AI از نظر ایده، positioning، معماری و تمرکز MVP در نقطه خوبی است، اما هنوز در خطر «ساختن زیاد قبل از فروش» قرار دارد. بهترین مسیر برای بالا بردن شدید شانس موفقیت این است:

1. قبل از هر outreach عمومی، security و RLS را ببند.
2. Magic Moment بساز تا owner در 3 دقیقه ارزش محصول را ببیند.
3. محصول را به‌عنوان **Quote Recovery System برای Cleaning Businesses** بفروش، نه CRM، نه form builder، نه AI platform.
4. قبل از vertical دوم، فقط دنبال 3 تا 5 مشتری واقعی paying/pilot برو.
5. همه تصمیمات product از این به بعد باید با feedback واقعی cleaning ownerها validate شود.

**امتیاز فعلی موفقیت به‌عنوان small profitable SaaS:** حدود 35–45٪  
**بعد از اجرای hardening + magic moment + 20 مصاحبه واقعی:** حدود 55–65٪  
**اگر feature creep و بدون فروش ادامه پیدا کند:** حدود 15–25٪

---

## 2) تعریف دقیق پروژه

BizPilot AI باید یک سیستم سبک، سریع و قابل اعتماد برای local service businesses باشد که اول با cleaning شروع می‌کند. هسته اصلی آن این است:

> مشتری به جای ارسال پیام ناقص در Instagram/Google/Facebook، وارد یک smart quote link می‌شود، اطلاعات ساختارمند می‌دهد، owner در dashboard یک lead آماده، خلاصه‌شده و قابل پاسخ می‌بیند، و AI فقط draft پاسخ و follow-up می‌سازد. ارسال نهایی با انسان است.

### کارهایی که الان نباید انجام شود

- CRM کامل
- booking calendar کامل
- invoice/payment داخل محصول
- social media automation کامل
- multi-vertical عمومی قبل از validation cleaning
- auto-send پیام توسط AI
- automation پیچیده قبل از human review

---

## 3) وضعیت فعلی پروژه طبق سندهای موجود

طبق اسناد، پروژه از Phaseهای اولیه عبور کرده و هسته‌های زیر شکل گرفته‌اند:

- public quote page
- lead intake/submission flow
- dashboard و lead workspace
- AI draft generation concept
- Supabase/Postgres/RLS foundation
- privacy modes
- repository/service direction
- vendor independence strategy
- UI/UX standardization direction
- phase-gated documentation discipline

اما هنوز سه گپ اصلی باقی است:

1. **Security gap:** مخصوصاً RLS hardening، public insert validation، explicit GRANT، تست RLS.
2. **Sales gap:** هنوز proof واقعی از paying customer نداریم.
3. **Magic Moment gap:** owner باید قبل از آمدن lead واقعی هم ارزش محصول را ببیند.

---

## 4) تحلیل رقابتی واقعی

### 4.1 GoHighLevel

GoHighLevel قوی است، اما برای cleaning owner کوچک بیش از حد سنگین و agency-oriented است. قیمت پایه آن حدود $97/month است و برای کسی مناسب‌تر است که automation، funnel، CRM و agency workflows می‌خواهد.

**فرصت BizPilot:** ساده‌تر، focused‌تر، مخصوص quote recovery، بدون پیچیدگی CRM.

**پیام فروش:**
> You do not need a full CRM to stop losing quote requests. You need a fast quote recovery desk.

### 4.2 Jobber

Jobber ابزار عملیاتی خانه و خدمات است: quote، schedule، invoice، payment. قیمت‌های public آن از حدود $49/month شروع می‌شود و پلن‌های بالاتر تا صدها دلار می‌روند.

**فرصت BizPilot:** Jobber بعد از booked job قوی است؛ BizPilot باید قبل از booked job برنده شود.

**پیام فروش:**
> Jobber helps you run booked jobs. BizPilot helps you stop losing leads before they become jobs.

### 4.3 Housecall Pro

Housecall Pro هم field-service management است. قوی، بزرگ، و مناسب تیم‌های عملیاتی‌تر. برای یک cleaning owner کوچک ممکن است زیاد و پیچیده باشد.

**فرصت BizPilot:** lightweight lead-response layer.

### 4.4 Typeform / Tally / Google Forms

این‌ها form builder هستند. تهدید اصلی این است که market تو را با فرم‌ساز اشتباه بگیرد.

**تمایز حیاتی:**
> Form builders collect answers. BizPilot converts quote requests into response-ready leads.

---

## 5) جایگاه درست در بازار

بهترین positioning فعلی:

# Quote Recovery Command Center for Cleaning Businesses

نه:
- AI CRM
- Smart form builder
- Business OS عمومی
- Automation platform

### Headline پیشنهادی

**Stop losing cleaning quote requests. Turn messy messages into response-ready leads.**

### Subheadline پیشنهادی

**A branded quote link + lead workspace + AI reply drafts for cleaning businesses that miss customers in DMs, calls, and late-night quote requests.**

---

## 6) مهم‌ترین تغییرات لازم برای افزایش شدید شانس موفقیت

## Priority 0 — Foundation/Security قبل از فروش عمومی

### 6.1 RLS hardening برای intake_submission_values

مشکل احتمالی: public insert فقط submission/business را چک کند ولی field_key واقعی/visible/form-bound را enforce نکند. باید database-level policy تضمین کند:

- submission متعلق به business صحیح است.
- field_key متعلق به فرم فعال همان business است.
- hidden/internal fields قابل public insert نیستند.
- inactive public link اجازه insert ندارد.
- duplicate یا invalid field values کنترل شود.

**Definition of Done:**
- migration رسمی SQL
- RLS test مثبت و منفی
- `pnpm test:rls`
- no dashboard manual change

### 6.2 Explicit GRANT policy

با تغییرات جدید Supabase، public schema tableها دیگر نباید implicit exposed فرض شوند. پروژه باید rule داشته باشد:

- هر migration باید RLS + GRANT + test داشته باشد.
- هیچ table جدیدی بدون explicit access decision اضافه نشود.
- service role فقط server-only باشد.

### 6.3 Abuse protection برای public quote page

قبل از اینکه link عمومی شود:

- honeypot field
- rate limit per IP/business/slug
- server-side validation
- max field size
- basic bot/spam event logging
- safe error messages

### 6.4 AI privacy hardening

- `store: false` برای calls حساس، تا حد ممکن.
- structured output validation
- no raw internal errors in persisted metadata
- no full prompt/customer payload in logs
- safe audit records

---

## Priority 1 — Magic Moment

بدون Magic Moment، demo ضعیف می‌شود. Dashboard خالی ارزش را نشان نمی‌دهد.

### Magic Moment باید این باشد:

وقتی owner وارد dashboard می‌شود، یک sample lead آماده ببیند:

- Move-out cleaning
- 2-bedroom apartment
- Friday preferred date
- incomplete detail مثل square footage missing
- AI summary
- reply draft
- follow-up draft
- CTA: “Share your quote link to capture real leads”

### هدف زمانی

Owner باید در کمتر از 3 دقیقه بگوید:

> “آها، این دقیقاً همون چیزیه که DMهای ناقص منو مرتب می‌کنه.”

---

## Priority 2 — Sales Validation قبل از feature جدید

قبل از ساخت feature جدید:

- 20 مکالمه با cleaning business owner در Montreal/Canada
- 5 demo جدی
- 3 pilot یا paying commitment
- حداقل 30 lead واقعی یا نیمه‌واقعی
- حداقل 50٪ owner review rate
- حداقل 30٪ AI draft usage/edit rate

### قانون مهم

هر feature request فقط ثبت شود. اجرا نشود مگر اینکه:

- حداقل 3 owner مستقل همان را بخواهند، یا
- directly باعث closing اولین customer شود، یا
- security/compliance blocker باشد.

---

## Priority 3 — Onboarding Concierge نه Self-Serve کامل

برای 10 مشتری اول، onboarding باید دستی و concierge باشد:

- business profile را خودت setup کن
- services و service areas را خودت وارد کن
- quote link را برایشان آماده کن
- Instagram bio/Google profile placement را راهنمایی کن
- یک Loom کوتاه مخصوص همان business ضبط کن

Self-serve onboarding الان زود است و احتمالاً بعد از feedback باید عوض شود.

---

## Priority 4 — Revenue Proof داخل محصول

Retention وقتی بالا می‌رود که owner ارزش را ببیند. Dashboard باید به جای metrics عمومی، این‌ها را نشان دهد:

- New quote requests this week
- Leads waiting for reply
- AI drafts used
- Follow-ups needed
- Potential recovered revenue estimate
- Time saved estimate

اما revenue estimate نباید fake دقیق باشد. باید با label واضح باشد:

> Estimated opportunity, not confirmed revenue.

---

## 7) محصول نهایی MVP باید چه featureهایی داشته باشد

### Must-have قبل از pilot

- Public quote page stable
- Lead submission validation
- Owner dashboard
- Lead detail
- AI reply draft
- AI follow-up draft
- Human review only
- Basic privacy/consent copy
- RLS tests
- Abuse protection
- Magic sample lead/demo mode
- Setup checklist

### Should-have نزدیک pilot

- Owner copy/paste reply flow
- Lead status: new / reviewed / replied / follow-up needed / closed
- Basic usage events
- Basic reporting
- Export CSV
- Manual archive/delete policy

### Not now

- SMS sending
- WhatsApp integration
- calendar booking
- invoice/payment
- full CRM pipeline
- multi-user teams پیچیده
- advanced analytics
- social content generation
- second vertical

---

## 8) معماری پیشنهادی برای ادامه

### لایه‌ها

- UI components
- route handlers/actions
- services
- repositories
- policy/authorization helpers
- prompt registry
- AI provider abstraction
- Supabase client boundary

### قوانین اصلی

- No direct Supabase calls scattered across components.
- Server-only modules must include `import "server-only"`.
- Client receives DTO, not raw database rows.
- Service role never reaches browser.
- RLS is final enforcement layer, not optional backup.
- Every public insert must be database validated.
- Every migration needs test.

---

## 9) Go-to-Market نهایی

### ICP اول

Cleaning businesses در Montreal/Canada که:

- small owner-led هستند
- Instagram/Facebook فعال دارند
- quote request از DM می‌گیرند
- response time کند دارند
- form یا CRM جدی ندارند
- کمتر از 50–100 review دارند
- هنوز در growth stage هستند

### Offer پیشنهادی

**Founding Cleaning Pilot**

- $199 setup
- $49/month for first 6 months
- done-for-you setup
- branded quote link
- AI response drafts
- weekly improvement check-in for first month

برای business کمی جدی‌تر:

- $299 setup
- $79/month
- شامل custom services/service areas و reporting سبک

### پیام outreach اول

سلام [Name]، business شما رو دیدم. یه سوال کوتاه: وقتی کسی توی Instagram یا Google می‌پرسه “how much for cleaning?” معمولاً همه اطلاعات لازم رو همون اول می‌ده یا باید چند بار رفت‌وبرگشت کنید؟

بعد از جواب:

من دارم یه ابزار خیلی سبک برای cleaning businesses می‌سازم که این پیام‌های ناقص رو به quote request مرتب تبدیل می‌کنه و برای owner جواب آماده می‌سازه، ولی AI هیچ چیزی رو خودش نمی‌فرسته. دوست دارم یک demo 5 دقیقه‌ای نشون بدم و feedback بگیرم.

---

## 10) پیش‌بینی 12 ماهه

### سناریو بدبینانه — احتمال 25٪

- Hardening طولانی می‌شود.
- Sales عقب می‌افتد.
- AI draft quality متوسط می‌ماند.
- Customerها quote link را فعال استفاده نمی‌کنند.

نتیجه:
- ماه 3: $0–$49 MRR
- ماه 6: $100–$250 MRR
- ماه 12: $300–$600 MRR

### سناریو واقع‌بینانه — احتمال 50٪

- 3–4 هفته hardening
- 20 مکالمه واقعی
- 3 pilot تا ماه 3–4
- retention متوسط 75–85٪

نتیجه:
- ماه 3: $49–$150 MRR
- ماه 6: $400–$700 MRR
- ماه 9: $900–$1,500 MRR
- ماه 12: $1,500–$2,500 MRR

### سناریو قوی — احتمال 25٪

- Security سریع بسته می‌شود.
- Magic Moment قوی می‌شود.
- Founder-led sales جدی انجام می‌شود.
- 3 customer اول referral می‌آورند.

نتیجه:
- ماه 3: $150–$300 MRR
- ماه 6: $900–$1,500 MRR
- ماه 9: $2,000–$3,500 MRR
- ماه 12: $4,000–$6,000 MRR

---

## 11) Risk Register

| Risk | Probability | Impact | Fix |
|---|---:|---:|---|
| RLS/data leak | Low-Medium | Catastrophic | RLS hardening + tests + explicit grants |
| No paying customers | Medium | High | 20 interviews + 5 demos + concierge offer |
| Feature creep | High | High | validation gate, 3-customer rule |
| AI poor quality | Medium | High | prompt registry + structured output + owner feedback |
| Dashboard empty state weak | High | Medium | Magic Moment sample lead |
| Founder burnout | Medium | High | weekly split: build/sales/support |
| Supabase policy changes | Medium | Medium | SQL migrations + repository boundary + export/backup plan |
| Owner does not share quote link | Medium | High | onboarding checklist + profile placement help |

---

## 12) بهترین roadmap اجرایی 30 روزه

### Week 1 — Security Gate

- harden `intake_submission_values` RLS
- add explicit grants in migrations
- wire `pnpm test:rls`
- add public quote abuse protection
- review server-only boundaries

### Week 2 — Magic Moment + Demo Readiness

- sample cleaning lead
- AI summary/reply/follow-up sample
- setup checklist
- demo route or demo mode
- dashboard empty state redesign

### Week 3 — Sales Assets

- landing page one-screen
- 2-minute Loom script
- 3 demo scenarios
- outreach tracker
- pricing one-pager

### Week 4 — Founder-Led Sales

- 20 cleaning businesses researched
- 20 personalized first messages
- 5 demos booked/attempted
- 3 serious pilot conversations
- feedback logged into a product decision table

---

## 13) Prompt آماده برای Cloud Code / Codex

```text
You are working on BizPilot AI, a Next.js + Supabase SaaS for cleaning businesses.

Core positioning:
BizPilot is a Quote Recovery Command Center, not a CRM, not a generic form builder, and not a full business OS. It helps cleaning business owners turn messy quote requests into structured leads with AI reply/follow-up drafts. AI is assistant-only; it never auto-sends.

Current priority:
Increase pilot readiness and startup success probability by fixing security, RLS, abuse protection, and demo magic moment before adding new features.

Rules:
1. Inspect the repo before changing anything.
2. Do not change product scope without explicit approval.
3. No direct scattered Supabase calls; preserve repository/service boundaries.
4. Server-only modules must remain server-only and must not leak into Client Components.
5. All DB changes must be SQL-first migrations.
6. Every exposed public table needs explicit GRANT decisions and RLS enabled.
7. Every public insert must be enforced at the database level, not only app code.
8. Add or update RLS tests for every RLS/security migration.
9. Keep AI human-in-the-loop. No auto-send.
10. Do not persist raw AI errors, raw prompts, secrets, or sensitive customer payloads in logs or metadata.

Immediate implementation order:
A. Harden intake_submission_values RLS so public inserts can only add values for real, active, visible fields belonging to the submitted form/business.
B. Wire pnpm test:rls if missing.
C. Add public quote abuse protection: honeypot, rate limit, server validation, safe errors.
D. Add or verify server-only boundaries and DTO boundaries.
E. Build a Magic Moment sample cleaning lead/demo state in dashboard empty state.
F. Run typecheck, lint, build, and RLS tests.

Output expected:
- List files changed.
- Explain why each change matters.
- Show tests run and results.
- Mention any remaining risks or manual checks.
```

---

## 14) تصمیم نهایی

بهترین تصمیم برای BizPilot الان این نیست که feature جدید بسازد. بهترین تصمیم این است که:

1. foundation را امن کند،
2. demo را emotionally واضح کند،
3. 20 مکالمه واقعی با ownerها انجام دهد،
4. 3 مشتری pilot/paying بگیرد،
5. بعد از data واقعی roadmap را باز کند.

اگر همین مسیر اجرا شود، پروژه از حالت “خوب طراحی‌شده” به حالت “قابل فروش و قابل یادگیری” منتقل می‌شود. این همان نقطه‌ای است که شانس موفقیت را واقعاً بالا می‌برد.

## آپدیت نهایی v1.6 — تبدیل تحلیل به قانون اجرایی

این تحلیل از این به بعد باید به‌عنوان لایه‌ی جهت‌دهنده‌ی اجرای MVP استفاده شود. هدف حذف محتوای قبلی نیست؛ هدف این است که همه‌ی اسناد و تصمیم‌ها حول چند اصل قفل شوند:

- BizPilot در مرحله‌ی فعلی یک **Lead Recovery & Response System** است، نه AI platform عمومی.
- بازار اول فقط cleaning است.
- Magic Moment باید قبل از sales جدی ساخته شود.
- public quote path باید قبل از pilot واقعی harden شود.
- founder-led onboarding و customer discovery باید رسمی شود.
- retention مهم‌تر از feature count است.
- AI فقط assistant محدود و owner-reviewed است.

مسیر درست: امنیت، Magic Moment، UX آرام عملیاتی، landing pain-first، فروش founder-led، سه pilot واقعی، سپس توسعه.
