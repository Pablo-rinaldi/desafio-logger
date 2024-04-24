const TicketModel = require("../models/ticket.model.js");

class TicketRepository {
  async createTicket(purchaser, amount) {
    try {
      const purchaseDatetime = new Date();
      const newTicket = new TicketModel({
        purchaser,
        amount,
        purchase_datetime: purchaseDatetime,
      });
      await newTicket.save();
      return newTicket;
    } catch (error) {
      console.log(error);
      req.logger.error("No se puede crear el ticket");

      throw new Error("No se puede crear el ticket");
    }
  }
}

module.exports = TicketRepository;
