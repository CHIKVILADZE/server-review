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
  const userId = req.params.userId;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        isAdmin: true,
        googleId: true,
        githubId: true,
        authMethod: true,
      },
    });
    console.log('reqParams', req.params);
    if (!user) return res.status(404).json('User not found');
    return res.json(user);
  } catch (error) {
    console.log('reqParams', req.params);
    console.error(error);
    return res.status(500).json(error);
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
  const token = req.cookies.accessToken;
  const userId = req.params.userId;

  if (!token) return res.status(401).json('Not authenticated!');

  jwt.verify(token, 'secretkey', async (err, user) => {
    if (err) return res.status(403).json('Token is not valid!');

    try {
      const { isAdmin } = req.body;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          isAdmin: isAdmin,
        },
      });
      console.log('Updating user:', userId, 'isAdmin:');
      if (updatedUser) return res.json(updatedUser);
      return res.status(403).json('You can update only your profile!');
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  });
};

export const blockUser = async (req, res) => {
  const token = req.cookies.accessToken;
  const userId = req.params.userId;

  if (!token) {
    return res.status(401).json('Not authenticated!');
  }

  jwt.verify(token, 'secretkey', async (err, userInfo) => {
    if (err) {
      return res.status(403).json('Token is not valid!');
    }

    try {
      const { isBlocked } = req.body;

      console.log('User ID:', userId);
      console.log('New Block Status:', isBlocked);

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
  });
};

export const deleteUser = async (req, res) => {
  const userId = req.params.userId;
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json('Not authenticated!');
  }

  jwt.verify(token, 'secretkey', async (err, userInfo) => {
    if (err) {
      return res.status(403).json('Token is not valid!');
    }

    try {
      await prisma.user.delete({
        where: {
          id: userId,
        },
      });

      return res.json('User has been deleted.');
    } catch (error) {
      console.error(error);
      return res.status(500).json('An error occurred while deleting the user.');
    }
  });
};
