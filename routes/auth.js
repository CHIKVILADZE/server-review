import express from 'express';
import { login, register, logout } from '../controllers/auth.js';

const app = express();

app.use(express.json());

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);

// router.get('/logout', (req, res) => {
//   req.logout();
//   res.redirect(process.env.CLIENT_URL);
// });

// router.get('/login/failed', (req, res) => {
//   res.status(401).json({
//     success: false,
//     message: 'failure',
//   });
// });

export default router;
