import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

export const client = new MongoClient(process.env.MONGODB_URI);
export const db = client.db('Nur-PH13-A10-DreamPlot');

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client
  }),
  trustedOrigins: [
    "http://localhost:3000",
    "https://nur-ph-13-a10-dream-plot-client.vercel.app"
  ],
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    }
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: { 
      clientId: process.env.GOOGLE_CLIENT_ID, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
    }, 
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "Tenant"
      },
      phone: {
        type: "string",
        required: false
      },
      dob: {
        type: "string",
        required: false
      },
      address: {
        type: "string",
        required: false
      },
      gender: {
        type: "string",
        required: false
      },
      profession: {
        type: "string",
        required: false
      },
      isActive: {
        type: "boolean",
        required: false,
        defaultValue: true
      }
    }
  }
});