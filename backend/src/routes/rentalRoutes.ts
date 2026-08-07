import { Router } from 'express';
import { createRental, getRentals, getMyRentals, updateRentalStatus } from '../controllers/rentalController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, createRental);
router.get('/', getRentals);
router.get('/my-rentals', authMiddleware, getMyRentals);
router.put('/:id', authMiddleware, updateRentalStatus);

export default router;
