const assetController = require('../controllers/assetController');
const router = require('express').Router();
const verifyToken = require('../utils/middleware');

router.get('/', verifyToken.checkLogin, assetController.getAllAssets);

router.post('/', verifyToken.checkLogin, assetController.createAsset);

router.put('/:id', verifyToken.checkLogin, assetController.updateAsset);

router.delete('/:id', verifyToken.checkLogin, assetController.deleteAsset);

router.get('/search', verifyToken.checkLogin, assetController.searchAssets);

router.get('/:id', verifyToken.checkLogin, assetController.getAssetById);

module.exports = router;
