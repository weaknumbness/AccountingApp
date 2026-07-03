// import { useEffect, useState } from "react";
// import { onAuthStateChanged, signOut, type User } from "firebase/auth";
// import { auth } from "../services/firebase/firebase";
// import { AuthPage } from "../features/auth/AuthPage";
// import { AppHeader } from "../components/layout/AppHeader";
import "../styles/reset.css";
import "../styles/newStyle.css";
import AppSideBar from "../components/layout/AppSideBar";
import AppMainSection from "../components/layout/AppMainSection";

function App() {
  return (
    <div className="main">
      <AppSideBar />
      <AppMainSection />
    </div>
  );
}

export default App;
