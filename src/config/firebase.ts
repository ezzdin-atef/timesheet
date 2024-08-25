import { initializeApp } from "firebase/app";
import { CACHE_SIZE_UNLIMITED, initializeFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCoi83vPOxVV2i2IJ702TKtXudL2dL_GnU",
  authDomain: "rtimesheet-73195.firebaseapp.com",
  projectId: "rtimesheet-73195",
  storageBucket: "rtimesheet-73195.appspot.com",
  messagingSenderId: "746113993629",
  appId: "1:746113993629:web:e7dfb423a565aee857fd74",
  measurementId: "G-PF7PDNZLKZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});


