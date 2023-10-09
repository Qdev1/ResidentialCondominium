const assetCategoryController = require('../controllers/assetCategoryController');
const router = require('express').Router();
const verifyToken = require('../utils/middleware');

router.get('/', verifyToken.checkLogin, assetCategoryController.getAllAssetCategories);

router.post('/', verifyToken.checkLogin, assetCategoryController.createAssetCategory);

router.delete('/:id', verifyToken.checkLogin, assetCategoryController.deleteAssetCategory);

router.put('/:id', verifyToken.checkLogin, assetCategoryController.updateAssetCategory);

router.get('/search', verifyToken.checkLogin, assetCategoryController.searchAssetCategories);

router.get('/:id', verifyToken.checkLogin, assetCategoryController.getAssetCategoryById);

module.exports = router;
