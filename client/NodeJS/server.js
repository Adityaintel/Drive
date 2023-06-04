
const express= require('express');
const bodyParser=require('body-parser');
const cors=require('cors');

const app=express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

var mysql = require('mysql');
 
// create a connection variable with the required details
var con = mysql.createConnection({
    host: "database-1.cxr5whf38qyd.eu-north-1.rds.amazonaws.com",
    port: "3306",
    user: "admin",
    password: "Shivaji123#",
    database: "Employee",
    timeout: 60000
});
 
// make to connection to the database.
con.connect(function(err) {
  if (err) throw err;
  // if connection is successful
 console.log('connection successful');
});



app.get('/',(req,res)=>{
  res.json('OK');
})

app.post('/',(req,res)=>{
	var {firstName,lastName,age,gender,diagnosis} =req.body;
    console.log(req.body);
      con.query('INSERT INTO Persons (PersonID, LastName, FirstName, Address, City) VALUES (?, ?, ?, ?, ?)', [req.body.age, firstName, lastName, gender, diagnosis], function (err, result) {
        if (err) {
          console.error('Error inserting record:', err);
          res.status(500).json('Error occurred while inserting record');
        } else {
          console.log('Record inserted successfully');
          res.json('Form received');
        }
      });


})

app.listen(3001,()=>{
  console.log("Port 3001");
})