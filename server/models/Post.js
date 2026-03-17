const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const PostSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  createdAt:{
    type: Date,
    default: Date.now,
  },
   updatedAt:{
    type: Date,
    default: Date.now,
  },
});
  

module.exports = mongoose.model("Post", PostSchema);