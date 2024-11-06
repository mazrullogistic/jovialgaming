import { useEffect } from "react";

const useServiceWorker = () => {
  useEffect(() => {
    // Ensure the code only runs on the client
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      // Check if service workers are supported
      if ("serviceWorker" in navigator) {
        // Register the service worker when the page loads
        window.addEventListener("load", () => {
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
        });
      } else {
        console.warn("Service workers are not supported in this browser.");
      }
    }
  }, []);
};

export default useServiceWorker;
