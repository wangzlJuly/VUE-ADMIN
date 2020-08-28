const mongoose = require('mongoose')
const Schema = mongoose.Schema

const movieSchema = new Schema({
  title: String,
  imgurl: String,
  stars: String,
  ratings: String,
  description: String,
  p: {
    type: mongoose.SchemaTypes.ObjectId, //指名数据类型
    ref: 'City'   // 这个写的是people.js里面的model
  }
},
{
  timestamps: true
}
)

const Movie = mongoose.model('Movie', movieSchema, 'movie')

module.exports = Movie