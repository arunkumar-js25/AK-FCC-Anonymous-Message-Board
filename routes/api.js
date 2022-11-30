'use strict';
require('dotenv').config();
let mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const threadSchema = new mongoose.Schema({
    board : { type: String },
    text : { type: String },
    delete_password : { type: String },
    created_on : { type: Date },
    bumped_on : { type: Date },
    reported : { type: Boolean },
    replycount : { type: Number },
    replies : {
      type: [{
        '_id': {type:String},
        "text": {type:String},
        "created_on": { type: Date }
        }]
    }
});

const replySchema = new mongoose.Schema({
    board : { type: String },
    thread_id : { type: String },
    text : { type: String },
    delete_password : { type: String },
    created_on : { type: Date },
    bumped_on : { type: Date },
    reported : { type: Boolean }
});

let thread = mongoose.model("Threads", threadSchema);
let reply = mongoose.model("Reply", replySchema);

module.exports = function (app) {

  app.route('/api/threads/:board')
  .get(function(req,res){
    console.log("GET METHOD >> /api/threads/:board");
    console.log(req.params);
    console.log(req.body);
    
    let board = req.params.board;

    if(board == undefined || board == ''){
      return res.send("Not Found");
    }

    thread.find({board:board})
      .sort({created_on:-1})
      .limit(10)
      .select({delete_password : 0, reported : 0})
      .exec(function(err, data) {
      if (err) return console.error(err);
      //console.log(data);
      return res.json(data);
    });
    
  })
  .post(function(req,res){
    console.log("POST METHOD >> /api/threads/:board");
    console.log(req.params);
    console.log(req.body);

    let board = req.params.board;
    let dataLoad = req.body;

    if(board == undefined || board == ''){
      return res.send("Not Found");
    }
      dataLoad.board = board;
      let dateOP = new Date();
      dataLoad.created_on = dateOP;
      dataLoad.bumped_on = dateOP;
      dataLoad.reported = false;
      dataLoad.replycount = 0;
      dataLoad.replies = [];
      
      thread.create(dataLoad,function(err, data) {
        if (err) return console.error(err);
        //delete data.__v;
        //return res.json(data);
        return res.redirect('/b/'+board+'/');
      });
      
  })
  .put(function(req,res){
    console.log("PUT METHOD >> /api/threads/:board");
    console.log(req.params);
    console.log(req.body);

    let board = req.params.board;
    let thread_id = req.body.thread_id;

    if(board == undefined || board == ''){
      return res.send("Not Found");
    }

    thread.findByIdAndUpdate(thread_id,{reported:true},{new:true},function(err, data) {
      return res.send('reported');
    });
    
  })
  .delete(function(req,res){
    console.log("DELETE METHOD >> /api/threads/:board");
    console.log(req.params);
    console.log(req.body);

    let board = req.params.board;
    let thread_id = req.body.thread_id;
    let delete_password = req.body.delete_password;

    if(board == undefined || board == ''){
      return res.send("Not Found");
    }
    thread.findById(thread_id,function(err, data) {
      if(data.delete_password == delete_password){
        thread.findByIdAndRemove(thread_id,function(err, data) {
          return res.send('success');
        });
      }
      else{
        return res.send('incorrect password');
      }
    });
  });
    
  app.route('/api/replies/:board')
  .get(function(req,res){
    console.log("GET METHOD >> /api/replies/:board");
    console.log(req.params);
    console.log(req.query);
    console.log(req.body);
    
    let board = req.params.board;
    let thread_id = req.query.thread_id

    if(board == undefined || board == ''){
      return res.send("Not Found");
    }

    thread.findById(thread_id).exec(function(err, data){
        if (err) return console.error(err);
        let newData = {};
        newData._id = data._id;
        newData.text = data.text;
        newData.created_on = data.created_on;
        newData.bumped_on = data.bumped_on;
        newData.replies = data.replies;
        return res.json(newData);
      });
  })
  .post(function(req,res){
    console.log("POST METHOD >> /api/replies/:board");
    console.log(req.params);
    console.log(req.body);

    let board = req.params.board;
    let dataLoad = req.body;
    let thread_id = dataLoad.thread_id

    if(board == undefined || board == ''){
      return res.send("Not Found");
    }
      dataLoad.board = board;
      let dateOP = new Date();
      dataLoad.created_on = dateOP;
      dataLoad.bumped_on = dateOP;
      dataLoad.reported = false;
      
      reply.create(dataLoad,function(err, replydata) {
        if (err) return console.error(err);
        //delete data.__v;
        //return res.json(data);

        thread.findById(thread_id,function(err, data){
          let newReplies = data.replies;
          newReplies.push({'_id':replydata._id,
                       "text":replydata.text,
                       "created_on":dateOP});

        console.log(newReplies);
        thread.findByIdAndUpdate(thread_id,
          {bumped_on:dateOP,replies:newReplies,replycount:data.replycount+1},
          {new:true},
          function(errr, newdata) {
            return res.redirect('/b/'+board+'/');
          });
        });
      });
  })
  .put(function(req,res){
    console.log("PUT METHOD >> /api/threads/:board");
    console.log(req.params);
    console.log(req.body);

    let board = req.params.board;
    let thread_id = req.body.thread_id;
    let reply_id = req.body.reply_id;
    if(board == undefined || board == ''){
      return res.send("Not Found");
    }

    reply.findByIdAndUpdate(reply_id,{reported:true},{new:true},function(err, data)     {
      return res.send('reported');
    });
  })
  .delete(function(req,res){
    console.log("DELETE METHOD >> /api/replies/:board");
    console.log(req.params);
    console.log(req.body);

    let board = req.params.board;
    let thread_id = req.body.thread_id;
    let reply_id = req.body.reply_id;
    let delete_password = req.body.delete_password;

    if(board == undefined || board == ''){
      return res.send("Not Found");
    }
    reply.findById(reply_id,function(err, data) {
      if(data.delete_password == delete_password){
        reply.findByIdAndRemove(thread_id,function(err, data) {

          thread.findById(thread_id,function(err, threadData) {
            let newReplies = threadData.replies;
            newReplies.map(function(i){ if(i._id == reply_id){
              i.text = "[deleted]";
            } });

            thread.findByIdAndUpdate(thread_id,
          {replies:newReplies},
          {new:true},
          function(err, newdata) {
            return res.send('success');
          });
            
          });
          
          
        });
      }
      else{
        return res.send('incorrect password');
      }
    });
  });

};
