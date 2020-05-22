const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// user 1 is the sender and user 2 is the receiver of the friend request
const FriendshipSchema = new Schema({
  user1: { type: Schema.Types.ObjectId, ref: "User", required: true },
  user2: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, required: false, default: "Pending" },
});

//Export model
module.exports = mongoose.model("Friendship", FriendshipSchema);
