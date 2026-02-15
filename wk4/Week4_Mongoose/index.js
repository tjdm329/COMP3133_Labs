/*
to get started with the project:

1. Login to your MongoDB 
2. Connect to your Project/Cluster
3. Create new collection named "employees"
4. Click Add data
5. Copy-paste the data from Sample_Employee_Records.json file
6. Copy connection string for your collection
7. Add it in .env file
8. npm i
9. npm start
10. open http://localhost:8081/employees on your Browser

*/

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const employeeRouter = require('./routes/EmployeeRoutes.js');

const app = express();
app.use(express.json()); //parses incoming HTTP request bodies that has JSON content

//Store sensetive information to env variables
dotenv.config();
const PORT = process.env.PORT || 8081
const MONGO_URI = process.env.MONGO_URI || ""

//TODO - Add your MongoDB connection string in env file
mongoose.connect(MONGO_URI); 

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

app.use(employeeRouter);

app.listen(PORT, () => { 
  console.log(`Server is running on http://localhost:8081`) 
  console.log(`Press Ctrl+c to stop`);
});
