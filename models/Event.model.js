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
    enum: ["Otro","tecnológico", "medicina", "ciencia", "gastronómico","ocio"],
    required: true
},
imgEvent: {
    type:String,
//    default: "https://ipmark.com/wp-content/uploads/eventos-5-800x445.jpg"
},
description: {
    type: String,
    required: true
}

})

const Event = model("Event", eventSchema);

module.exports = Event;
