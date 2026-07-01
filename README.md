# DreamPlot - Property Rental & Booking Platform (Client)

DreamPlot is a sophisticated, premium web application built for property rental and booking. It serves as a transparent marketplace connecting Tenants and Property Owners, moderated by an Admin. The platform supports advanced search, booking pipelines, secure payments via Stripe, user review systems, and comprehensive role-based dashboards.

## Links
- **Client Live Site**: [https://nur-ph-13-a10-dream-plot-client.vercel.app](https://nur-ph-13-a10-dream-plot-client.vercel.app)
- **Server Live Site**: [https://md-nur-a-alam-nur-ph-13-a10-dream-p.vercel.app](https://md-nur-a-alam-nur-ph-13-a10-dream-p.vercel.app)
- **Client Repository**: [https://github.com/Md-Nur-A-Alam/Nur-PH13-A10-DreamPlot-Client](https://github.com/Md-Nur-A-Alam/Nur-PH13-A10-DreamPlot-Client)
- **Server Repository**: [https://github.com/Md-Nur-A-Alam/Md-Nur-A-Alam-Nur-PH13-A10-DreamPlot-Server](https://github.com/Md-Nur-A-Alam/Md-Nur-A-Alam-Nur-PH13-A10-DreamPlot-Server)

## Credentials for Testing
- **Admin Email**: `mdnuraalamcse13@gmail.com`
- **Admin Password**: `123456.Nur`

## Core Features
1. **Role-Based Access Control (RBAC)**: Distinct layouts and features for Admin, Owner, and Tenant.
2. **Interactive Dashboard**: Full-featured dashboards for all users.
   - **Tenant**: My Bookings, Favorites list, User Profile.
   - **Owner**: Analytics charts (Recharts), Add/Update/Delete Listings, Booking request moderation (Approve/Reject).
   - **Admin**: All Users management, Property approvals/moderation, Transaction audits, All Bookings monitoring.
3. **Advanced Search & Filtering**: Location-based search, property type filtering, price sorting.
4. **Secure Stripe Payments**: Seamless payment process with instant transaction tracking.
5. **Review System**: Tenants can rate and leave comments on properties.
6. **Theme Customization**: Toggle between Light and Dark modes.

## Tech Stack
- **Framework**: Next.js (App Router)
- **State & Query**: TanStack React Query, Axios
- **Styling**: TailwindCSS, DaisyUI
- **Database / Adapter**: MongoDB, better-auth (MongoDB Adapter)
- **Security**: better-auth (OAuth & Credentials integration), JSON Web Token (JWT)
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Payment Gateway**: Stripe SDK
- **Icons**: Radix Icons, React Icons

## NPM Packages Used
- `better-auth`
- `@tanstack/react-query`
- `axios`
- `mongodb`
- `stripe`
- `@stripe/stripe-js`
- `@stripe/react-stripe-js`
- `framer-motion`
- `recharts`
- `react-toastify`
- `react-hook-form`
- `@radix-ui/react-icons`
- `react-icons`
- `date-fns`
- `dotenv`

## Getting Started

First, install dependencies:
```bash
npm install
```

Second, copy the `.env` file and set the required environment variables:
```env
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_auth_secret
MONGODB_URI=your_mongodb_uri
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
NEXT_PUBLIC_CLIENT_URL=http://localhost:3000
```

Third, run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.
