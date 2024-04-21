require("dotenv").config()
const express = require("express")
const morgan= require('morgan')
const createError=require('http-errors')
const app=express()
require('./helpers/init_mongodb')
app.use(express.json());
app.use(express.urlencoded({extended:true}))
// const cors=require("cors");
// require("./db/conn")
const AuthRoute=require('./Routes/Auth.route');
const PORT=process.env.PORT || 6005;
app.use(morgan('dev'))
// app.use(cors({
//     origin:"http://localhost:5173/",
//     methods:"GET,POST,PUT,DELETE",
//     credentials:true
// }));

app.get('/',async(req,res,next)=>{
    res.send("Hello from express")
})
app.use('/auth',AuthRoute);
app.use(async (rec,res,next)=>{
    next(createError.NotFound())
});
app.use((err,req,res,next)=>{
    res.status(err.status || 500)
    res.send({
        error:{
            status:err.status ||500,
            message :err.message,
        }
    })
})
// app.use(express.json());

// app.get("/",(req,res)=>{
//     res.status(200).json("server start")
// });

app.listen(PORT,()=>{
    console.log(`Server start at a port no ${PORT}`)
});
