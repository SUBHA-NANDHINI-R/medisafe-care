# MediCare Connect

Build a modern, trustworthy, responsive web application for a medicine marketplace called "MediSave" (you can use this as the temporary name).

CORE IDEA:

The platform helps people who cannot afford expensive medicines by allowing verified pharmacies to list genuine medicines that have a short remaining shelf life at significantly reduced prices.

IMPORTANT:

This is a medicine marketplace, so the UI must look professional, safe, trustworthy, and healthcare-focused. Do NOT make it look like a generic e-commerce website. Clearly display expiry dates and safety information.

==================================================

1. LANDING PAGE

==================================================

Create an attractive landing page with:

- Logo and website name

- Tagline:

  "Affordable Medicines. Trusted Pharmacies. Better Access."

- Short explanation:

  "Find genuine medicines from verified pharmacies at affordable prices, especially medicines with shorter remaining shelf life."

- "Get Started" button

- Language selector:

  - English

  - தமிழ்

- Login button

- Sign Up button

Add sections:

- How It Works

- For Patients

- For Pharmacies

- Why Choose MediSave

- Safety & Verification

- Frequently Asked Questions

- Contact Us

Use clean healthcare colors, modern cards, rounded corners, subtle animations, and accessible typography.

==================================================

2. ROLE SELECTION

==================================================

When the user clicks "Get Started", show:

"Who are you?"

Two large cards:

1. 👤 People / Patients

   "Find affordable medicines from verified pharmacies."

2. 🏥 Pharmacy Owner

   "List eligible medicines and reach people looking for affordable options."

The user must select one role before continuing.

==================================================

3. LANGUAGE SYSTEM

==================================================

The entire website should support:

- English

- Tamil (தமிழ்)

Create a language switcher in the navbar.

When Tamil is selected:

- Navigation

- Buttons

- Forms

- Error messages

- AI follow-up

- Medicine information

- Instructions

- Dashboard labels

should be displayed in Tamil wherever translations are available.

Allow users to switch between Tamil and English at any time.

==================================================

4. PATIENT / PEOPLE REGISTRATION

==================================================

Create a secure registration/login flow for people.

Registration fields:

- Full Name

- Mobile Number

- Email

- Password

- Confirm Password

- Aadhaar verification

IMPORTANT:

Do not store or expose unnecessary Aadhaar information.

For the prototype, create an Aadhaar verification interface with:

- Aadhaar number input

- OTP verification simulation

- Verification status

Show:

"Your identity has been verified."

Use masked Aadhaar display after verification.

After successful registration, take the user to the Patient Dashboard.

==================================================

5. PHARMACY REGISTRATION

==================================================

Create a separate pharmacy owner registration flow.

Required information:

- Pharmacy Name

- Owner Name

- Contact Number

- Email ID

- Complete Pharmacy Address

- City

- State

- Pincode

- Pharmacy License / approved shop document upload

- Password

- Confirm Password

The pharmacy owner must upload an approved document/license proving that they are authorized to operate the pharmacy.

Show verification status:

- Pending Verification

- Under Review

- Verified

- Rejected

Only VERIFIED pharmacies can list medicines for customers.

For the prototype, create a document-upload interface and simulated admin verification workflow.

Clearly display a "Verified Pharmacy" badge on approved pharmacy profiles.

==================================================

6. PHARMACY DASHBOARD

==================================================

Create a professional pharmacy dashboard.

Dashboard sections:

- Overview

- Add Medicine

- My Medicines

- Orders

- Inventory

- Profile

- Verification Status

- Notifications

Overview cards:

- Active Medicines

- Medicines Expiring Soon

- Orders Received

- Total Sales

==================================================

7. ADD MEDICINE

==================================================

Pharmacy owners can add medicines that meet the platform's eligibility criteria.

Medicine form:

- Medicine Name

- Generic Name

- Manufacturer / Company

- Medicine Type

  - Tablet

  - Capsule

  - Syrup

  - Cream

  - Other

- Batch Number

- Manufacturing Date

- Expiry Date

- Available Quantity

- Original Price

- Discounted Price

- Prescription Required: Yes / No

- Medicine Image

- Additional Description

Automatically calculate:

"Remaining Shelf Life"

based on the expiry date.

