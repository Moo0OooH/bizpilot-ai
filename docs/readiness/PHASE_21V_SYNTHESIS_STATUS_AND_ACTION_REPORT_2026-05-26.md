# Phase 21V — Synthesis Status and Action Report (2026-05-26)

## 1) وضعیت فعلی جاری

این گزارش بر اساس بررسی فایل‌های زیر تهیه شده است:

- `docs/readiness/PHASE_21_NEXT_TAB_HANDOFF.md`
- `docs/readiness/PHASE_21M_CONSOLIDATED_STATUS_AND_SERVICE_CAPABILITIES.md`
- `docs/readiness/PHASE_21P_NO_COST_READINESS_HARDENING.md`
- `docs/readiness/PHASE_21G_OPENAI_REAL_KEY_VALIDATION.md`
- `docs/readiness/PHASE_21T_FEATURE_ENTITLEMENT_SETTINGS_EVIDENCE.md`
- `docs/readiness/PHASE_21U_DASHBOARD_RUNTIME_FIX_AND_SMOKE.md`
- `docs/product/BIZPILOT_FEATURE_ENTITLEMENT_AND_GUIDE_STANDARD_v1.0.md`

نتیجه کوتاه:

- `dashboard` بعد از اصلاح runtime fix دوباره قابل بارگذاری شده و خطای عمومی صفحه‌ی خالی در routeهای auth شده رفع شده.
- دسترسی production برای synthetic demo همچنان فعال است.
- گیت‌بیس و readiness برای تولید real customer هنوز باز است.
- OpenAI روی production به دلیل `429 insufficient_quota` هنوز block است.
- `main` در ریشه‌ی شاخه‌ی جاری، با `origin/main` همسو نیست (در این محیط فعلی checkout روی `phase-21q-dashboard-redesign` است) و نیاز به تصمیم برای merge/push دارد.

## 2) فهرست فازها: کامل / ناقص / نیمه‌تمام

## آماده (Done)

1. Public smoke: `pnpm smoke:public` و روت‌های مهم سایت پاس.
2. Trust pages: `/privacy`, `/security`, `/terms` آماده و smoked.
3. OpenAI safety/guardrail در کد + fallback/error code sanitization انجام شده.
4. Dashboard runtime crash (Server-to-Client serialization) رفع و تست‌های محافظتی اضافه شده.
5. Feature entitlement base تعریف شده و رکورد فازهای جدید (lead source analytics, customer contact list) ثبت شده.

## نیمه‌کامل (Partially done)

1. Production onboarding/quote smoke
   - gap قبل رفع شده در signup bootstrap (عقب‌ماندگی quote page unavailable) با commit مربوطه ثبت شده.
   - نیازمند smoke production کامل lead creation + visibility remains دارد.
2. Dashboard feature/guide standard
   - ساختار entitlement ساخته شده.
   - راهنمای متن/چشم‌نمایی کامل برای همه قابلیت‌های جدید هنوز کامل نشده و در بعضی بخش‌ها draft/required باقی مانده است.
3. Admin live QA
   - UI محلی قابل بررسی بوده.
   - QA بصری نهایی در production با session مالک‌محور هنوز منتظر است.
4. Git state
   - گزارش‌ها نشان می‌دهد branchهای `main`/`phase-21-production-alignment` در برخی لحظات همسو بوده‌اند؛ اما در محیط فعلی checkout روی فرایند بازطراحی dashboard است.

## باقی‌مانده (Not done)

1. Production public quote security smoke (lead create + isolation + abuse checks با داده synthetic)
2. fr-CA quote smoke production
3. Horizontal access smoke production
4. OpenAI real-key smoke با کارکرد واقعی (پس از حل quota)
5. SMTP/Auth email custom posture + signup/reset smoke
6. Backup/export/restore تصمیم نهایی و dry-run
7. 0020 تصمیم‌گیری owner برای fake/test auth deletion در production
8. Live admin visual QA در session owner

## 3) چه چیزهایی در اسناد ثبت شده‌اند و چه چیزهایی باید اضافه شوند

### ثبت شده است

- `leads.source` ممنوع و مسیر درست `leads.source_channel` + `lead_source_metadata`.
- feature families:
  - `lead_source_attribution_analytics`
  - `customer_contact_list`
  - وضعیت‌شان: `planned` و `required` برای راهنما تا زمانی که data/privacy/RLS/backup بسته شود.
- لیست محدودسازی scope (بدون AI auto-send، booking, invoice, SMS/WhatsApp, Instagram API, calendar) با شرط feature gate رسمی ثبت شده.

### هنوز باید دقیق‌تری بشود (به‌روزرسانی سندی نیاز دارد)

- در handoffها هنوز جای یک سند واحد از "ورودی lead از کجا می‌آید" به‌صورت عملیاتی نیست:
  - direct website
  - referral link / UTM
  - Instagram
  - Facebook
  - other campaign sources
- نمایش **Contact list برای owner/admin** هنوز باید با state/guide اجرایی شود:
  - هر lead email / phone دارای نوع تماس باشد،
  - نمایش در admin فقط برای owner/admin با visibility control،
  - بلوک‌هایی که قبل از real customer باید default-off و setup-required باشند.
- نقشه‌ی مسیر تصمیم‌گیری برای هر feature پیشنهادی باید در هر feature card به صورت واضح شود:
  - state
  - level
  - prerequisites
  - ready criteria
  - smoke evidence

## 4) نقشه مسیر پیشنهادی برای هم‌اکنون (اولویت)

1. تثبیت git baseline و تصمیم merge/push از `phase-21q-dashboard-redesign` به `main` طبق اختیار مالک.
2. اجرای کامل چهار smoke واقعی production (quote security، fr-CA، horizontal access، admin visual) با Synthetic-only.
3. تکمیل راهنمای قابلیت‌ها:
   - lead source attribution
   - owner-visible contact list
   - owner admin controls و visibility state
4. ثبت خروجی هر smoke در فایل evidence جدید یا فایل‌های مرتبط.
5. فقط بعد از پذیرش OpenAI/SMTP/backup به real data می‌رویم.

## 5) جمع‌بندی تصمیمی

- بخش‌های انجام‌شده از Phase 21 تا اینجا قابل اتکا هستند.
- بخش‌های با ریسک بالا که مانع real pilot هستند هنوز باز هستند.
- پیشنهاد: همین مسیر را ادامه بدهیم و هر feature جدید را فقط به‌صورت entitlement + guide + smoke قابل‌استناد جلو ببریم، نه فعال‌سازی پیش‌فرض.

