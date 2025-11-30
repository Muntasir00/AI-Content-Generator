import express from 'express';
import {
  generateContent,
  listContents,
  getContentById,
  getContentByJobId,
  deleteContent,
} from '../controllers/contentController.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';

const router = express.Router();

router.post('/generate', isAuthenticated, generateContent);

router.get('/', isAuthenticated, listContents);
router.get('/id/:id', isAuthenticated, getContentById);
router.get('/job/:jobId', isAuthenticated, getContentByJobId);
router.delete('/id/:id', isAuthenticated, deleteContent);

export default router;
