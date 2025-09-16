// I am creating a Firebase client initializer for Auth and Firestore.
"use client"

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth"
import { getFirestore, serverTimestamp, type Firestore } from "firebase/firestore"

type FirebaseClients = {
  app: FirebaseApp
  auth: Auth
  db: Firestore
  googleProvider: GoogleAuthProvider
}

let cached: FirebaseClients | null = null

export function getFirebase(): FirebaseClients {
  if (cached) return cached

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  }

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
  const auth = getAuth(app)
  const db = getFirestore(app)
  const googleProvider = new GoogleAuthProvider()

  cached = { app, auth, db, googleProvider }
  return cached
}

export { serverTimestamp }


