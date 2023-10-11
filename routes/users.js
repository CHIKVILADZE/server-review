import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import {
  getAllUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
  blockUser,
} from '../controllers/user.js';
import { verifyToken } from '../utils/verifyToken.js';
const prisma = new PrismaClient();

const router = express.Router();

router.get('/', getAllUsers);
router.get('/checkauth', verifyToken, async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY, {
      algorithms: ['HS256'],
    });

    if (!decodedToken || !decodedToken.id) {
      return res.status(401).json({ error: 'Invalid token' });
    }

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
    return res.status(403).json({ error: 'Token is not validddd' });
  }
});

router.get('/getuser', getUser);
router.post('/', addUser);
router.put('/:userId', updateUser);
router.put('/:userId/block', blockUser);
router.delete('/:userId', deleteUser);

export default router;
