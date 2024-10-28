import { useEffect } from "react";

const ServiceWorkerRegistration = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && process.browser) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  return null; // This component does not render any UI
};

export default ServiceWorkerRegistration;
