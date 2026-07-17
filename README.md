# DreamPlot - Property Rental & Booking Platform (Server)

![Home Page](assets/Home%20page.png)

DreamPlot is a sophisticated, premium web application built for property rental and booking. This repository contains the **backend server** code, which serves as a transparent marketplace API connecting Tenants and Property Owners, moderated by an Admin. The platform supports advanced search, booking pipelines, secure payments via Stripe, and comprehensive role-based endpoints.

## 🚀 Live Links
- **Server Live Site**: [https://md-nur-a-alam-nur-ph-13-a10-dream-p.vercel.app](https://md-nur-a-alam-nur-ph-13-a10-dream-p.vercel.app)
- **Client Live Site**: [https://nur-ph-13-a10-dream-plot-client.vercel.app](https://nur-ph-13-a10-dream-plot-client.vercel.app)
- **Server Repository**: [https://github.com/Md-Nur-A-Alam/Md-Nur-A-Alam-Nur-PH13-A10-DreamPlot-Server](https://github.com/Md-Nur-A-Alam/Md-Nur-A-Alam-Nur-PH13-A10-DreamPlot-Server)
- **Client Repository**: [https://github.com/Md-Nur-A-Alam/Nur-PH13-A10-DreamPlot-Client](https://github.com/Md-Nur-A-Alam/Nur-PH13-A10-DreamPlot-Client)

## 📸 Screenshots

**All Services Page**
![All Services](assets/All%20services%20page.png)

**Registration Page**
![Registration Page](assets/registration%20page%20and%20public%20nav%20routes.png)

**Admin Dashboard**
![Admin Dashboard](assets/admin%20dashboard%20page%20and%20private%20nav%20routes.png)

**Owner Dashboard**
![Owner Dashboard](assets/Owner%20dashboard%20page%20and%20private%20nav%20routes.png)

**Tenant Dashboard**
![Tenant Dashboard](assets/tenant%20dashboard%20page%20and%20private%20nav%20routes.png)

## ✨ Core Features
1. **RESTful API**: Clean and secure API endpoints for all frontend operations.
2. **Role-Based Access Control (RBAC)**: Distinct permissions for Admin, Owner, and Tenant validated via JWT.
3. **Database Management**: MongoDB integration via Mongoose with structured schemas and complex aggregation pipelines.
4. **Payment Processing**: Integrated Stripe backend for processing property bookings securely.
5. **Authentication & Authorization**: JWT token generation and validation middleware for secure route access.
6. **Data Validation**: Secure data handling for properties, users, and transactions.

## 🛠️ Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB, Mongoose
- **Security**: JSON Web Token (JWT), bcryptjs, CORS
- **Payment Gateway**: Stripe SDK
- **Environment**: dotenv

## 📦 Getting Started

First, install dependencies:
```bash
npm install
```

Second, create a `.env` file in the root directory and set the required environment variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:3000
```

Third, run the development server:
```bash
npm run dev
```

The server will be running at [http://localhost:5000](http://localhost:5000).

## 👨‍💻 Developer Information
<img src="assets/developer_Nur.jpeg" alt="Developer Nur" width="150" height="150" style="border-radius:50%;" />

**Md Nur A Alam**
- **LinkedIn**: [https://www.linkedin.com/in/md-nur-a-alam13/](https://www.linkedin.com/in/md-nur-a-alam13/)
- **FaceBook**: [https://web.facebook.com/Md.NurAAlamSoikot/](https://web.facebook.com/Md.NurAAlamSoikot/)
- **Github**: [https://github.com/Md-Nur-A-Alam](https://github.com/Md-Nur-A-Alam)
- **Codeforces**: [https://codeforces.com/profile/Nur_Alam.2812](https://codeforces.com/profile/Nur_Alam.2812)
- **Hackerrank**: [https://www.hackerrank.com/profile/md_nuralam2812](https://www.hackerrank.com/profile/md_nuralam2812)
- **BeeCrowed**: [https://judge.beecrowd.com/en/profile/630077](https://judge.beecrowd.com/en/profile/630077)
- **Portfolio**: [md-nur-a-alam-portfolio.vercel.app](https://md-nur-a-alam-portfolio.vercel.app)
- **Youtube**: [https://www.youtube.com/@NurAAlam44](https://www.youtube.com/@NurAAlam44)
