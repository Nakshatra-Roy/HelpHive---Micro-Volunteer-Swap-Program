const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController.js');

router.get('/', offerController.getAllOffers);
router.get('/:id', offerController.getOfferById);
router.get('/offers/user/:userId', offerController.getOffersByUser);
router.post('/', offerController.createOffer);
router.put('/:id', offerController.updateOffer);
router.delete('/:id', offerController.deleteOffer);
module.exports = router;