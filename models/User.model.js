const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    role:{
      type: String,
      required: true,
      enum:["admin", "user"],
      default: "user"
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    eventsAsistance: {
      type: Schema.Types.ObjectId,
      ref: Event,
    }
  },
);

const User = model("User", userSchema);

module.exports = User;
