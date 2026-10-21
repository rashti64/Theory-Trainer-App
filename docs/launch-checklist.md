# Launch checklist (Google Play)

Owner: release-manager. Items marked (PO) need the product owner to act or approve.

## Accounts and legal
- [ ] (PO) Licence agreement with TÜV | DEKRA arge tp 21 for the class B catalog
- [ ] (PO) Google Play developer account (organisation if there is a company)
- [ ] (PO) Expo account; project linked with `npx eas-cli@latest init`
- [ ] (PO) Supabase project in an EU region; keys added as EAS environment variables
- [ ] (PO) Domain for privacy policy, imprint (Impressum) and account-deletion page
- [ ] Final app name and package id (replace `com.theorytrainer.app` in `app.json`)

## App
- [ ] Licensed catalog imported and published
- [ ] Original mascot and app icon
- [ ] In-app account deletion wired to `delete_my_account()`
- [ ] Consent screen before any analytics
- [ ] Daily reminder notifications (opt-in)
- [ ] Premium tier with Google Play Billing (if the product owner chooses subscriptions)

## Store
- [ ] Store listing in German and English: title, short and full description
- [ ] Phone screenshots (at least 4) and feature graphic
- [ ] Content rating questionnaire
- [ ] Data-safety form
- [ ] Privacy policy URL

## Release
- [ ] Internal test build (`eas build --profile production`, `eas submit`)
- [ ] Closed test with 15–20 testers for 14 continuous days (personal accounts)
- [ ] (PO) Apply for production access
- [ ] (PO) Production release
