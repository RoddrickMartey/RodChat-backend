import { Router } from "express";
import { login, logout, signUp } from "../controllers/auth.controller.js";

const router = Router();

/* 
  Sign up a new user
  Request body (req): { username, password, firstname, surname, avatar, email }
  Response (res): { user data } and JWT token in cookies
*/
router.post("/sign_up", signUp);

/* 
  Login user
  Request body (req): { username, password }
  Response (res): { user data } and JWT token in cookies
*/
router.post("/login", login);

/* 
  Logout user
  Response (res): status 200 and cleared token cookie
*/
router.post("/logout", logout);

export default router;
