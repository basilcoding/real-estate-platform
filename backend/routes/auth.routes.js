import express from 'express';
import { loginAdmin, logout, getCurrentUser } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';
import { z } from 'zod';

const router = express.Router();

const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })
});

router.post('/login', validate(loginSchema), loginAdmin);
router.post('/logout', logout);
router.get('/me', protect, getCurrentUser); // Get current user info

export default router;