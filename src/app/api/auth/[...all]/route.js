import { auth, db } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";

let adminSeeded = false;

async function ensureAdminUser() {
  if (adminSeeded) return;
  try {
    const usersCollection = db.collection('user');
    
    const adminEmail = "mdnuraalamcse13@gmail.com";
    const existing = await usersCollection.findOne({ email: adminEmail });
    
    if (!existing) {
      console.log("Seeding admin user...");
      await auth.api.signUpEmail({
        body: {
          email: adminEmail,
          password: "123456.Nur",
          name: "Admin",
          role: "Admin",
          dob: "1990-01-01",
          phone: "01712345678",
          address: "Dhaka, Bangladesh",
          gender: "Male",
          profession: "Administrator",
          isActive: true
        }
      });
      console.log("Admin user seeded successfully!");
    } else {
      if (existing.role !== 'Admin' || existing.isActive !== true) {
        await usersCollection.updateOne(
          { email: adminEmail },
          { $set: { role: 'Admin', isActive: true } }
        );
        console.log("Admin user role/isActive updated successfully!");
      }
    }
    adminSeeded = true;
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
}

const handler = toNextJsHandler(auth);

export const GET = async (req) => {
  await ensureAdminUser();
  return handler.GET(req);
};

export const POST = async (req) => {
  await ensureAdminUser();
  return handler.POST(req);
};