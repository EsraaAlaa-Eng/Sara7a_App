import { Router } from "express";
import * as authService from "./auth.service.js";
const router = Router();

router.post("/signup", authService.signup);
router.post("/login", authService.login);
router.post('/refresh-token',authService.refreshToken);

router.post("/signup/gmail", authService.signupWithGmail);
// router.patch("/updatePassword", authService.updatePassword); 

export default router;
