import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addReview = async (req, res) => {
  const postId = req.body.postId; // Assuming you send postId in the request body

  try {
    const review = await prisma.review.create({
      data: {
        post: {
          connect: { id: postId }, // Use the PostWhereUniqueInput object
        },
        name: req.body.name,
        rating: parseInt(req.body.rating), // Parse the rating to an integer
      },
    });

    res.status(200).send(review);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating review');
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany();
    res.status(200).send(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching reviews');
  }
};
