// console.log("Hello, World!");
const express = require("express");
//imported mongoose
const mongoose = require("mongoose");
const app = express();
//middleware
app.use(express.json());
//mongoose connection
mongoose.connect("mongodb://localhost:27017/employeeDB")
.then(()=>{console.log("Connected to MongoDB")})
.catch((error)=>{console.log("Error connecting to MongoDB:", error)});

//schema
const employeeSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  department:{
    type:String,
    required:true
  },
  designation:{
    type:String,
    required:true
  },
  salary:{
    type:Number,
    required:true ,
    min:0
  }
});

//model
const Employee = mongoose.model("Employee", employeeSchema);

//create employee
app.post("/employees", async (req,res)=>{
  try{
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  }catch(error){
    res.status(400).json({error:error.message});
  }
});

//Read
//get all employees
// app.get("/employees", async (req,res)=>{
//   try{
//     const employees = await Employee.find();
//     res.json(employees);

//   }catch(error){
//     res.status(500).json({error:error.message});
//   }
// });

//get employee by id
app.get("/employees/:id", async (req,res)=>{
  try{
    const employee = await Employee.findById(req.params.id);
    if(!employee){
      return res.status(404).json({error:"Employee not found"});
    }
    res.json(employee);
  }catch(error){
    res.status(400).json({error:error.message});
  }
});

//Update
app.put("/employees/:id", async (req,res)=>{
  try{
    const employee = await Employee.findByIdAndUpdate(
      req.params.id, 
      req.body,
       {
        new:true, runValidators:true
       }
    );
    if(!employee){
      return res.status(404).json({error:"Employee not found"});
    }
    res.json(employee);
  }catch(error){
    res.status(400).json({error:error.message});
  }
});

//delete
app.delete("/employees/:id", async (req,res)=>{
  try{
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if(!employee){
      return res.status(404).json({error:"Employee not found"});
    }
    res.json({message:"Employee deleted successfully"});
  }catch(error){
    res.status(400).json({error:error.message});
  }
});

//filter
app.get("/employees", async (req,res)=>{
  try{
    const {department} = req.query;
    const filter = department ? {department} : {};
    const employees = await Employee.find(filter);
    res.json(employees);

  }catch(error){
    res.status(500).json({error:error.message});
  }
});

app.get("/",(req,res)=>{
  res.send("Employee Management System");
});

app.listen(3000,()=>{
  console.log("Server running on http://localhost:3000");
});