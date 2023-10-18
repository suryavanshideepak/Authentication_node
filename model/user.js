const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let User = new Schema(
  {
    email:{
      type: String,
      required: true,
    }, 
    password:{
      type: String,
      required: true,
    },
  },
  {
    collection: "user",
  }
);

module.exports = new mongoose.model("mynewuser", User);
