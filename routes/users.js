var express = require('express');
const cors = require('cors');
var router = express.Router();
const { generateToken, isRay } = require('../utils/auth');
const { connectToDB, ObjectId } = require('../utils/db');
const { token } = require('morgan');
router.use(cors());
const jwt = require('jsonwebtoken');
router.post('/release/question',async function(req, res, next) {
  const db=await connectToDB();
  try{
    const token=req.headers.authorization;
    if(token!=null){
      if(jwt.decode(token).isAdmin){
        let result = await db.collection("Questions").insertOne(req.body);
        res.status(201).json({ id: result.insertedId });
      }else{
        res.status(401).json({message: 'You do not have the permission'});
      }
    }else{
      res.status(401).json({message: 'You do not have the permission'});
    }
  }catch(e){
    res.status(400).json({message: e.message});
  }finally{
    await db.client.close();
  }
});
router.get('/fetch/question', async function(req,res){
  const db=await connectToDB();
  try{
    const token=req.headers.authorization;
    if(token!=null){
      let result=await db.collection('Questions').find().toArray();
      res.status(201).json({result});
    }else{
      res.status(401).json({message: 'You do not have the permission'});
    }
  }catch(e){
    res.status(400).json({message: e.message});
  }finally{
    await db.client.close();
  }
});
router.post('/set/rules', async function(req,res){
  const db=await connectToDB();
  try{
    const token=req.headers.authorization;
    if(token!=null){
      if(jwt.decode(token).isAdmin){
        let result = await db.collection("Rules").insertOne(req.body);
        res.status(201).json({ id: result.insertedId });
      }else{
        res.status(401).json({message: 'You do not have the permission'});
      }
    }else{
      res.status(401).json({message: 'You do not have the permission'});
    }
  }catch(e){
    res.status(400).json({message: e.message});
  }finally{
    await db.client.close();
  }
});
router.get('/fetch/rules', async function(req,res){
  const db=await connectToDB();
  try{
    const token=req.headers.authorization;
    if(token!=null){
      if(jwt.decode(token).isAdmin){
        let result=await db.collection('Rules').find().toArray();
        res.status(201).json({result});
      }else{
        res.status(401).json({message: 'You do not have the permission'});
      }
    }else{
      res.status(401).json({message: 'You do not have the permission'});
    }
  }catch(e){
    res.status(400).json({message: e.message});
  }finally{
    await db.client.close();
  }
});
router.put('/modify/rules/:id', async function(req,res){
  const db=await connectToDB();
  try{
    const token=req.headers.authorization;
    if(token!=null){
      if(jwt.decode(token).isAdmin){
        let result = await db.collection("Rules").updateOne({ _id: new ObjectId(req.params.id)}, { $set: req.body } );
        console.log(result.modifiedCount);
        if(result.modifiedCount > 0){
          res.status(201).json({ message: "Rule updated" });
        }else{
          res.status(404).json({ message: "Rule not found" });
        }
      }else{
        res.status(401).json({message: 'You do not have the permission'});
      }
    }else{
      res.status(401).json({message: 'You do not have the permission'});
    }
  }catch(e){
    res.status(400).json({message: e.message});
  }finally{
    await db.client.close();
  }
});
router.get('/player/information', async function(req,res){
  const db=await connectToDB();
  try{
    const token=req.headers.authorization;
    if(token!=null){
      if(jwt.decode(token).isAdmin){
        let result=await db.collection("Player").find({isAdmin: false}).toArray();
        res.status(201).json({result});
      }else{
        res.status(401).json({message: 'You do not have the permission'});
      }
    }else{
      res.status(401).json({message: 'You do not have the permission'});
    }
  }catch(e){
    res.status(400).json({message: e.message});
  }finally{
    await db.client.close();
  }
});
module.exports = router;
