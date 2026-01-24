"use client";

import { useEffect } from "react";
import { RecaptchaVerifier } from "firebase/auth";
import { auth } from "@/lib/firebase";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

export default function RecaptchaProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );

      window.recaptchaVerifier
        .render()
        .then((id) => {
          console.log("reCAPTCHA rendered:", id);
        })
        .catch(console.error);
    }
  }, []);

  return <div id="recaptcha-container" />;
}
