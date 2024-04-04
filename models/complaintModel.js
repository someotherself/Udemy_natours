const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    NCR: {
      type: Number,
      required: [true, 'NCR number is required'],
      unique: true
    },
    Customer: { type: String, required: true },
    orderNo: { type: Number, required: true },
    replacementOrder: { type: Number, default: null },
    invoiceNo: { type: Number, default: null },
    complaintValue: { type: Number, default: null },
    creditValue: { type: Number, default: null },
    Description: { type: String, default: null },
    RaisedBy: { type: String, required: true },
    dateOpened: { type: Date, required: true },
    dateClosed: { type: Date, default: null },
    gasketType: { type: String, required: true },
    originCode: { type: String, required: true },
    rootCauseCode: { type: String, required: true },
    Supplier: { type: String, required: true },
    Accept: { type: Boolean, default: true }
  },
  { collection: 'Test1' }
);

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
