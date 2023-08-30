import express from 'express';
import { login, register, logout } from '../controllers/auth.js';

import passport from 'passport';
const app = express();

app.use(express.json());

const router = express.Router();

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect('/auth/login');
  } else {
    next();
  }
};

router.get('/', authCheck, (req, res) => {
  if (req.user && req.user.firstName) {
    res.redirect('http://localhost:3000');
  } else {
    res.send('You are not logged in.');
  }
});

export default router;
