import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';
import likeRoutes from './routes/likes.js';
import authRoutes from './routes/auth.js';
import movieRoutes from './routes/movies.js';
import bookRoutes from './routes/books.js';
import gameRoutes from './routes/games.js';
import googleAuthRoutes from './routes/googleAuth.js';
import reviewRoutes from './routes/reviews.js';
import cookieSession from 'cookie-session';
import passport from 'passport';
import { getTopRatedPosts } from './controllers/post.js';

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ['https://client-review-seven.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(
  cookieSession({
    name: 'session',
    keys: [process.env.SECRET_KEY],
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);

app.use('/api/reviews', reviewRoutes);
app.use('/auth', googleAuthRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/games', gameRoutes);

app.get('/api/top-posts', getTopRatedPosts);

app.listen(4000, () => {
  console.log('Server is listening  port 4000');
});
