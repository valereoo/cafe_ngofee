const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/drinkController');

router.get('/top/:type', ctrl.getTopDrinks); 
router.post('/checkout', ctrl.checkout);
router.get('/:id', ctrl.getDrinkById);
router.get('/', ctrl.getAllDrinks); 

module.exports = router;