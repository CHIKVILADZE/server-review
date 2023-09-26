import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

import passport from 'passport';

router.get('/login/success', (req, res) => {
  const accessToken = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET_KEY);

  if (req.user) {
    res.status(200).json({
      success: true,
      message: 'success',
      accessToken: accessToken,
      cookies: req.cookies,
      user: {
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        isAdmin: req.user.isAdmin,
        isBlocked: req.user.isBlocked,
      },
    });
    console.log('req.user123:', req.user);
  }
});

router.get('/login/failed', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'failure',
  });
});

router.get('/logout', (req, res) => {
  req.logout(function () {});
  res.redirect('http://localhost:3000/login');
});

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: '/auth/login/failed',
  })
);

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/github', passport.authenticate('github', { scope: ['profile'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: '/auth/login/failed',
  })
);
router.get('/github', passport.authenticate('github', { scope: ['profile'] }));

export default router;
