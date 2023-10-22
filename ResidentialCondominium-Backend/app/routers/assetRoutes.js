const assetController = require('../controllers/assetController');
const reportController = require('../controllers/reportController');

const router = require('express').Router();
const verifyToken = require('../utils/middleware');

router.get('/statistics', verifyToken.checkLogin, reportController.generateAssetStatistics);

router.get('/', verifyToken.checkLogin, assetController.getAllAssets);

router.post('/', verifyToken.checkLogin, assetController.createAsset);

router.put('/:id', verifyToken.checkLogin, assetController.updateAsset);

router.delete('/:id', verifyToken.checkLogin, assetController.deleteAsset);

router.get('/search', verifyToken.checkLogin, assetController.searchAssets);

router.get('/:id', verifyToken.checkLogin, assetController.getAssetById);

router.post('/reports', verifyToken.checkLogin, reportController.createAssetReport);

router.get('/:assetId/reports', verifyToken.checkLogin, reportController.getAssetReports);


module.exports = router;
