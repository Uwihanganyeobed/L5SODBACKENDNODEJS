import myexpress from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bp from 'body-parser'
import mydata from './database.js'

dotenv.config()
const app = myexpress()
app.use(bp.json())
//connect database
mongoose.connect(process.env.MONGODB)
    .then(() => {
        console.log("database connected successful")
    })
    .catch((err) => {
        console.log("database isn't connected yet", err)
    })

const UsersSchema = new mongoose.Schema({
    username: { type: String },
    age: { type: Number },
    gender: { type: String },
    salary: { type: Number },
    isActive: { type: Boolean }
})
const User = mongoose.model("users", UsersSchema)
//Get all users 

app.get('/',function(req,res){
    res.send('server is running')
})

app.get("/users", async function (req, resp) {
    try {
        const results = await User.find()
        resp.json({ message: 'got data', results })
    } catch (error) {
        console.log(error)
    }


})
//Post or Create all users
app.post("/users", async function (req, res) {
    try {
        const { username, age, gender, salary, isActive } = req.body;
        const result = new User({ username, age, gender, salary, isActive })
        await result.save()
        res.json({ message: "user added:", result })
    }

    catch (error) {
        console.log("error creating user", error)
    }

})


//Get single user by id
app.get("/users/:id" ,async function(req,res){
    try{
        const id= req.params.id
        const result= await User.findById(id)
        res.json({message:"got user",result})

    }
    catch(error){
        console.log(error)
    }
})
//Update single user by id
app.put("/users/:id",async function(req,res){
    try{
    const id=req.params.id
    const{username,age,salary,isActive}=req.body
    const result=await User.findByIdAndUpdate(id,{username,age,salary,isActive})
    res.json({message:"user updated",result})
    }
    catch(error){
        console.log(error)
    } 
}
    
)
//Delete single user by id
app.delete("/users/:id" ,async function(req,res){
    try{
        const id= req.params.id
        const result= await User.findByIdAndDelete(id)
        res.json({message:"delete user",result})
    }
    catch(error){
        console.log(error)
    }
})


//create server
app.listen(process.env.PORT, function () {
    console.log('Your server is running on port 4000')
})
