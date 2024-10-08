const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt =require('bcrypt')
const UserSchema = new Schema({
    name:{
        type: String,
        require:true,
        lowercase:true
    },
    email: {
        type: String,
        required:true,
        lowercase:true,
        unique: true,
    },
    password: {
        type :String,
        required: true,
    },   
});

UserSchema.pre('save', async function(next){
try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword= await bcrypt.hash(this.password,salt);
    this.password=hashPassword;
    next();
} catch (error) {
    next(error)
}
})
UserSchema.method.updatedPassword=async function(password){
    try {
        const salt = await bcrypt.genSalt(10);
    const hashPassword= await bcrypt.hash(password,salt);
    return await hashPassword;
    } catch (error) {
        throw error
    }
}
UserSchema.methods.isValidPassword=async function(password){
    try {
        console.log("Check password cripted_________",password)
        console.log(await bcrypt.compare(password, this.password))
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw(error)
    }
}


const User =mongoose.model('user', UserSchema);

module.exports= User;