var express = require("express");
var app = express();
var Usuario = require("./models/cosas").Usuario;
var Factura = require("./models/cosas").Factura;
var bodyParser = require("body-parser");
var session = require("express-session");
app.set("view engine","jade");
var pdf = require('pdfkit');
var fs = require('fs');

var fact;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
secret: "123kmmlkmwldmk288ad8dhu",
resave: false,
saveUninitialized:false

}));

//Muestra la vista principal que manda a registrarse o iniciar sesion
app.get("/",function(req, res){



  res.render("index");
//  console.log(req.session.user_id);
});

app.get("/pdf/:idFac",function(req,res){
var coso;
  Factura.findOne({_id:req.params.idFac},function(err,factura){
    var myDoc = new pdf;

    myDoc.pipe(fs.createWriteStream("node.pdf"));
    myDoc.pipe(res);
  /*  myDoc.font('Times-Roman')
         .fontSize(48)
         .text(factura.cliente,100,100);
*/
         myDoc.fontSize(15)
            .text(factura.cliente, 100, 80);
         myDoc.fontSize(15)
            .text(factura.RFC, 100, 95);
        myDoc.fontSize(15)
             .text(factura.direccion, 100, 110);

    myDoc.end();
  })


});


//Renderiza la vista para iniciar sesion
app.get("/iniciar", function(req,res){


  res.render("iniciar");

});


//Renderiza la vista para registrarse
app.get("/registrar", function(req,res){

  res.render("registrar");

});


/*
Funcion que toma los datos introducidos en los inputs de la
vista de registrarse y los guarda en la base de datos
*/
app.post("/registrar", function(req, res){

  var usuario = new Usuario({
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    email: req.body.email,
    contrasena: req.body.contra


  });

  usuario.save().then(function(us){
  res.redirect("/")
  console.log("Se guardaron sus datos correctamente");

  },function(err){

    console.log(String(err));
    console.log("Hubo un error al guarda el usuario")
    res.redirect("/signup");
  });




});

app.get("/crearfac",function(req,res){

  res.render("crearfac");

});

app.post("/crearfac", function(req,res){
  var miproductos = {
    cantidad: req.body.cant ,
    descripcion: req.body.desc,
    preciounitario: req.body.punit,
    preciototal: req.body.ptotal

  }
  var sb = req.body.subtotal;
  var ivasiempre = 16;
  var tot = (sb * ivasiempre) + sb;

  var factura = new Factura({
    cliente: req.body.cliente,
    RFC: req.body.rfc,
    direccion: req.body.direccion,
    fecha: req.body.fecha,
    usuario: req.session.user_id,
    noFactura: req.body.nofac,
    productos: miproductos,
    subtotal: req.body.subtotal,
    iva: ivasiempre,
    total : sb

  });
  factura.save().then(function(us){
  res.redirect("/dashboard")
  console.log("Se guardaron sus datos correctamente");

  },function(err){

    console.log(String(err));
    console.log("Hubo un error al guarda el usuario")
    res.redirect("/crearfac");
  });


});
app.get("/dashboard",function(req,res){
  var datos = [];

  var hayfacturas;
  Factura.count({usuario: req.session.user_id},function(err,count){
  if(err)console.log(String(err));

  if(count>0){
    hayfacturas = true;

  }else{
    hayfacturas = false;
  }

})



      Factura
      .find({usuario: req.session.user_id})
      .sort({noFactura: 1})
      .exec(function (err, facturas) {
        if (err) console.log(String(err));


        for(var val in facturas) {
          datos.push(facturas[val])

        }

  res.render("./dashboard",{
    facturas:datos,
    hayfacturas
  });

      });


});

app.post("/delFac/:idFac", function(req,res){
  console.log(req.params.idFac);
  Factura.remove({_id:req.params.idFac}, function(err,removed) {
    res.redirect("/dashboard");

});


});


app.post("/sessions",function(req,res){
  Usuario.findOne({email:req.body.email, contrasena:req.body.contra},function(err,user){
  req.session.user_id = user._id;
  res.redirect("dashboard");

  })

});

app.listen(8000);
