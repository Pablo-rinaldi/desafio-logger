const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4(),
  },
  purchase_datetime: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
});

const TicketModel = mongoose.model("tickets", ticketSchema);

module.exports = TicketModel;
