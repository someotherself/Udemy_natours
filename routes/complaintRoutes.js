const express = require('express');
const complaintController = require('./../controllers/complaintController.js');
const authenticationController = require('./../controllers/authenticationController');
// Routes. Mounting the router
const router = express.Router();

router.route('/openComplaints').get(complaintController.aliasOpenComplaint, complaintController.getAllComplaints);
router.route('/complaintStats').get(complaintController.getComplaintStats);
router.route('/monthlyStats/:year').get(complaintController.getMonthlyStats);
router
  .route('/')
  .get(authenticationController.protect, complaintController.getAllComplaints)
  .post(complaintController.createComplaint);
router
  .route('/:id')
  .get(complaintController.getComplaint)
  .patch(complaintController.updateComplaint)
  .delete(
    authenticationController.protect,
    authenticationController.restrict('admin'),
    complaintController.deleteComplaint
  );
module.exports = router;
