require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser =  require("body-parser");
const mongoose = require("mongoose");
const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://127.0.0.1:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
})
.then(console.log('connecting'))
.catch(err => console.log(`error: ${err}`));

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});




const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User ({
            email:req.body.username,
            password:hash
        });
        newUser.save();
        res.render("secrets");
    })
    });

    

app.get("/logout", function(req, res){
    res.render("home");
});

app.post("/login", function(req, res){
const username = req.body.username;
const password = req.body.password;

User.findOne({email:username })
.then(function(foundUser){
    if(foundUser)
    {
        bcrypt.compare(password,foundUser.password, function(err, result) {
            if(result === password){
                res.render("secrets");
            } 
        });
        
    }
});
});

app.listen(3000, function(req, res){
    console.log("connected to server port 3000");
});