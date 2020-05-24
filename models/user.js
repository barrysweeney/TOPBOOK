const mongoose = require("mongoose");
const findOrCreate = require("mongoose-find-or-create");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  githubId: { type: String, required: true },
  name: { type: String, required: true },
  photoURL: { type: String, required: false },
});

// needed by the Github Authentication callback in app.js
UserSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", UserSchema);
