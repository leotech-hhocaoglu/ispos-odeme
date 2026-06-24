# Product Requirements

## Objective

Create a secure payment application that lets an authenticated user submit a payment through İşbankası İşPOS Sanal POS.

## Initial Pages

### Auth Page

Route: `/auth`

Purpose:

- Let an operator or merchant user authenticate.
- Establish a backend-backed session or token.
- Redirect authenticated users to `/payment`.

Minimum fields:

- Username or email
- Password

Minimum states:

- Idle
- Submitting
- Invalid credentials
- Backend unavailable
- Authenticated

### Payment Page

Route: `/payment`

Purpose:

- Let an authenticated user enter payment information.
- Submit payment initiation to the backend.
- Show success, failure, pending, or redirect-required result.

Minimum fields:

- Amount
- Currency, fixed to TRY for the initial İşPOS flow
- Read-only numeric order reference
- Card statement description
- Card holder name
- Card number
- Expiry month
- Expiry year in `YY` format
- CVV

Minimum states:

- Idle
- Submitting
- Validation error
- Provider redirect required
- Payment approved
- Payment declined
- Payment status unknown

Footer:

- Show centered payment infrastructure logo images, including Visa, Mastercard,
  TROY, American Express, and BKM.
- Keep logo files local after sourcing them from the web; do not show an
  "accepted cards" label in the payment page footer.

## Functional Requirements

- Users cannot access `/payment` without authentication.
- Payment requests must be validated before being sent to İşPOS.
- The frontend must call only the backend API.
- The backend must generate İşPOS-specific request data.
- The backend must normalize provider responses into stable application statuses.

## Non-Functional Requirements

- Sensitive data must not be logged.
- Configuration must be environment-based.
- API errors must be stable and frontend-friendly.
- The UI must be responsive and usable on desktop and mobile.
- Provider integration must be isolated behind a gateway adapter.

## Out Of Initial Scope

- Merchant onboarding.
- Refunds and reversals.
- Installment management.
- Saved cards.
- Reconciliation dashboard.
- Multi-provider payment routing.
