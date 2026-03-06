import { useState } from "react";
import AuthForm from "../Components/AuthForm";
import RegisterForm from "../Components/RegisterForm";

export default function Authorization() {

  const [haveAcc, setHaveAcc] = useState(true);

  const handleToggleAcc = () => {
    setHaveAcc(prev => !prev);
  }

  return <div className="Authorization">
    {haveAcc ? <AuthForm cb={handleToggleAcc}/> : <RegisterForm cb={handleToggleAcc}/>}
  </div>
}