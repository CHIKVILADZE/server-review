import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import moment from 'moment';

const prisma = new PrismaClient();

export const getComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: req.query.postId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        text: true,
        createdAt: true,
        postId: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    console.log('GetComments', comments);

    return res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const getCommentById = async (req, res) => {
  const commentId = req.params.id;

  try {
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        id: true,
        text: true,
        createdAt: true,
        postId: true,
        author: {
          select: {
            firstName: true,
            lastName: true,
            id: true,
            // profilePic: true,
          },
        },
      },
    });

    if (!comment) {
      return res.status(404).json('Comment not found');
    }

    return res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const addComment = async (req, res) => {
  const token = req.cookies.accessToken;

  jwt.verify(token, 'secretkey', async (err, decodedToken) => {
    if (err) {
      console.error('JWT Verification Error:', err);
      return res.status(403).json('Token is not valid!');
    }

    // console.log('Decoded JWT User:', user);

    try {
      const newComment = await prisma.comment.create({
        data: {
          text: req.body.text,
          author: {
            connect: {
              id: req.body.userId,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
            },
          },
          post: {
            connect: {
              id: req.body.postId,
            },
          },
        },
      });
      console.log('AddComments', newComment);
      return res.status(200).json('Comment has been created.');
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  });
};

export const deleteComment = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json('Not authenticated!');

  jwt.verify(token, 'jwtkey', async (err, user) => {
    if (err) return res.status(403).json('Token is not valid!');

    const commentId = req.params.id;

    try {
      const deletedComment = await prisma.comment.deleteMany({
        where: {
          id: commentId,
          userId: user.id,
        },
      });

      if (deletedComment.count > 0) {
        return res.json('Comment has been deleted!');
      }

      return res.status(403).json('You can delete only your comment!');
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  });
};
