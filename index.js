const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

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

app.listen(4000, () => {
  console.log('Server is listening on port 4000');
});
