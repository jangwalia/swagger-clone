const Joi = require('joi');


const petSchema = Joi.object({
  name: Joi.string().required(),
  status: Joi.string().valid('available','pending','sold').required(),
  category: {
    name: Joi.string().required()
  },
  tags: Joi.array().items(
    Joi.object({
      "name": Joi.string().required()
    })
  ).required()
})
module.exports = {petSchema}
