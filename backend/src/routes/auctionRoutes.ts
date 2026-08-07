import { Router } from 'express';
import { placeBid, getBids, getMyBids } from '../controllers/auctionController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/bids', authMiddleware, placeBid);
router.get('/bids/:propertyId', getBids);
router.get('/my-bids', authMiddleware, getMyBids);

export default router;
