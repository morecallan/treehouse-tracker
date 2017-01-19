'use strict'

const express = require('express')
const app = express()
const port = process.env.PORT || 6060
app.set('port', port)
const request = require('request');
var fs = require("fs");

// MIDDLEWARE (transform stream | allow CORS)
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/treehouse/details/:classname', (req, res) => {
  let classname = req.params.classname

  var content = fs.readFileSync(`${classname}.json`);
  var studentInfo = JSON.parse(content);

  let studentInfoArray = []



  for (let student in studentInfo) {
    request.get(`${studentInfo[student].Treehouse}.json`, (err, _, body) => {
      if(err) {console.log(err)}
      let objBody = JSON.parse(body);
      const studentReturnObject = {}
      studentReturnObject.id = student;
      studentReturnObject.name = studentInfo[student].Student;
      studentReturnObject.HTMLpoints = objBody.points["HTML"];
      studentReturnObject.CSSpoints = objBody.points["CSS"];
      studentReturnObject.JSpoints = objBody.points.JavaScript;
      studentReturnObject.TOTALpoints = objBody.points.total;
      studentInfoArray.push(studentReturnObject);
      if (studentInfoArray.length >= studentInfo.length) {
        studentInfoArray.sort(compare)
        res.json(studentInfoArray)
      }
    });
  }

});

// COMPARISON SORT BY ID
var compare = (a,b) => {
  if (Number(a.id) < Number(b.id))
    return -1;
  if (Number(a.id) > Number(b.id))
    return 1;
  return 0;
}

app.listen(port, () =>
  console.log(`Listening on port: ${port}`)
)
