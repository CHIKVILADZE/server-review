import express from 'express';
import { login, register, logout } from '../controllers/auth.js';

import passport from 'passport';
const app = express();

app.use(express.json());

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);

router.get('/login/success', (req, res) => {
  const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET);

  if (req.user) {
    res.status(200).json({
      success: true,
      message: 'success',
      token: token,
      user: {
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
      },
    });
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

router.get('/login/failed', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'failure',
  });
});

export default router;
