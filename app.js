//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-aditi:portfolio-1@portfolio.7cfph.mongodb.net/portfolioDB" , { useNewUrlParser : true , useUnifiedTopology: true});

const postScheme = {
  name : String,
  email : String,
  phone : String,
  message : String
};

const imageScheme = {
  photo : String
};

const storage = multer.diskStorage({
  destination : function(req , file , callback){
    callback(null ,"./public/upload/gallery");
  },
  filename : function(req , file , callback){
    const ext = file.mimetype.split("/")[1];
    callback(null ,file.fieldname + "-" + Date.now() +"." + ext);
  }
});

const Post = mongoose.model("Post" , postScheme);

const Image = mongoose.model("Image" , imageScheme);

const upload = multer({
  storage : storage,
  limit : {
    fieldsize : 1024*1024*3
  }
});

app.get("/",function(req,res){
    res.render("home");
});

app.get("/about",function(req,res){
  res.render("about");
});

app.get("/sign",function(req,res){
  res.render("sign");
});

app.post("/sign",function(req,res){

  const post = new Post({
    name : req.body.postName,
    email : req.body.postEmail,
    phone : req.body.postPhone,
    message : req.body.postMessage,
  });

  post.save(function(err){
    if(!err){
      res.status(201).render("sign");
    }
  });
});

app.get("/gallery",function(req,res){
  Image.find({}, function(err, images){
  res.render("gallery", {
    images : images
    });
});
});


app.get("/compose",function(req,res){
  res.render("compose");
});

app.post("/compose",upload.single("image"),function(req,res){

  const image = new Image({
    photo : req.file.filename
  });

  image.save(function(err){
    if(!err){
        res.redirect("gallery");
    }
  });

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started Successfully.");
});
