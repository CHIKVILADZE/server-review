import express from 'express';
import { login, register, checkAuth, logout } from '../controllers/auth.js';

const app = express();

app.use(express.json());

const router = express.Router();

router.post('/login', login);
router.get('/checkauth', checkAuth);
router.post('/register', register);
router.post('/logout', logout);

export default router;
