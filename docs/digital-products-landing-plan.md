# Digital Products Landing & Email System

## Goal
Extend the existing mindstru.site website in the existing repository. Do not create a separate repository or redesign the existing homepage.

## Product URLs
- /products/10-prompts/
- /products/30-prompts/
- /products/40-prompts/
- /products/80-prompts/

## Shared landing-page template
1. Hero: product title, concise promise, product mockup, primary CTA
2. What problem it helps with
3. What the buyer receives (only verified contents)
4. Preview/sample pages or prompts
5. Who it is for
6. Benefits and use cases
7. Pricing and purchase CTA (price to be confirmed)
8. FAQ
9. Final CTA
10. Footer, policies, contact

## Lead capture and freebie
- Dedicated opt-in section/page and consent language
- Deliver the free resource after confirmed opt-in
- Track campaign/source with UTM parameters
- Provide unsubscribe and privacy information

## Purchase and delivery flow
Product page -> checkout provider -> verified payment -> delivery email with secure/download link -> confirmation page.
Do not expose private files or payment secrets in client-side code. Avoid treating a client redirect alone as proof of payment.

## Email automation
### Lead sequence
1. Consent/confirmation and free resource
2. Helpful, relevant content
3. Product introduction
4. Optional offer / follow-up

### Buyer sequence
1. Order confirmation and delivery
2. Getting-started tips
3. Follow-up and feedback request
4. Relevant next-product offer, respecting consent and suppression rules

## Technical approach
- Keep one repository and existing domain/deployment.
- Reuse a shared page template and product data.
- Add SEO metadata, canonical URLs, structured product data only when price/availability/offer details are accurate.
- Set up analytics events for view, opt-in, checkout initiation, purchase and delivery (subject to consent/legal requirements).
- Validate mobile accessibility, forms, checkout and delivery before launch.

## Decisions still needed
- Final product text, PDF previews, confirmed prices and files
- Checkout provider and payout/merchant availability
- Email provider, consent wording, privacy policy and sender-domain authentication
- Secure delivery approach and refund/terms policies
