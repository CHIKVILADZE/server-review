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
        password: true,
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
        password: req.body.password,
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
  if (!token) return res.status(401).json('Not authenticated!');

  jwt.verify(token, 'secretkey', async (err, userInfo) => {
    if (err) return res.status(403).json('Token is not valid!');

    const userId = user.id;

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name: req.body.name,
          city: req.body.city,
          website: req.body.website,
          profilePic: req.body.profilePic,
          coverPic: req.body.coverPic,
        },
      });

      if (updatedUser) return res.json('Updated!');
      return res.status(403).json('You can update only your profile!');
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
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

    if (userInfo.id !== userId) {
      return res.status(403).json('You can only delete your own profile.');
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
