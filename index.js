const express=require("express");
const app=express();
const cors=require("cors");
const mongoose=require("mongoose");
const config= require("./DB");
const userRoute=require('./routes/user');


mongoose.connect(config.DB).then(()=>{
    console.log("connection Established")
})
.catch(err=>{
    console.log(err)
})
app.use(cors())
app.use(express.json()) 
app.use("/user",userRoute)
const port=4500;

app.listen(port,()=>{
    console.log(`listening on Port ${port}`)
})



