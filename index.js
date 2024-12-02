const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 8080;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// connect the mongoose db databases 
mongoose.connect("mongodb://localhost:27017/Pro-1",
  { useNewUrlParser: true, useUnifiedTopology: true });

// create Shcema for the collections 

const empSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phone: {
    type: Number,
    required: true,
    min: 10,
  },
  gender: {
    type: String,
    required: true,
    value: ["male", "female"]
  },
  status: {
    type: String,
    value: ["active", "nonactive"],
  },
});


// created mondel 
const Emp = mongoose.model("Emp", empSchema);

// insert Employee Data 
app.post('/employees', async (req, res) => {
  try {
    const addEmp = new Emp(req.body);
    await addEmp.save();
    res.json(addEmp);
  } catch (error) {
    res.json({ error: 'Internal Server issue' });
  }
});



// read the data with the get methods 
// app.get('/emps', async (req, res) => {
//   try {
//     const getData = await Emp.find();
//     if (getData) {
//       res.json(getData);
//     } else {
//       res.json({ error: "data not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Intnternal server issue" });
//   }
// });



// upated the user with the help of the patch methods 
app.patch('/emps/:id', async (req, res) => {
  try {
    const updateData = await Emp.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updateData) {
      res.json(updateData);
    } else {
      res.status(400).json({ error: "data not updatede" });
    }
  } catch (error) {
    res.json({ error: "internal Server Issue" });
  }
})



// delete data with the help of the delete methods 
app.delete('/emps/:id', async (req, res) => {
  try {
    const deleteEmp = await Emp.findByIdAndDelete(req.params.id);
    if (deleteEmp) {
      res.end();
    } else {
      res.status(201).json({ error: "Data not found" });
    }
  } catch (error) {
    res.json({ error: "Interanl server issue" });
  }
})




// find by

// app.get('/emps',async (req,res)=>{
//      try{
//       const query =req.query;
//       const regEx =new RegExp(query,"i");
//       const data =await Emp.find({$or:[{query:name},{query:email}]}); 
//       if(data){
//         res.json(data);
//       }else{
//         res.status(400).json({error:"Data not found"});
//       }
//      }catch(error){
//       res.json({error:"internal server issue"});
//      }
// })


// search query
app.get('/emps', async (req, res) => {
  try {
    const query = req.query.query;
    const regExp = new RegExp(query, 'i');

    const data = await Emp.find({ $or: [{ name: regExp }, { email: regExp }] });
      res.json(data);
    
  } catch (error) {
    res.status(500).json({ error: "Interanl server Issues" });
  }
});




// server started now
app.listen(PORT, (req, res) => console.log(`server will be listening the ${PORT}`));