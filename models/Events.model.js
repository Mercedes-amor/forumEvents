const { Schema, model } = require("mongoose");

const eventSchema = new Schema({

eventName: {
type: String,
required:true
},
startDate: {
    type: Date,
    required:true
},
endDate:{
    type: Date,
    required:true
},
itsFree: {
    type: Boolean,
    default: true,
    required:true
} ,
capacity: {
    type: Number,
    required:true
},
sector: {
    type: String,
    enum: ["tecnológico", "medicina", "ciencia", "gastronómico","ocio"],
    required: true
},
imgEvent: String,
description: {
    type: String,
    required: true
}

})

const Event = model("Event", eventSchema);

module.exports = Event;
