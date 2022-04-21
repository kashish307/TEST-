import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema(
    {
        name:{
           type : String,
           required: true
        },
        email:{
            type : String,
            required: true,
            unique: true
            },
        password:{
           type :  String,
           required: true
            },
        isAdmin:{
             type : Boolean,
             required: true,
             default: false
              }
    }, {
        timestamps: true
    })

    userSchema.methods.matchPassword = async function(enteredPassword){
      return await bcrypt.compare(enteredPassword , this.password)
    }
   
    //for encryption of password entered during registeration

    userSchema.pre('save', async function (next){
        
        if(!this.isModified('password')){
            next()
        }

        const salt = await bcrypt.genSalt(10)
        //salt adds an additional value to the end of the password that changes the hash value produced.
        this.password= await bcrypt.hash(this.password , salt) //hashing password and adding salt
    })


    const User = mongoose.model('User', userSchema)

    export default User