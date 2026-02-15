const express = require('express');
const employeeModel = require('../models/Employee');
const app = express();

app.get('/', (req, res) => {
  res.redirect('/employees');
});

//Read ALL
//test URL - http://localhost:8081/employees
app.get('/employees', async (req, res) => {

  //get all docs
  // const employees = await employeeModel.find({});

  //Sorting
  //use "asc", "desc", "ascending", "descending", 1, or -1
  // const employees = await employeeModel.find({}).sort({'firstname': -1});
  
  //Select Specific Column
  const employees = await employeeModel
                            .find({})
                            .select("firstname lastname salary")
                            .sort({'salary' : 'desc'});  
  
  try {
    console.log('employees[0].surname : ', employees[0].surname) //Alias for lastname
    res.status(200).send(employees);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Read By ID
//test URL - http://localhost:8081/employee?id=6983a36e355a3f88bcdeeae5
app.get('/employee', async (req, res) => {

  // const employees = await employeeModel.find({ _id: req.query.id }); //returns array of objects
  // const employees = await employeeModel.findById(req.query.id); // returns single document ; object

  const employees = await employeeModel.find({_id: req.query.id}).select("firstname lastname salary");

  try {
    res.send(employees);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Search By First Name - PATH Parameter
//test URL - http://localhost:8081/employees/firstname/kippy
app.get('/employees/firstname/:name', async (req, res) => {

  const name = req.params.name
  // const employees = await employeeModel.find({firstname : new RegExp(name, 'i')}); // 'i' - case insensitive search

  //Using Static method
  const employees = await employeeModel.getEmployeeByFirstName(name)
  
  //Using Query Helper
  // const employees = await employeeModel.findOne().byFirstName(name)
  
  try {
    if(employees.length != 0){

      // Using Virtual Field Name
      console.log('fullname : ', employees[0].fullname)

      // Using Instance method
      console.log('fullname : ', employees[0].getFullName())

      // Using Instance method
      console.log('formatted salary : ', employees[0].getFormattedSalary())

      res.send(employees);
    }else{
      res.send(JSON.stringify({status:false, message: "No data found"}))
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

//Search By First Name OR Last Name
//test URL - http://localhost:8081/employees/search?firstname=delano&lastname=bee
app.get('/employees/search', async (req, res) => {

  console.log('search query : ', req.query)

  if(Object.keys(req.query).length != 2){
    res.send(JSON.stringify({status:false, message: "Insufficient query parameters. Must provide firstname and lastname both"}))
  }else{
    const fname = req.query.firstname
    const lname = req.query.lastname

    const employees = await employeeModel.find({firstname : new RegExp(fname, 'i'), lastname : new RegExp(lname, 'i')});

    // const employees = await employeeModel.find({ $or: [{firstname : new RegExp(fname, 'i')}, {lastname : new RegExp(lname, 'i')}]});

    //example : { $or: [{ name: "Rambo" }, { breed: "Pugg" }, { age: 2 }] },
    //example : { $and: [{ name: "Rambo" }, { breed: "Pugg" }, { age: 2 }] },

    try {
      if(employees.length != 0){
        res.send(employees);
      }else{
        res.send(JSON.stringify({status:false, message: "No data found"}))
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
});

//Search By salary > 9900
//test URL - http://localhost:8081/employees/salary?value=9900
app.get('/employees/salary', async (req, res) => {

  console.log('search query : ', req.query)
  
  if(Object.keys(req.query).length != 1){
    res.send(JSON.stringify({status:false, message: "Insufficient query parameter"}))
  }else{
    const amount = req.query.value
  
    const employees = await employeeModel.find({salary : {$gte : amount}});
    
    // const employees = await employeeModel.find({}).where("salary").gte(amount);
    
    // <= 10000
    //const employees = await employeeModel.find({salary : {$lte : amount }});
    
    try {
      if(employees.length != 0){
        res.send(employees);
      }else{
        res.send(JSON.stringify({status:false, message: "No data found"}))
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
});

//Some more test queries
//test URL - http://localhost:8081/employees/test
app.get('/employees/test', async (req, res) => {
  try {
    const employees = await employeeModel.
                        find({})
                        // .where('lastname').equals('smith')
                        .where('salary').gte(9700.00).lte(10000.00)
                        // .where('firstname').in(['delano', 'kippy'])
                        .limit(10)
                        .sort('-salary')
                        .select('firstname lastname salary')
                        .exec();
    
    if (!employees.length) {
      return res.status(404).json({ status: false, message: 'No data found' });
    }

    return res.json(employees);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Create New Record
/*
    //Sample Input as JSON
    //application/json as Body
    {
      "firstname":"John",
      "lastname":"Doe",
      "email":"j@d.com",
      "gender":"Male",
      "city":"Toronto",
      "designation":"Senior Software Engineer",
      "salary": 10000.50
    }
*/
//test URL - http://localhost:8081/employee
app.post('/employee', async (req, res) => {
  
  try {
    console.log("trying to save new employee to the collection : ", req.body)
    const employee = new employeeModel(req.body);

    const saved = await employee.save();
    return res.status(201).json(saved);

  } catch (err) {
    //custom validation error
      if (err.name === 'ValidationError') {
        const firstnameMsg = err.errors?.firstname?.message;
        const lastnameMsg = err.errors?.lastname?.message;
        const salaryMsg = err.errors?.salary?.message;
        const genderMsg = err.errors?.gender?.message;

        return res.status(400).json({
          status: false,
          message: 'Validation failed',
          errors: {
            firstname: firstnameMsg,
            lastname: lastnameMsg,
            salary: salaryMsg,
            gender: genderMsg,
          },
        });
      }
          
      return res.status(500).json({ status: false, message: 'Server error' });
    }
});

//Update Record
//test URL example - http://localhost:8081/employee/60174acfcde1ab2e78a3a9b0
app.patch('/employee/:id', async (req, res) => {
  try {
    console.log('updated record doc - ', req.body)

    const employee =  await employeeModel.findOneAndUpdate({ _id: req.params.id}, req.body, {new: true})
    //const employee =  await employeeModel.findByIdAndUpdate(req.params.id, req.body, {new: true})

    console.log('After findOneAndUpdate. Updated doc id:', employee._id);

    res.send(employee)
  } catch (err) {
    res.status(500).send(err)
  }
})

//Delete Record by ID
//test URL example - http://localhost:8081/employee/5d1f6c3e4b0b88fb1d257237
app.delete('/employee/:id', async (req, res) => {
    try {
      const employee = await employeeModel.findByIdAndDelete(req.params.id)

      if (!employee) 
      {
        res.status(404).send(JSON.stringify({status: false, message:"No item found"}))
      }else{
        console.log(`Deleted employee :`, employee);
        
        res.status(200).send(JSON.stringify({
          status: true, 
          deletedId: employee._id,
          message:"Record Deleted Successfully"
        }))
      }
    } catch (err) {
      res.status(500).send(err)
    }
})

module.exports = app
