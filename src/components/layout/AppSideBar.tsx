import { motion } from "motion/react";

export default function AppSideBar() {
  return (
    <motion.div className="side-bar">
      <div className="logo">
        <div className="logo-picture"></div>
        <h1>AccountingApp</h1>
      </div>
      <div className="menu-settings">
        <div className="menu">
          <ul>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
        <div className="settings">
          <div className="profile"></div>
          <div className="exit"></div>
        </div>
      </div>
      <div className="user-profile"></div>
    </motion.div>
  );
}
