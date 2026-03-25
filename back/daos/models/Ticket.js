const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    purchase_datetime: { type: Date, default: Date.now },
    amount: { type: Number, required: true, min: 0 },
    purchaser: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

const TicketModel = mongoose.model("Ticket", TicketSchema);

module.exports = TicketModel;
