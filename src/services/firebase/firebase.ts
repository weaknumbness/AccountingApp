import { getAuth } from "firebase/auth";
import { app } from "./client";
export { db, isConfigured } from "./client";
export const auth = app ? getAuth(app) : null;
