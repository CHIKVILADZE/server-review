import express from 'express';
import { PrismaClient } from '@prisma/client';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';
import likeRoutes from './routes/likes.js';
import authRoutes from './routes/auth.js';
const app = express();

const prisma = new PrismaClient();

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/auth', authRoutes);

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

app.post('/post', async (req, res) => {
  try {
    const newPost = await prisma.post.create({ data: req.body });
    console.log(newPost);
    res.json(newPost);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while creating the post.' });
    console.log(error);
  }
});

app.get('/post', async (req, res) => {
  const allPosts = await prisma.post.findMany({
    include: {
      author: true,
    },
  });
  res.json(allPosts);
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
