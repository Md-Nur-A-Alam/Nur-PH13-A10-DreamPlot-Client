"use client";

import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authClient } from "@/lib/auth-client";

export default function ToastProvider({ children }) {
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const syncJwt = async () => {
      if (session?.user?.email && !localStorage.getItem('jwt-token')) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/jwt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: session.user.email })
          });
          const data = await res.json();
          if (data.token) {
            localStorage.setItem('jwt-token', data.token);
            console.log("JWT synchronized in background.");
          }
        } catch (err) {
          console.error("Error syncing JWT:", err);
        }
      }
    };
    syncJwt();
  }, [session]);

  return (
    <>
      {children}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
