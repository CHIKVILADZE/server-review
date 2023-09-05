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
        userId: true,
      },
    });

    const userIds = likes.map((like) => like.userId);
    return res.status(200).json(userIds);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const addLike = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json('Not logged in!');

  jwt.verify(token, 'secretkey', async (err, userInfo) => {
    if (err) return res.status(403).json('Token is not valid!');

    try {
      const newLike = await prisma.like.create({
        data: {
          userId: userInfo.id,
          postId: req.body.postId,
        },
      });

      return res.status(200).json('Post has been liked.');
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  });
};

export const deleteLike = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json('Not logged in!');

  jwt.verify(token, 'secretkey', async (err, userInfo) => {
    if (err) return res.status(403).json('Token is not valid!');

    try {
      await prisma.like.deleteMany({
        where: {
          userId: userInfo.id,
          postId: req.query.postId,
        },
      });

      return res.status(200).json('Post has been disliked.');
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  });
};
