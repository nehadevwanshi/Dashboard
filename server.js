var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');

// reqire monoose
var mongoose = require('mongoose');

// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of
//   our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/basic_mongoose');

var MongooseSchema = new mongoose.Schema({
	name: {type:String},
	age: {type: Number}
});
mongoose.model('Mongoose', MongooseSchema); // We are setting this Schema in our Models as 'User'
var Mongoose = mongoose.model('Mongoose') // We are retrieving this Schema from our Models, named 'User'
// Routes
// Root Request
// The root route -- we want to get all of the users from the database and then render the index view passing it all of the users



app.get('/', function(req, res) {
  var mongoose = new Mongoose({name: req.body.name, age: req.body.age});
  Mongoose.find({}, function(err, mongooses) {
      if(err) {
        console.log('something went wrong');
      } else { 
        console.log('successfully added a mongoose!');
      res.render('index', {mongooses: mongooses});
    }
  })    
})
//////

app.get("/mongooses/:id", function(req, res){   
  console.log(req.params.id);
  if (req.params.id == "new"){
    res.render("new_mong");
  }
  Mongoose.find({"_id": req.params.id}, function(err, mongooses){

    if(err){
      console.log("something went wrong!  "+ err);
    }else{
      console.log("successfully added a mongoose!");
      res.render("show", {mongooses: mongooses});
    }
  })
})
   
////ADD A NEW MONGOOSE, shows the form to add a mongoose///

app.get("/mongooses/new", function(req, res){
  res.render("new_mong");
})
  

/////Actuallly added a mongoose/////

app.post('/mongooses', function(req, res) {
  console.log("POST DATA", req.body);
  var mongoose = new Mongoose({name: req.body.name, age: req.body.age});
 
  mongoose.save(function(err) {
    if(err) {
      console.log('something went wrong  '+ err);
    } else { 
      console.log('successfully added a mongoose!');
      res.redirect('/');
    }
  })
})   
 
/////EDIT MONGOOSES /////
app.get("/mongooses/:id/edit", function(req, res){
  Mongoose.find({"_id": req.params.id}, function(err, mongooses){

    if(err){
      console.log("something went wrong!  "+ err);
    }else{
      console.log("successfully added a mongoose!");
      res.render("edit_mong", {mongooses: mongooses[0]});
    }
  })
})
////// actual edition//////
app.post("/mongooses/:id", function(req, res){
  Mongoose.update({"_id": req.params.id, "name": req.body.name, "age": req.body.age}, function(err){
    
    if(err){
      console.log("something went wrong!  "+ err);
    }else{
      console.log("successfully added a mongoose!");
      res.redirect("/");
    }
  })
})
    
 /////destroy ////

app.post("/mongooses/:id/destroy", function(req, res){      
  Mongoose.remove({"_id": req.params.id}, function(err){
    
    if(err){
      console.log("something went wrong!  "+ err);
    }else{                                                 
      console.log("successfully added a mongoose!");
      res.redirect("/");
    }
  })
})

// Setting our Server to Listen on Port: 8000
app.listen(8000, function(){
   console.log("listening on port 8000");
})