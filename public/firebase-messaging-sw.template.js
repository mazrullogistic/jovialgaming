importScripts(
  "https://www.gstatic.com/firebasejs/9.8.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.8.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "__API_KEY__",
  authDomain: "__AUTH_DOMAIN__",
  databaseURL: "__DATABASE_URL__",
  projectId: "__PROJECT_ID__",
  storageBucket: "__STORAGE_BUCKET__",
  messagingSenderId: "__MESSAGING_SENDER_ID__",
  appId: "__APP_ID__",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/images/logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});