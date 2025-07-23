require('dotenv').config(); 
const fs = require('fs');
const path = require('path');

const env = process.env;

const template = fs.readFileSync(path.resolve(__dirname, '../public/firebase-messaging-sw.template.js'), 'utf8');

const firebaseConfig = {
  apiKey: env.API_KEY,
  authDomain: env.AUTH_DOMAIN,
  databaseURL: env.DATABASE_URL,
  projectId: env.PROJECT_ID,
  storageBucket: env.STORAGE_BUCKET,
  messagingSenderId: env.MESSAGING_SENDER_ID,
  appId: env.APP_ID,
};

const output = template
  .replace('__API_KEY__', firebaseConfig.apiKey || '')
  .replace('__AUTH_DOMAIN__', firebaseConfig.authDomain || '')
  .replace('__DATABASE_URL__', firebaseConfig.databaseURL || '')
  .replace('__PROJECT_ID__', firebaseConfig.projectId || '')
  .replace('__STORAGE_BUCKET__', firebaseConfig.storageBucket || '')
  .replace('__MESSAGING_SENDER_ID__', firebaseConfig.messagingSenderId || '')
  .replace('__APP_ID__', firebaseConfig.appId || '');

fs.writeFileSync(path.resolve(__dirname, '../public/firebase-messaging-sw.js'), output, 'utf8');
console.log('Service worker generated successfully.');