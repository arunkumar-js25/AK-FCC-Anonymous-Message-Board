'use strict';
require('dotenv').config();
let mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const threadSchema = new mongoose.Schema({
    board : { type: String },
    text : { type: String },
    delete_password : { type: String },
    created_on : { type: String },
    bumped_on : { type: date },
    reported : { type: boolean },
    replies : {
      type: [String]
    }
});

const replySchema = new mongoose.Schema({
    threadId : { type: String },
    text : { type: String },
    delete_password : { type: String },
    created_on : { type: String },
    bumped_on : { type: date },
    reported : { type: boolean }
});

let thread = mongoose.model("Threads", threadSchema);
let reply = mongoose.model("Reply", replySchema);

module.exports = function (app) {

  app.route('/api/threads/:board')
  .post(function(req,res){
    
  })
  .put(function(req,res){
    
  })
  .delete(function(req,res){
    
  });
    
  app.route('/api/replies/:board')
  .post(function(req,res){
    
  })
  .put(function(req,res){
    
  })
  .delete(function(req,res){
    
  });

};
