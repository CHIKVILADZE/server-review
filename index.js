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
  const newUser = await prisma.user.create({ data: req.body });
  res.json(newUser);
});

app.put('/:id', async (req, res) => {
  const id = req.params.id;
  const newFirstName = req.body.firstName;
  const updatedUser = await prisma.user.update({
    where: { id: parseInt(id) },
    data: { firstName: newFirstName },
  });
  res.json(updatedUser);
});

app.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const deletedUser = await prisma.user.delete({
    where: { id: parseInt(id) },
  });
  res.json(deletedUser);
});

app.listen(4000, () => {
  console.log('Server is listening on port 4000');
});
