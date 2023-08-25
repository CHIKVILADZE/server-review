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

app.listen(4000, () => {
  console.log('Server is listening on port 4000');
});
