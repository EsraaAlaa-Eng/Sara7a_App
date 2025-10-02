import { Router } from "express";
import * as authService from "./auth.service.js";
import { validation } from "../../middleware/validation.middleware.js";
import *as validators from './auth.validation.js'

const router = Router({
    caseSensitive: true,
    strict: true,
});
router.post("/signup", validation(validators.signup), authService.signup);
router.post("/login", validation(validators.login), authService.login);
router.post('/refresh-token', authService.refreshToken);
router.patch('/confirm-email', validation(validators.confirmEmail), authService.confirmEmail);
router.post("/signup/gmail", validation(validators.loginWithGmail), authService.signupWithGmail);
router.patch('/send-forgot-password', validation(validators.sendForgotPassword), authService.sendForgotPassword);
router.patch('/verify-forgot-password', validation(validators.verifyForgotPassword), authService.verifyForgotPassword);

router.patch('/reset-forgot-password', validation(validators.resetPassword), authService.resetPassword);



export default router;