Display the expiry date prominently.

Add validation so pharmacies cannot enter:

- Expired medicines

- Invalid dates

- Negative quantities

- Invalid prices

The system should clearly distinguish:

- Expired

- Expiring Soon

- Available

IMPORTANT:

Never allow expired medicines to be listed for sale.

==================================================

8. MEDICINE MARKETPLACE

==================================================

Create a marketplace similar to a modern e-commerce product listing interface, while maintaining a healthcare-focused design.

The home/dashboard should show medicine cards.

Each medicine card should contain:

- Medicine image

- Medicine name

- Generic name

- Manufacturer

- Pharmacy name

- Verified Pharmacy badge

- Manufacturing date

- Expiry date

- Remaining shelf life

- Original price

- Discounted price

- Discount percentage

- Availability

- Prescription required indicator

Example:

Paracetamol 500mg

ABC Pharma

Verified Pharmacy ✓

Manufactured: 05/2026

Expires: 11/2026

Remaining shelf life: 3 months

MRP: ₹50

MediSave Price: ₹25

50% OFF

Add:

"View Details"

==================================================

9. SEARCH AND FILTER

==================================================

Create a powerful medicine search system.

Search by:

- Medicine name

- Generic name

- Manufacturer

- Pharmacy

Filters:

- Price range

- Discount

- Medicine type

- Expiry period

- Location

- Prescription required

- Availability

Sorting:

- Lowest Price

- Highest Discount

- Nearest Expiry

- Newest Listed

The UI should resemble a clean e-commerce marketplace with product cards.

==================================================

10. MEDICINE DETAILS PAGE

==================================================

When the user selects a medicine, show:

- Large medicine image

- Medicine name

- Generic name

- Manufacturer

- Pharmacy

- Verified pharmacy status

- Manufacturing date

- Expiry date

- Remaining shelf life

- Price

- Discount

- Available quantity

- Prescription requirement

- Medicine description

- Safety information

Show a highly visible warning if the medicine has a short remaining shelf life.

Example:

"Expiry: November 2026

Please check the expiry date before purchase."

If prescription is required, clearly display:

"Prescription Required"

Do not allow the platform to bypass prescription requirements.

==================================================

11. PATIENT DASHBOARD

==================================================

Create:

- Search medicines

- Browse medicines

- Recommended affordable medicines

- Orders

- Saved medicines

- Notifications

- Profile

- AI Follow-Up

- Language settings

Add a section:

"Affordable Medicines Near You"

Display verified pharmacies and available medicines based on location.

==================================================

12. AI FOLLOW-UP FEATURE

==================================================

Add an AI-powered follow-up assistant available in:

- English

- Tamil

Name it:

"MediSave AI Follow-Up"

The assistant should help users with:

- Medicine reminders

- Follow-up reminders

- Questions about medicine information

- Purchase follow-up

- Appointment/reminder prompts

- General medication-related guidance

IMPORTANT SAFETY RULES:

The AI must NOT:

- Diagnose diseases

- Prescribe medicines

- Change dosage

- Tell users to stop prescribed medicines

- Replace a doctor or pharmacist

If a user asks for medical advice beyond basic information, the AI should recommend consulting a qualified doctor or pharmacist.

The AI should be able to communicate naturally in both English and Tamil.

Example English:

"Your medicine purchase was 7 days ago. Would you like to set a reminder to check with your doctor or pharmacist?"

Example Tamil:

"நீங்கள் மருந்தை வாங்கி 7 நாட்கள் ஆகிறது. மருத்துவர் அல்லது மருந்தாளரிடம் தொடர்ந்து ஆலோசனை பெறுவதற்கான நினைவூட்டலை அமைக்க விரும்புகிறீர்களா?"

Provide:

- Chat interface

- Language switch

- Reminder creation

- Follow-up history

==================================================

13. PHARMACY PROFILE

==================================================

Each verified pharmacy should have a public profile containing:

- Pharmacy name

- Verified badge

- Owner name where appropriate

- Address

- Contact information

- Available medicines

- Ratings/reviews

- Verification status

Do not expose sensitive verification documents publicly.

==================================================

14. ADMIN DASHBOARD

==================================================

Create an admin dashboard for platform management.

Admin can:

- View registered users

- View pharmacy applications

