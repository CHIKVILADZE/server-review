import express from 'express';

import {
  getAllUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
  blockUser,
} from '../controllers/user.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/getuser', getUser);
router.post('/', addUser);
router.put('/:userId', updateUser);
router.put('/:userId/block', blockUser);
router.delete('/:userId', deleteUser);

export default router;
