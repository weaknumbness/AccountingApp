// import { useEffect, useState } from "react";
// import { onAuthStateChanged, signOut, type User } from "firebase/auth";
// import { auth } from "../services/firebase/firebase";
// import { AuthPage } from "../features/auth/AuthPage";
// import { AppHeader } from "../components/layout/AppHeader";
import "../styles/reset.css";
import "../styles/newStyle.css";
import AppSideBar from "../components/layout/AppSideBar";
import { AppHeader } from "../components/layout/AppHeader";
import AppMainSection from "../components/layout/AppMainSection";

function App() {
  // const [user, setUser] = useState<User | null>(null);
  // const [isAuthLoading, setIsAuthLoading] = useState(true);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //     setUser(currentUser);
  //     setIsAuthLoading(false);
  //   });

  //   return unsubscribe;
  // }, []);

  // const handleLogout = async () => {
  //   await signOut(auth);
  // };

  // if (isAuthLoading) {
  //   return <div>Загрузка...</div>;
  // }

  // if (!user) {
  //   return <AuthPage />;
  // }

  return (
    <div className="main">
      {/* <AppHeader userEmail={user.email} onLogout={handleLogout} />

      <main>
        <h2>Главный экран приложения</h2>
        <p>Авторизация восстановлена. Следующий шаг — категории.</p>
      </main> */}
      <AppSideBar/>
      <AppMainSection/>
    </div>
  );
}

export default App;
