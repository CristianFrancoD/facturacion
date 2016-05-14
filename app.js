var express = require("express");
var app = express();

app.set("view engine","jade");


app.get("/",function(req, res){



res.render("index");



});

app.get("/iniciar", function(req,res){


res.render("iniciar");

});


app.get("/registrar", function(req,res){

res.render("registrar");

});



app.listen(8080);
