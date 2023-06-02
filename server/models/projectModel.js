const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    dec: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
     username: {
        type: String,
    },
    status:{
        type:Boolean,
        default:false
    }
},{ timestamps: true });

module.exports = mongoose.model("projects", projectSchema);