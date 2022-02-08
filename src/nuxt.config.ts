import { defineNuxtConfig } from 'nuxt3'
import { config } from 'dotenv'
config()

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  publicRuntimeConfig: {
    firebaseApiKey: process.env.FIREBASE_API_KEY || "XXXXXXXXXXXXXXXXX",
    firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN || "XXXXXXXXXXXXXXXXX",
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID || "XXXXXXXXXXXXXXXXX",
    firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET || "XXXXXXXXXXXXXXXXX",
    firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "XXXXXXXXXXXXXXXXX",
    firebaseAppId: process.env.FIREBASE_APP_ID || "XXXXXXXXXXXXXXXXX",
    firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID || "XXXXXXXXXXXXXXXXX",
    instagramClientId: process.env.INSTAGRAM_CLIENT_ID || "XXXXXXXXXXXXXXXXX",
    instagramRedirectUri: process.env.INSTAGRAM_REDIRECT_URI || "https://localhost:3000/auth/instagram-verify/",
    instagramVerifyUrl: process.env.FIREBASE_FUNCTIONS_INSTAGRAM || "http://localhost:5001/incameo-test/us-central1/api/instagramVerify",

  },
    vite: {
        server: {
          hmr: {
            protocol: 'ws',
            host: 'localhost',
          }
        }
    }
})
