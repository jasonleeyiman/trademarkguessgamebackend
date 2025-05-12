var express = require('express');
const cors = require('cors');
var router = express.Router();
const { connectToDB, ObjectId } = require('../utils/db');
const axios=require('axios');
const { generateToken } = require('../utils/auth');
const jwt = require('jsonwebtoken');
router.use(cors());
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
router.post('/register', async function(req, res, next) {
  const db=await connectToDB();
  try{
    let result = await db.collection("Player").insertOne(req.body);
    res.status(201).json({ id: result.insertedId });
  }catch(e){
    res.status(400).json({ message: e.message });
  }finally{
    await db.client.close();
  }
});
router.post('/api/login', async function(req, res, next){
  const db=await connectToDB();
  try{
    var user=await db.collection('Player').findOne({email: req.body.email});
    if(!user){
      res.status(401).json({message: "User not found"});
      return;
    }
    if(req.body.password!=user.password){
      res.status(401).json({message: "Incorrect password"});
      return;
    }
    delete user.password;
    const token = generateToken(user);
    res.status(200).json({ token: token });
  }catch(err){
    res.status(400).json({message: err.message});
  }finally{
    await db.client.close();
  }
});
router.get('/fetch/game/rules', async function(req,res){
  const db=await connectToDB();
  try{
    const token=req.headers.authorization;
    if(token!=null){
      if(!jwt.decode(token).isAdmin){
        let result=await db.collection('Rules').find().toArray();
        res.status(201).json({result});
      }else{
        res.status(401).json({message: 'You do not have the permission'});
      }
    }else{
      res.status(401).json({message: 'You do not have the permission'});
    }
  }catch(err){
    res.status(400).json({message: err.message});
  }finally{
    await db.client.close();
  }
});
router.post('/calculate/result/:unitname', async function(req,res){
  const db=await connectToDB();
  let totalScore=0;
  try{
    const token=req.headers.authorization;
    if(token!=null){
      if(!jwt.decode(token).isAdmin){
        let result=await db.collection('Questions').findOne({unitName: req.params.unitname});
        if(result&&result.questions){
          let correctAnswers = result.questions.map(question => question.correctAnswer);
          let playerAnswers = req.body.answer;
          for(let i=0; i<correctAnswers.length; i++){
            const playerAnswer = playerAnswers[i].trim().toLowerCase();
            const correctAnswer = correctAnswers[i].trim().toLowerCase();
            if(playerAnswer===correctAnswer){
              totalScore+=10;
            }
          }
          res.status(200).json({score: totalScore});
        }else{
          console.log("No questions found.");
        }
      }else{
        res.status(401).json({message: 'You do not have the permission'});
      }
    }else{
      res.status(401).json({message: 'You do not have the permission'});
    }
  }catch(e){
    res.status(400).json({nessage: e.message});
  }finally{
    await db.client.close();
  }
});
router.put('/modify/player/pass', async function(req,res){
  const db=await connectToDB();
  try{
    const token=req.headers.authorization;
    if(token!=null){
      if(!jwt.decode(token).isAdmin){
        let emailAddress=jwt.decode(token).email;
        let result=await db.collection('Player').updateOne({email: emailAddress}, {$push: {pass: req.body.unitName}});
        if(result.modifiedCount>0){
          res.status(200).json({message: 'Player updated successfully'});
        }else{
          res.status(404).json({message: 'Player not found'});
        }
      }else{
        res.status(401).json({message: 'You do not have the permission'});
      }
    }else{
      res.status(401).json({message: 'You do not have the permission'});
    }
  }catch(e){
    res.status(400).json({message: e.messge});
  }finally{
    await db.client.close();
  }
});
module.exports = router;
