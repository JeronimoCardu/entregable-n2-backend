const TicketModel = require("../models/Ticket.js");

class TicketDAO {
  async create(data) {
    return TicketModel.create(data);
  }

  async findById(id) {
    return TicketModel.findById(id);
  }
}

module.exports = TicketDAO;
