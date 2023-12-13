const express = require('express');
const router = express.Router();
const accessCardController = require('../controllers/accessCardController');


router.get('/search', accessCardController.searchAccessCards);
router.get('/', accessCardController.getAllAccessCards);
router.get('/:cardId', accessCardController.getAccessCardById);
router.post('/', accessCardController.createAccessCard);
router.put('/:cardId', accessCardController.updateAccessCard);
router.delete('/:cardId', accessCardController.deleteAccessCard);

module.exports = router;
