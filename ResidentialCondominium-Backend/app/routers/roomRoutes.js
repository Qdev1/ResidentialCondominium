
const roomController = require('../controllers/roomController');
const router = require('express').Router();
const verifyToken = require('../utils/middleware');

router.get('/search', verifyToken.checkLogin, roomController.searchRooms);

router.post('/', verifyToken.checkLogin, roomController.createRoom);

router.get('/', verifyToken.checkLogin, roomController.getAllRooms);

router.get('/:id', verifyToken.checkLogin, roomController.getRoomById);

router.put('/:id', verifyToken.checkLogin, roomController.updateRoom);

router.delete('/:id', verifyToken.checkLogin, roomController.deleteRoom);

router.post('/addResident', verifyToken.checkLogin, roomController.addResidentToRoom);

router.post('/removeResident', verifyToken.checkLogin, roomController.removeResidentFromRoom);

module.exports = router;
