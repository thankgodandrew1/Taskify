const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');

router.use('/', require('./swagger'));
router.get('/', homeController.getHome);

module.exports = router;
