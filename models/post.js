const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  content: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  likes: { type: Number, required: false, default: 0 },
});

//Export model
module.exports = mongoose.model("Post", PostSchema);
