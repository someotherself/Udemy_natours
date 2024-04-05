const mongoose = require('mongoose');

// const complaintSchema = new mongoose.Schema(
//   {
//     NCR: {
//       type: Number,
//       required: [true, 'NCR number is required'],
//       unique: true,
//       immutable: true
//     },
//     Customer: {
//       type: String,
//       required: [true, 'An NCR must be associated to a customer.']
//     },
//     orderNo: {
//       type: Number,
//       required: false
//     },
//     complaintValue: { type: Number, default: null },
//     Description: { type: String, default: null }
//   },
//   { collection: 'Complaints_test' }
// );

const complaintSchema = new mongoose.Schema(
  {
    NCR: {
      type: Number,
      required: [true, 'NCR number is required'],
      unique: true
    },
    Customer: { type: String, required: true },
    orderNo: { type: Number, required: false },
    replacementOrder: { type: Number, default: null },
    invoiceNo: { type: Number, default: null },
    complaintValue: { type: Number, default: null },
    creditValue: { type: Number, default: null },
    Description: { type: String, default: null },
    raisedBy: { type: String, required: true },
    dateOpened: { type: Date, required: true },
    dateClosed: { type: Date, default: null },
    gasketType: { type: String, required: true },
    originCode: { type: String, required: true },
    rootCauseCode: { type: String, required: true },
    supplier: { type: String, required: true },
    accept: { type: Boolean, default: true }
  },
  { collection: 'Test1' }
);

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
