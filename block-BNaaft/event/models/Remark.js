var mongoose = require('mongoose')
var Schema = mongoose.Schema
var remarkSchema = new Schema(
  {
    author: String,
    title: { type: String, required: true },
    likes: { type: Number, default: 0 },
    eventId: { type:Schema.Types.ObjectId, ref: 'Event' }
  },
  { timestamps: true },
)
module.exports = mongoose.model("Remark",remarkSchema)
