const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt =require('bcrypt')
const AdminSchema = new Schema({
    name:{
        type: String,
        required:true,
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
    admin:{
        type: Boolean,
    }   
});

AdminSchema.pre('save', async function(next){
try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword= await bcrypt.hash(this.password,salt);
    this.password=hashPassword;
    next();
} catch (error) {
    next(error)
}
})
AdminSchema.methods.isValidPassword=async function(password){
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw(error)
    }
}


const Admin =mongoose.model('admin', AdminSchema);

module.exports= Admin;