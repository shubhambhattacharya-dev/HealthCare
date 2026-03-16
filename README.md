# DocNow — Book a Doctor Instantly 🩺

DocNow is a full-stack telemedicine platform that lets patients find and book verified doctors, consult via live video calls, and manage their health — all from one place. Built with Next.js and powered by a credit-based system, it handles everything from scheduling to doctor payments.

---

## What This Project Does

Honestly, the idea is pretty simple — going to a doctor shouldn't feel like a chore. DocNow lets you skip the waiting rooms and book a slot with a verified specialist in under 2 minutes. Doctors get their own dashboard to manage their availability and pull payouts. Admins can oversee the whole thing from a separate panel.

Here's a quick breakdown of what each role can do:

**As a Patient:**
- Browse through a list of verified doctors filtered by specialty
- Book an appointment by picking an available time slot
- Join a live video consultation right from the browser (no downloads needed)
- Buy credits to book appointments
- Cancel bookings and get a refund to your credit wallet

**As a Doctor:**
- Set your weekly availability with flexible time slots
- Accept incoming appointments from patients
- Conduct video consultations with notes
- Track your earnings and request a payout

**As an Admin:**
- Verify or reject doctor applications
- Adjust user credits manually
- Process pending doctor payout requests
- Overview the entire platform activity

---

## Tech Stack

This project is built on a modern stack that keeps things fast and maintainable:

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Auth | Clerk |
| Database | PostgreSQL via Prisma ORM |
| Video Calls | Vonage Video API |
| UI Components | shadcn/ui + Radix UI |
| Styling | Tailwind CSS v4 |
| Forms | React Hook Form + Zod |
| Notifications | Sonner |

---

## Getting Started

### Prerequisites

Before running the project, make sure you have:
- Node.js 18 or above
- A PostgreSQL database (local or hosted like Neon / Supabase)
- A Clerk account for authentication
- A Vonage account for video call tokens

### 1. Clone and Install

```bash
git clone https://github.com/your-username/docnow.git
cd docnow
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory and fill in the following:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/docnow"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Vonage (for video calls)
VONAGE_API_KEY=your_api_key
VONAGE_API_SECRET=your_api_secret

# Admin
NEXT_PUBLIC_ADMIN_EMAILS=your@email.com
```

### 3. Set Up the Database

```bash
# Push schema to your database
npx prisma db push

# Or run migrations if you prefer
npx prisma migrate dev
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you should see the landing page.

---

## Project Structure

```
health/
├── app/
│   ├── (auth)/          # Sign in / Sign up pages (Clerk)
│   ├── (main)/
│   │   ├── admin/       # Admin dashboard
│   │   ├── doctor/      # Doctor dashboard (availability, appointments)
│   │   ├── doctors/     # Patient-facing doctor listing
│   │   ├── appointments/# Patient appointment history
│   │   ├── onboarding/  # Role selection after signup
│   │   ├── pricing/     # Credit plans
│   │   └── video-call/  # Live video consultation room
│   └── api/             # API routes (webhooks, Vonage tokens, etc.)
├── actions/             # Server actions (bookings, credits, payouts)
├── components/          # Reusable UI components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and static data
└── prisma/
    └── schema.prisma    # Database schema
```

---

## How the Credit System Works

Credits are the currency of the platform. Here's the flow:

1. **New users** get a small number of free credits when they sign up
2. **Patients** spend credits to book appointments (amount depends on their subscription plan)
3. **Doctors** earn credits every time an appointment is completed
4. **Doctors** can request a payout — the platform takes a small fee and the rest goes to them
5. **Admins** can manually adjust credits (for refunds, adjustments, etc.)

All credit movements are stored as `CreditTransaction` records so there's a full audit trail.

---

## Database Schema Overview

The core models in Prisma:

- **User** — single model shared across Patient, Doctor, and Admin roles
- **Availability** — time slots that doctors open up for booking
- **Appointment** — links a patient and doctor to a specific slot with status tracking
- **CreditTransaction** — every credit movement (purchase, deduction, refund, earning)
- **Payout** — doctor payout requests with platform fee calculation

---

## Video Calls

Video consultations use the **Vonage Video API**. When a patient joins their appointment, the server generates a session and token pair using the Vonage Server SDK. Both patient and doctor receive their respective tokens and connect directly in the browser using WebRTC — no plugins, no downloads.

The video room is accessible via `/video-call/[appointmentId]`.

---

## Deployment

To build for production:

```bash
npm run build
npm run start
```

You can deploy this on **Vercel** (recommended for Next.js), **Railway**, or any platform that supports Node.js. Make sure all your environment variables are set in the deployment dashboard before going live.

---

## Contributing

Feel free to fork the repo and open a pull request. If you find a bug or have a feature idea, open an issue and let's talk about it.

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

*Built with ❤️ using Next.js, Prisma, and Vonage.*
