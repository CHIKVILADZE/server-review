import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session'; // Import express-session
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';
import likeRoutes from './routes/likes.js';
import authRoutes from './routes/auth.js';
import googleAuthRoutes from './routes/googleAuth.js';
import profileRoutes from './routes/profile-route.js';
import dotenv from 'dotenv';
import cookieSession from 'cookie-session';
import passport from 'passport';
import passportSetup from './passport-setup.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

// app.use(
//   cookieSession({
//     name: 'session',
//     keys: ['Giorgi'],
//     maxAge: 24 * 60 * 60 * 100,
//   })
// );

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.use(passport.initialize());
app.use(passport.session());

const prisma = new PrismaClient();
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: 'GET, POST, PUT, DELETE',
    credentials: true,
  })
);

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Credentials', true);
//   next();
// });

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/auth', authRoutes);
app.use('/auth', googleAuthRoutes);
// app.use('/profile', profileRoutes);

// GOOGLE AUTH ROUTES

// app.get(
//   '/google',
//   passport.authenticate('google', {
//     scope: ['profile', 'email'],
//   })
// );

// app.get(
//   '/google/callback',
//   passport.authenticate('/auth/google', {
//     successRedirect: process.env.CLIENT_URL,
//     failureRedirect: '/login/failed',
//   }),
//   (req, res) => {
//     // Successful authentication, redirect to a page or send a response
//     res.redirect('/dashboard');
//   }
// );

/// USUAL ROUTES

app.get('/', async (req, res) => {
  const allUsers = await prisma.user.findMany();
  res.json(allUsers);
});

app.post('/', async (req, res) => {
  try {
    const newUser = await prisma.user.create({ data: req.body });
    console.log(newUser);
    res.json(newUser);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while creating the user.' });
  }
});

app.put('/:id', async (req, res) => {
  const id = req.params.id;
  const newFirstName = req.body.firstName;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: { firstName: newFirstName },
    });
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while updating the user.' });
  }
});

app.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const deletedUser = await prisma.user.delete({
    where: { id: id },
  });
  res.json(deletedUser);
});

app.post('/comment', async (req, res) => {
  try {
    const newComment = await prisma.comment.create({ data: req.body });
    console.log(newComment);
    res.json(newComment);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while creating the post.' });
    console.log(error);
  }
});

app.get('/comment', async (req, res) => {
  const allComment = await prisma.comment.findMany({
    include: {
      post: true,
    },
  });
  res.json(allComment);
});

app.listen(4000, () => {
  console.log('Server is listening on port 4000');
});
