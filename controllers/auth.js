import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const register = async (req, res) => {
  const { firstName, lastName, email, password, authMethod } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: 'User with this email already exists.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const newUser = await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        authMethod: authMethod,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while registering the user.' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(401).send('User not found!');
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return res.status(401).send('Invalid email or password.');
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    const { password: _, ...others } = user;

    res
      .cookie('accessToken', token, {
        httpOnly: true,
      })
      .status(200)
      .send(others);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while logging in.');
  }
};

export const logout = (req, res) => {
  res
    .clearCookie('accessToken', {
      secure: true,
      sameSite: 'none',
    })
    .status(200)
    .json('User has been logged out');
};
