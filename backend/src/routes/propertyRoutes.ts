import { Router } from 'express';
import { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty } from '../controllers/propertyController';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.post('/', authMiddleware, roleMiddleware(['seller', 'admin']), createProperty);
router.put('/:id', authMiddleware, updateProperty);
router.delete('/:id', authMiddleware, deleteProperty);

export default router;
