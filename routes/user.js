const express = require("express");
const userRouter = express.Router();
const userModel = require("../model/user");
const bcrypt = require("bcrypt");
const TOKEN_SECRET = "b91028378997c0b3581821456edefd417606a";
const jwt = require("jsonwebtoken");
const {verifyMiddelware}= require("../verifyToken")
const {body,validationResult} = require("express-validator")

userRouter.post("/signup",
   body("email").isEmail().withMessage("enter a valid email"),
   body("email").custom((value)=>{
      return userModel.findOne({email:value}).then((user)=>{
          if(user){
            return Promise.reject("E-mail already in use")
          }
      })
   }),
  body("password").isLength({min:3}).withMessage("password must be atleast 6 characters"),
  (req, res) => {
    const errors =validationResult(req)
    console.log("errors",errors)
    if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()});
    }
  const newHash = bcrypt.hash(req.body.password,10, function (err, hash) {
    if (err) {
      // console.log(err);
    } else if (hash) {
      let user = new userModel({
        email: req.body.email,
        password: hash,
      });
      console.log(user);
      user
        .save()
        .then((data) => {
          res.status(200).send({ data });
        }) 
        .catch((err) => {
          res.status(400).send({ err });
        });
    }
  });
});

userRouter.post("/login", async (req, res) => {
  console.log("userlogin",req.body);
  const user = await userModel.findOne({ email: req.body.email });
  console.log("gfg",user);
  try {
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (isMatch) {
      const accessToken = jwt.sign({id:user._id}, TOKEN_SECRET);
      res.send({accessToken:accessToken});
    } else {
      res.status(400).send({ message: "Invalid Credentials(E-mail or password mismatch)" });
    }
  } catch (err) {
    console.log(err);
  }
});


userRouter.post("/verify", verifyMiddelware,(req, res) => { 
  res.json(req.body)
});



userRouter.get("/user",verifyMiddelware, (req, res) => {
  userModel.find(function (err, data) {  
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
});

userRouter.delete("/:id",verifyMiddelware,function(req,res){
    userModel.findByIdAndRemove(req.params.id,function(err,data){
        if(err){
            console.log(err)
        }else{
            res.send({data,msg:"Data Deleted"})
        }
    });
});

userRouter.get("/:id",verifyMiddelware,function(req,res){
    userModel.findById(req.params.id,function(err,data){
        if(err){
            console.log(err)
        }else{
            res.send(data)
        }
    })
})

module.exports = userRouter;
