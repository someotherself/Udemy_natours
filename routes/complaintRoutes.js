const express = require("express");
const complaintController = require("./../controllers/complaintController.js");

// Routes. Mounting the router
const router = express.Router();

// Middleware that checks if the ID is valid.
router.param("id", complaintController.checkID);

router
  .route("/")
  .get(complaintController.getAllComplaints)
  .post(complaintController.checkBody, complaintController.createComplaint);
router
  .route("/:id")
  .get(complaintController.getComplaint)
  .patch(complaintController.updateComplaint)
  .delete(complaintController.deleteComplaint);

module.exports = router;
