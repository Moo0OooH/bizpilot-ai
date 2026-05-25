# BizPilot Auth Email and SMTP Integration Plan v1.0

**Project:** BizPilot AI
**Document Type:** Signup confirmation and auth-email delivery plan
**Status:** Active Phase 21P plan; not configured in production yet
**Owner:** MoOoH
**Last Updated:** 2026-05-25
**Related:**

- `docs/readiness/PHASE_21H_SIGNUP_CONFIRMATION_SMOKE.md`
- `docs/readiness/PHASE_21M_CONSOLIDATED_STATUS_AND_SERVICE_CAPABILITIES.md`
- `docs/operations/BIZPILOT_COST_AND_UPGRADE_GATE_v1.0.md`
- `docs/security/BIZPILOT_PRIVACY_SECURITY_COMPLIANCE_BASELINE_v1.0.md`

---

## 1. Current Decision

BizPilot must not rely on Supabase's default Auth email sender for real pilot
signups.

Custom SMTP is required before real customer onboarding because the default
sender is intended for non-production use, restricts recipients, and is
rate-limited.

Official reference:

- Supabase custom SMTP: `https://supabase.com/docs/guides/auth/auth-smtp`

## 2. Current Production Status

| Area | Status |
| --- | --- |
| Signup confirmation smoke | Previously passed once with a synthetic disposable inbox |
| Stable custom SMTP | Not configured/verified |
| Safe ongoing test inbox | Needed for repeatable smoke |
| Real user signup readiness | Blocked |
| Marketing/bulk email | Out of scope |
| Hidden auto-send/customer messaging | Not allowed |

## 3. Provider Recommendation

Use a dedicated transactional auth-email provider, not a marketing sender.

Recommended order for early pilot:

| Option | Fit | Notes |
| --- | --- | --- |
| Postmark | Strong transactional reliability | Good default if owner accepts paid/provider setup |
| Resend | Simple developer workflow | Works if domain DNS and sender reputation are handled carefully |
| SendGrid | Common and flexible | More setup surface; keep auth emails separate from marketing |
| AWS SES | Cost-efficient at scale | More operational complexity for early pilot |

For BizPilot's current stage, choose one provider and use a separate auth
sending identity such as `no-reply@auth.bizpilo.com` or an equivalent
owner-approved sender. Do not mix marketing and Auth emails.

## 4. Required Inputs

Before configuration, collect these outside the repo:

- verified sending domain or sender address,
- SMTP host,
- SMTP port, normally 587 with TLS,
- SMTP username,
- SMTP password,
- default From address,
- sender name,
- DNS records required by the provider,
- backup provider or rollback plan if delivery fails.

Never commit or print SMTP credentials.

## 5. Supabase Auth Settings To Configure

Configure in the Supabase Dashboard Auth settings, or through the Management API
only if the access token is available securely outside the repo.

Set:

- custom SMTP enabled,
- email confirmations enabled,
- autoconfirm disabled for real users,
- secure email change enabled,
- SMTP host/port/user/password,
- From address and sender name,
- rate limit appropriate for the pilot.

Do not disable email confirmation to work around delivery problems.

## 6. DNS And Deliverability

Before real pilot:

1. Add provider-required SPF/DKIM records.
2. Add DMARC policy at least in monitoring mode.
3. Verify the sending domain in the provider dashboard.
4. Send only Auth/security transactional messages from this sender.
5. Keep auth email templates simple and non-promotional.
6. Use a custom auth domain later if Supabase/Auth links are being flagged as spam.

## 7. Safe Smoke Sequence

Use synthetic data only:

1. Confirm SMTP settings are saved in Supabase without exposing secrets.
2. Create a fresh synthetic owner account using a safe inbox.
3. Confirm the email arrives.
4. Open the confirmation link without logging the full URL or token.
5. Verify the user reaches `/dashboard`.
6. Verify the default quote setup is created.
7. Run public route smoke:

   ```bash
   BIZPILOT_SMOKE_BASE_URL=https://bizpilo.com pnpm smoke:public
   ```

8. Run one forgot/reset password smoke with the same safe inbox.
9. Record only sanitized pass/fail evidence in readiness docs.

## 8. Abuse And Privacy Controls

Keep these controls active:

- do not disable confirmations,
- do not bulk-create accounts,
- do not use real customer inboxes for testing,
- do not print confirmation links, tokens, SMTP settings, or full email addresses,
- keep CAPTCHA/waitlist as a future option if signup abuse appears,
- keep customer messaging manual and owner-reviewed; Auth email is not customer follow-up automation.

## 9. Phase 21P Decision

```text
Custom SMTP is a real-pilot blocker.
Synthetic signup smoke may continue with a safe disposable inbox.
Real customer onboarding waits until SMTP delivery and reset-password smoke pass.
```
