const { Schema, model } = require("mongoose");



const sessionSchema = new Schema({

sessionName: {
    type: String,
    required: true
},
eventName: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true
},
description: {
    type: String
},
day: {
    type: Number,
    required: true
},

dateSession: {
    type: String,
    required: true
},

startHour: {
    type: String,
    required: true
},
endHour: {
    type: String,
    required: true
},
isAvailable: {
    type: Boolean,
    required: true,
    default: false
},

hall: {
    type: String,
    
},
capacityHall: Number,
hostedBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
},
assistants: [{
    type: Schema.Types.ObjectId,
    ref: "User"
}]
})










const Session = model("Session", sessionSchema);

module.exports = Session;


