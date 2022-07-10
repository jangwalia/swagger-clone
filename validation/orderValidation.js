const Joi = require('joi');


const orderSchema = Joi.object({
  petId: Joi.string().required(),
  quantity: Joi.number().required.min(1).max(5),
  shipDate: Joi.date().required(),
  status: Joi.string().valid('placed','approved','delivered').required()
})
module.exports = {orderSchema}