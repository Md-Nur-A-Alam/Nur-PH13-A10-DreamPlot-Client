<div align="center">
  <img src="assets/Home%20page.png" alt="DreamPlot Banner" width="100%" />
  
  <h1>🌟 DreamPlot - Client Application</h1>
  <p>A sophisticated, premium frontend web application built for property rental and booking.</p>

  <p>
    <a href="https://nur-ph-13-a10-dream-plot-client.vercel.app"><img src="https://img.shields.io/badge/Live_Site-Client-blue?style=for-the-badge&logo=vercel" alt="Client Live Site" /></a>
    <a href="https://md-nur-a-alam-nur-ph-13-a10-dream-p.vercel.app"><img src="https://img.shields.io/badge/Live_Site-Server-green?style=for-the-badge&logo=vercel" alt="Server Live Site" /></a>
  </p>
</div>

<br />

## 📖 Comprehensive Overview
DreamPlot serves as a transparent marketplace connecting **Tenants** and **Property Owners**, expertly moderated by an **Admin**. Built on the modern **Next.js App Router**, the platform supports advanced search, booking pipelines, secure payments via Stripe, user review systems, and comprehensive role-based dashboards. 

---

## 🏗️ Architecture & Project Structure

### Frontend Architecture
- **Next.js App Router**: Utilizes modern server-side rendering (SSR) and static site generation (SSG) for optimal SEO and performance.
- **State Management & Data Fetching**: Powered by **TanStack React Query** for aggressive caching, background updates, and optimistic UI rendering.
- **Styling System**: A utility-first approach utilizing **TailwindCSS** combined with **DaisyUI** for pre-built, themeable components.
- **Authentication**: Secured via **better-auth** supporting seamless OAuth and Credentials integration synced with the backend JWT logic.
- **Animation Layer**: Interactions and micro-animations driven by **Framer Motion**.

### Folder Structure (Highlights)
- `/src/app`: Contains all Next.js page routes, layouts, and API routes (`/api`).
- `/src/components`: Reusable UI components (Navbars, Cards, Modals).
- `/public`: Static assets and icons.
- `/assets`: Showcased project screenshots and banners.

---

## 📸 Interactive Showcase
<details open>
<summary><b>🖼️ Click to View Screenshots</b></summary>
<br/>
<table align="center">
  <tr>
    <td align="center"><b>Home Page</b><br><img src="assets/Home%20page.png" width="400" alt="Home"/></td>
    <td align="center"><b>All Services Page</b><br><img src="assets/All%20services%20page.png" width="400" alt="All Services"/></td>
  </tr>
  <tr>
    <td align="center"><b>Tenant Dashboard</b><br><img src="assets/tenant%20dashboard%20page%20and%20private%20nav%20routes.png" width="400" alt="Tenant Dashboard"/></td>
    <td align="center"><b>Owner Dashboard</b><br><img src="assets/Owner%20dashboard%20page%20and%20private%20nav%20routes.png" width="400" alt="Owner Dashboard"/></td>
  </tr>
  <tr>
    <td align="center"><b>Admin Dashboard</b><br><img src="assets/admin%20dashboard%20page%20and%20private%20nav%20routes.png" width="400" alt="Admin Dashboard"/></td>
    <td align="center"><b>Registration Page</b><br><img src="assets/registration%20page%20and%20public%20nav%20routes.png" width="400" alt="Registration Page"/></td>
  </tr>
</table>
</details>

<br />

## ✨ Core Features
> Explore what makes DreamPlot stand out.

- 🔐 **Role-Based Access Control (RBAC)**: Distinct layouts and features for Admin, Owner, and Tenant.
- 📊 **Interactive Dashboard**:
  - **Tenant**: My Bookings, Favorites list, User Profile.
  - **Owner**: Analytics charts (`Recharts`), Add/Update/Delete Listings, Booking request moderation.
  - **Admin**: All Users management, Property approvals/moderation, Transaction audits.
- 🔍 **Advanced Search & Filtering**: Location-based search, property type filtering, price sorting.
- 💳 **Secure Payments**: Seamless `@stripe/react-stripe-js` integration for front-end card tokenization.
- ⭐ **Review System**: Tenants can rate and leave comments on properties.
- 🎨 **Theme Customization**: Beautiful Light and Dark modes built into DaisyUI.

<br />

## 🛠️ Tech Stack
<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" alt="React Query" />
  <img src="https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white" alt="Stripe" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
</p>

- **Core**: Next.js 14+ (App Router), React 18, React Hook Form
- **State & Data**: TanStack React Query, Axios
- **Styling & UI**: TailwindCSS, DaisyUI, Radix Icons, React Toastify
- **Security**: better-auth (OAuth), JSON Web Token (JWT) integration

<br />

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Md-Nur-A-Alam/Nur-PH13-A10-DreamPlot-Client.git
cd Nur-PH13-A10-DreamPlot-Client
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Setup Environment Variables
<details>
<summary>Click to view required `.env` configuration</summary>

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
</details>

### 4️⃣ Run the App
```bash
npm run dev
```
Navigate to `http://localhost:3000` to explore the app!

<br />

## 🔑 Demo Credentials
Test the app instantly using these Admin credentials:
> **Email**: `mdnuraalamcse13@gmail.com` <br/>
> **Password**: `123456.Nur`

<br />

## 👨‍💻 Meet the Developer

<div align="center">
  <img src="assets/developer_Nur.jpeg" alt="Developer Nur" width="150" height="150" style="border-radius:50%; border: 4px solid #626CD9;" />
  <h3>Md Nur A Alam</h3>
  <p>Passionate Full-Stack Developer</p>
  
  <p>
    <a href="https://md-nur-a-alam-portfolio.vercel.app"><img src="https://img.shields.io/badge/Portfolio-255E63?style=for-the-badge&logo=About.me&logoColor=white" alt="Portfolio" /></a>
    <a href="https://www.linkedin.com/in/md-nur-a-alam13/"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
    <a href="https://github.com/Md-Nur-A-Alam"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>
  </p>
</div>
