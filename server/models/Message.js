const mongoose = require('mongoose');

const MessageSchema =
  new mongoose.Schema({

    room: {
      type: String,
      required: true
    },

    author: {
      type: String,
      required: true
    },

    text: {
      type: String,
      default: ''
    },

    file: {
      type: String,
      default: ''
    },

    fileType: {
      type: String,
      default: ''
    },

    viewed: {
      type: Boolean,
      default: false
    },

    viewedAt: {
      type: Date,
      default: null
    },

    createdAt: {
      type: Date,
      default: Date.now
    }

  });

module.exports =
  mongoose.model(
    'Message',
    MessageSchema
  );