- Review uploaded pharmacy documents

- Approve/reject pharmacies

- View listed medicines

- Remove invalid medicine listings

- Monitor reported medicines

- Manage users

- View orders

- Manage platform notifications

Admin verification should be required before a pharmacy can sell/list medicines.

==================================================

15. DATABASE STRUCTURE

==================================================

Design a database with tables/collections for:

Users

- id

- name

- email

- phone

- role

- language

- verification_status

- created_at

Pharmacies

- id

- owner_id

- pharmacy_name

- contact

- email

- address

- city

- state

- pincode

- license_document

- verification_status

- created_at

Medicines

- id

- pharmacy_id

- medicine_name

- generic_name

- manufacturer

- medicine_type

- batch_number

- manufacturing_date

- expiry_date

- quantity

- original_price

- discounted_price

- prescription_required

- image

- status

- created_at

Orders

- id

- user_id

- pharmacy_id

- medicine_id

- quantity

- total_price

- order_status

- created_at

AI Follow Ups

- id

- user_id

- reminder_type

- reminder_date

- language

- status

==================================================

16. SECURITY

==================================================

Implement secure authentication.

Use role-based access:

PATIENT:

- Can browse medicines

- Search medicines

- Place orders

- View orders

- Use AI follow-up

- Manage profile

PHARMACY:

- Can manage pharmacy profile

- Add medicines

- Update inventory

- Manage orders

ADMIN:

- Verify pharmacies

- Manage users

- Moderate listings

- Manage platform

Protect sensitive user information.

Do not display Aadhaar numbers publicly.

Do not expose uploaded pharmacy verification documents publicly.

==================================================

17. UI/UX

==================================================

Design style:

- Modern healthcare marketplace

- Clean

- Trustworthy

- Professional

- Simple

- Mobile-first

- Responsive

- Accessible

Use:

- Healthcare-inspired color palette

- White/light backgrounds

- Rounded cards

- Clear typography

- Modern icons

- Soft shadows

- Subtle hover animations

- Smooth page transitions

- Clear CTA buttons

Create a bottom navigation for mobile:

Home

Search

Orders

AI Follow-Up

Profile

Desktop navigation:

Logo

Home

Medicines

Pharmacies

AI Follow-Up

Orders

Profile

Language Selector

==================================================

18. IMPORTANT SAFETY AND BUSINESS LOGIC

==================================================

Implement these rules:

1. Only verified pharmacies can list medicines.

2. Expired medicines cannot be listed.

3. Medicines must display manufacturing and expiry dates.

4. Prescription-required medicines must clearly show that requirement.

5. The platform must not encourage users to take medicines without professional advice.

6. AI must not diagnose or prescribe.

7. Users must be informed to verify the medicine and expiry information before purchase.

8. Sensitive identity information must remain private.

9. Pharmacy verification documents must only be accessible to authorized administrators.

10. The system should flag medicines approaching expiry for pharmacy review.

11. Do not automatically recommend a medicine as medically suitable for a specific disease.

12. Add a clear disclaimer:

   "MediSave is a marketplace and information platform. It does not replace advice from a qualified doctor or pharmacist."

==================================================

19. HOMEPAGE SECTIONS

==================================================

Create these sections in order:

Hero Section

↓

Search Medicine

↓

How MediSave Works

↓

Affordable Medicines

↓

Verified Pharmacies

↓

How It Helps People

↓

AI Follow-Up

↓

Safety & Verification

↓

FAQ

↓

Footer

Hero CTA:

"Find Affordable Medicines"

Secondary CTA:

"Register Your Pharmacy"

==================================================

20. FINAL REQUIREMENT

==================================================

Build the complete application with working navigation, responsive layouts, authentication screens, role-based dashboards, medicine search/filtering, pharmacy verification flow, medicine listing system, expiry-date calculations, AI follow-up interface, Tamil/English language switching, and admin moderation.

Use realistic sample data so the website looks fully functional during demonstration.

The final product should feel like a real healthcare marketplace startup rather than a simple college project.

Prioritize:

TRUST + AFFORDABILITY + SAFETY + ACCESSIBILITY + SIMPLE USER EXPERIENCE.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://medisafe-care.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/598aff84-79d5-4384-bc5a-2f4dc3178067).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
