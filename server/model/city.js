const mongoose = require('mongoose')
const Schema = mongoose.Schema

const citySchema = new Schema({
  name: String,
  index: String
},
{
  timestamps: true
}
)

const City = mongoose.model('City', citySchema, 'city')

module.exports = City