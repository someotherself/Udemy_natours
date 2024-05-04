const express = require('express');
const viewController = require('../controllers/viewsController');

const router = express.Router();

// Rendering the PUG templates
router.get('/', viewController.getOverview);
router.get('/tour/:slug', viewController.getTour);

module.exports = router;
