import express from 'express';

import {
  getAllUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
} from '../controllers/user.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:userId', getUser);
router.post('/', addUser);
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser);

export default router;
