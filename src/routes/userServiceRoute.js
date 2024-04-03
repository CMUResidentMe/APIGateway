import { Router } from 'express';
import { registerUser, loginUser } from '../handlers/userHandler.js';
import { userRegistrationValidation, userLoginValidation } from '../middleware/userValidation.js';

const router = Router();

router.post('/register', userRegistrationValidation, registerUser);
router.post('/login', userLoginValidation, loginUser);
  

export default router;
