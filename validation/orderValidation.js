const Joi = require('joi');
const orderSchema = Joi.object({
  petId: Joi.string().required(),
  quantity: Joi.number().min(1).max(5).required(),
  shipDate: Joi.date().required(),
  status: Joi.string().valid('placed','approved','delivered').required()
})
module.exports = {orderSchema}