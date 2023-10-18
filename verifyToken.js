const jwt = require("jsonwebtoken")
const TOKEN_SECRET = "b91028378997c0b3581821456edefd417606a";


const verifyMiddelware=(req,res,next)=>{
  if(req.headers.token !== 'undefined'){
  console.log(req.headers.token);
  var decoded = jwt.verify(req.headers.token,TOKEN_SECRET  );
  req.body.id= decoded.id  
  next()
  }else{
    res.status(400).send({msg:"Please provide token",login:false})
  }
}
module.exports = {verifyMiddelware}
