// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
// Require Mongoose
var mongoose = require('mongoose');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');

// This is how we connect to the mongodb database using mongoose -- "eagles" is the name of
//   our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/eagles');
var EagleSchema = new mongoose.Schema({
    name: {type: String, required: [true, "Name is required!"]},
    }, {timestamps: true});
    mongoose.model('Eagle', EagleSchema); // We are setting this Schema in our Models as 'Eagle'
    var Eagle = mongoose.model('Eagle'); // We are retrieving this Schema from our Models, named 'Eagle'
    // Use native promises
    mongoose.Promise = global.Promise;
// Routes
// Root Request - Show ALL Eagles
app.get('/', function(req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    Eagle.find({}, function(err, eagles) {
        if(err) {
            console.log('something went wrong with index find');
            res.render('index');
          } else { // else console.log that we did well and then redirect to the root route
            console.log('success Eagles at index!');
            res.render('index', {eagles: eagles});
          };
    });
});
//Show one Eagle
app.get('/eagles/:id', function(req, res) {
    // This is where we will retrieve the eagle from the database and include them in the view page we will be rendering.
    console.log("in show", req.params.id);
    Eagle.findOne({_id: req.params.id}, function(err, eagle) {
        console.log(eagle);
        if(err) {
            console.log('something went wrong with show one find');
            res.render('index');
        } else { // else console.log that we did well and then redirect to the root route
            console.log('successfully pulled One Eagle!');
            res.render('eagles/eagles', {eagle: eagle});
        };
    });
});
//Add New Eagle Form
app.get('/new', function(req, res) {
    res.render('eagles/new');
});
// Add Eagle to the DB 
app.post('/eagles', function(req, res) {
    console.log("POST DATA add", req.body);
    // create a new Eagle with the name corresponding to those from req.body
    var eagle = new Eagle(req.body);
    console.log("new eagle", eagle);
    // Try to save that new eagle to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
    eagle.save(function(err) {
      // if there is an error console.log that something went wrong!
      if(err) {
        console.log('something went wrong with new eagle save');
      } else { // else console.log that we did well and then redirect to the root route
        console.log('successfully added an Eagle!');
        res.redirect('/');
      };
    });
});
//Edit an Eagle
app.get('/edit/:id', function(req, res) {
    // This is where we will retrieve the eagle from the database and include them in the view page we will be rendering.
    console.log("EDIT ID", req.params.id);
    Eagle.findOne({_id: req.params.id}, function(err, eagle) {
        console.log("EDIT eagle:", eagle);
        if(err) {
            console.log('something went wrong with the find EDIT');
            res.redirect('/');
        } else { // else console.log that we did well and then redirect to the root route
            console.log('successfully pulled your Eagle - EDIT!');
            res.render('eagles/edit', {eagle: eagle});
        };
    });
});
// Update An Eagle in the DB 
app.post('/:id', function(req, res) {
    console.log("POST DATA Update", req.body);
    console.log(req.params.id);
    var id = req.params.id;
    Eagle.update({_id: id}, {name: req.body.name}, function(err){
        // if there is an error console.log that something went wrong!
        if(err) {
            console.log('something went wrong with UPDATE');
            res.render('index');
        } else { // else console.log that we did well and then redirect to the root route
            console.log('successfully updated an Eagle!');
            const query = ('/eagles/' + req.params.id);
            console.log("This is my query", query);
            res.redirect(query);
        };
    });
});
//Destroy an Eagle --- So SAD!
app.post('/destroy/:id', function(req, res) {
    console.log(req.params.id);
    Eagle.remove({_id: req.params.id }, function(err) {
      if(err) {
        console.log('something went wrong with save');
      } else { // else console.log that we did well and then redirect to the root route
        console.log('successfully destroyed an Eagle!');
        res.redirect('/');
      };
    });
});
 
// Setting our Server to Listen on Port: 8000
app.listen(8004, function() {
    console.log("listening on port 8004");
});
