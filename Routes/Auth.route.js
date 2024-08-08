const express =require('express');
const router=express.Router();
const createError=require('http-errors');
const User =require('../Models/User.model');
const {authSchema} =require('../helpers/Validation_schema');
const {adminSchema}=require('../helpers/Validation_admin_schema');
const nodemailer = require("nodemailer");
const bcrypt =require('bcrypt')
const Admin = require('../Models/Admin.model');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    // port: 587,
    // secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "bc190409917@vu.edu.pk",
      pass: "wgqh lvjr vkbd mufx",
    },
  });
async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: 'bc190409917', // sender address
      to: "umerf3024@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }
//   User Auth routes
router.post('/register',async(req,res,next)=>{
    try {
        const result =await authSchema.validateAsync(req.body);
        const doesExit= await User.findOne({email:result.email});
        if(doesExit) throw createError.Conflict(`${ result.email} is already been registered`);
        const user=new User(result);
        const savedUser=await user.save();
        res.send({message:"Register Successfully",
            savedUser});
    } catch (error) {
        if(error.isJoi===true) error.status =422;
        next(error)
    }
}),
// Admin Auth routes
router.post('/admin/register',async(req,res,next)=>{
    try {
        const result =await adminSchema.validateAsync(req.body); 
        const doesExit= await Admin.findOne({email:result.email});
        if(doesExit) throw createError.Conflict(`${ result.email} is already been registered`);
        const admin=new Admin(result);
        const savedAdmin=await admin.save();
        res.send({
            message:"Register successfully",
            savedAdmin
        });
    } catch (error) {
        if(error.isJoi===true) error.status =422;
        next(error)
    }
})
// User Login Api
router.post('/login',async(req,res,next)=>{
    try {
        const result =await authSchema.validateAsync(req.body);
        const user=await User.findOne({email:result.email});
        if(!user) throw createError.NotFound('User not registered');
        const isMatch=await user.isValidPassword(result.password);
        console.log("User match_________",isMatch)
        if(!isMatch) throw createError.Unauthorized('username/password is not valid');
        const message=[{message:"You are login successfully"},{data:user}]
    res.send(message);
    } catch (error) {
        if(error.isJoi===true) return next(createError.BadRequest('Invalid UserName/Password'))
        next(error)
    }
    // res.send("Hello")
   
   
})
// Admin Login Api
router.post('/admin/login',async(req,res,next)=>{
    try {
        const result =await adminSchema.validateAsync(req.body);
        const user=await Admin.findOne({email:result.email});
        if(!user) throw createError.NotFound('Admin not registered');
        const isMatch=await user.isValidPassword(result.password);
        if(!isMatch) throw createError.Unauthorized('Admin Email/password is not valid');
        main().catch(console.error);
        const message=[{message:"You are Login successfully"},{data:user}, {admin:true}]
        res.send(message);
    } catch (error) {
        if(error.isJoi===true) return next(createError.BadRequest('you are not authorized Please register'))
        next(error)
    }
   
})
// User Data get Api
router.get('/user',async(req,res,next)=>{
    const user=await User.find();
    if(user.length===0){
       throw createError(400,{message:"No Record Found"})
    }else{
         res.send(user);
    }
   
})

router.post('/refresh-token',async(req,res,next)=>{
    res.send("refresh token route");
})
// Reset Password
router.put('/reset-password',async(req,res,next)=>{
    try {
        const result =await authSchema.validateAsync(req.body);      
        const doesExit= await User.findOne({email:result.email});
        if(!doesExit) throw createError.Conflict(`${ result.email} not found`);
        const salt = await bcrypt.genSalt(10);
        const hashPassword= await bcrypt.hash(result.password,salt);
        await User.findOneAndUpdate({email:result.email},{$set:{
            password:hashPassword
        }})
        res.status(200).send({success:true, message:'Password has been reset'});
    } catch (error) {
        res.status(400).send(error);
    }
})
router.delete('/user/delete',async(req,res,next)=>{
   console.log(req.body.id);
   try {
    const id = req.body.id
   const deleteUser= await User.deleteOne({ _id: id })
   res.send({message:`Delete successfully ${req.body.id}`,deleteUser})
} catch (error) {
    console.log(error.message)

}
 
        // if(!user) throw createError.NotFound('Admin not registered');
        // const isMatch=await user.isValidPassword(result.password);
        // if(!isMatch) throw createError.Unauthorized('Admin Email/password is not valid');
        // main().catch(console.error);
        // const message=[{message:"You are Login successfully", Admin:true}]
        // res.send(message);
});
module.exports = router;