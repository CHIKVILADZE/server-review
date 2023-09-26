import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const getLikes = async (req, res) => {
  try {
    const likes = await prisma.like.findMany({
      where: {
        postId: req.query.postId,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    return res.status(200).json(likes);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const getLikeById = async (req, res) => {
  const { likeId } = req.params;

  try {
    const like = await prisma.like.findUnique({
      where: {
        id: likeId,
      },
    });

    if (!like) {
      return res.status(404).json('Like not found');
    }

    return res.status(200).json(like);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const addLike = async (req, res) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const newLike = await prisma.like.create({
      data: {
        user: req.body.userId,
        post: req.body.postId,
        post: {
          connect: { id: req.body.postId },
        },
        user: {
          connect: { id: req.body.userId },
        },
      },
    });

    return res.status(200).json('Post has been liked.');
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const deleteLike = async (req, res) => {
  try {
    const { userId, postId } = req.body;

    await prisma.like.deleteMany({
      where: {
        userId: userId,
        postId: postId,
      },
    });

    return res.status(200).json(req.body);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};
