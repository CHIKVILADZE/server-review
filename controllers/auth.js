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
    console.log(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
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

    jwt.sign(
      { id: user.id },
      'secretKey',
      { expiresIn: '10' },
      (err, token) => {
        res.json({ token: token });
      }
    );

    // req.session.accessToken = accessToken;

    const { password: _, ...others } = user;

    res.status(200).json(token);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
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
