const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    NCR: {
      type: Number,
      required: [true, 'NCR number is required'],
      unique: true
    },
    Customer: { type: String, required: true },
    orderNo: { type: Number, required: false },
    replacementOrder: { type: String, default: null },
    invoiceNo: { type: Number, default: null },
    complaintValue: { type: Number, default: null },
    creditValue: { type: Number, default: null },
    Description: { type: String, default: null },
    raisedBy: { type: String, required: true },
    dateOpened: { type: Date, required: true },
    dateClosed: { type: Date, default: null },
    gasketType: { type: String, required: false },
    originCode: { type: String, required: false },
    rootCauseCode: { type: String, required: false },
    supplier: { type: String, required: false },
    accept: { type: Boolean, default: true }
  },
  { collection: 'Test1' }
);

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
