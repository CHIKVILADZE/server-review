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

    if (user.isBlocked) {
      return res.status(403).send('User is blocked.');
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return res.status(401).send('Unauthorized');
    }

    if (user) {
      const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
      const { password: _, ...others } = user;

      return res.json({ Login: true, token: accessToken, others });
    } else {
      return res.json('Authentication failed!');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

export const checkAuth = async (req, res) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY, {
      algorithms: ['HS256'],
    });

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        authMethod: true,
        isAdmin: true,
        isBlocked: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('JWT Verification Error:', error);

    return res.status(403).json({ error: 'Token is not valid' });
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
