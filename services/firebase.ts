import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import {
  Auth,
  browserLocalPersistence,
  getAuth,
  initializeAuth,
  Persistence,
  setPersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
};

const requiredKeys: Array<keyof typeof firebaseConfig> = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key]);
if (missingKeys.length > 0) {
  throw new Error(
    `Missing Firebase env vars: ${missingKeys
      .map((key) => `EXPO_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`)
      .join(', ')}. Add them to .env and restart Expo.`,
  );
}

const firebaseApp = initializeApp(firebaseConfig);

let auth: Auth;
if (Platform.OS === 'web') {
  auth = getAuth(firebaseApp);
  setPersistence(auth, browserLocalPersistence).catch(() => {
    // Fallback keeps auth usable even if persistence fails in private mode.
  });
} else {
  try {
    const { getReactNativePersistence } = require('firebase/auth') as {
      getReactNativePersistence: (storage: typeof AsyncStorage) => Persistence;
    };

    auth = initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    auth = getAuth(firebaseApp);
  }
}

const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, firestore, storage };
