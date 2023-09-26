import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isAdmin: true,
      },
    });

    return res.json(allUsers);
  } catch (error) {
    console.error(error);
    return res.status(500).json('An error occurred while fetching users.');
  }
};

export const getUser = async (req, res) => {
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

export const addUser = async (req, res) => {
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });

    if (existingUser) {
      return res.status(400).json('User with this email already exists.');
    }

    const newUser = await prisma.user.create({
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        isAdmin: req.body.isAdmin,
      },
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json('An error occurred while creating the user.');
  }
};

export const updateUser = async (req, res) => {
  const userId = req.params.userId;

  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.replace('Bearer ', '');
  const { isAdmin } = req.body;
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY, {
      algorithms: ['HS256'],
    });

    if (decodedToken.id) {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          isAdmin: isAdmin,
        },
      });

      if (updatedUser) {
        return res.json(updatedUser);
      }

      return res.status(403).json('User not found or update failed!');
    }

    return res
      .status(403)
      .json({ error: 'You are not authorized to update users.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const blockUser = async (req, res) => {
  const userId = req.params.userId;

  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const { isBlocked } = req.body;

    const blockedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isBlocked: isBlocked,
      },
    });

    console.log('Blocked User:', blockedUser);

    if (blockedUser) return res.json(blockedUser);

    return res.json('User has blocked.');
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json('An error occurred while blocking the user.');
  }
};
export const deleteUser = async (req, res) => {
  const userId = req.params.userId;

  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.replace('Bearer ', '');
  console.log('decodedToken.id', 'userIDD', userId, 'isADmin');

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY, {
      algorithms: ['HS256'],
    });

    if (decodedToken.id) {
      await prisma.user.delete({
        where: {
          id: userId,
        },
      });

      return res.json('User has been deleted.');
    }

    return res.status(403).json('You are not authorized to delete this user.');
  } catch (error) {
    console.error(error);
    return res.status(500).json('An error occurred while deleting the user.');
  }
};
