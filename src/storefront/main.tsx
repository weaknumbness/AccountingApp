import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Catalog from "./Catalog";
import "./catalog.css";
createRoot(document.getElementById("root")!).render(<StrictMode><Catalog /></StrictMode>);
