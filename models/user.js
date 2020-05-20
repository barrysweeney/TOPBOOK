const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true, select: false }, // https://www.curtismlarson.com/blog/2016/05/11/mongoose-mongodb-exclude-select-fields/
});

//Export model
module.exports = mongoose.model("User", UserSchema);
