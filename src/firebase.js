// import { getAuth } from "firebase/auth";
// import { initializeApp } from "firebase/app";
// import { getDatabase } from "firebase/database";

// const firebaseConfig = {
//   apiKey: "AIzaSyD-NeT8qDJE8giCrHpZisNhToCyNkOt9Ww",
//   authDomain: "accountingproject-fa04c.firebaseapp.com",
//   projectId: "accountingproject-fa04c",
//   storageBucket: "accountingproject-fa04c.firebasestorage.app",
//   messagingSenderId: "805324170337",
//   appId: "1:805324170337:web:fb674863935c999060f620"
// };

// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);
// export const db = getDatabase(app); // обязательно getDatabase(app)

import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD-NeT8qDJE8giCrHpZisNhToCyNkOt9Ww",
  authDomain: "accountingproject-fa04c.firebaseapp.com",
  projectId: "accountingproject-fa04c",
  storageBucket: "accountingproject-fa04c.firebasestorage.app",
  messagingSenderId: "805324170337",
  appId: "1:805324170337:web:fb674863935c999060f620"
};

const app = initializeApp(firebaseConfig);

// Указываем правильный URL Realtime Database
export const db = getDatabase(app, "https://accountingproject-fa04c-default-rtdb.europe-west1.firebasedatabase.app");

export const auth = getAuth(app);