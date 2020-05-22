const mongoose = require("mongoose");
const findOrCreate = require("mongoose-find-or-create");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  githubId: { type: String, required: true },
  name: { type: String, required: true },
});

UserSchema.plugin(findOrCreate);

//Export model
module.exports = mongoose.model("User", UserSchema);
