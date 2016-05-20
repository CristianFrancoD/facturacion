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
  Factura.findOne({_id:req.params.idFac},function(err,factura){
    var myDoc = new pdf;

    myDoc.pipe(fs.createWriteStream("node.pdf"));
    myDoc.pipe(res);
  /*  myDoc.font('Times-Roman')
         .fontSize(48)
         .text(factura.cliente,100,100);
*/
//Formato general
myDoc.fontSize(30)
  .text('Factura',250, 50);
myDoc.polygon([50, 190], [570, 190]).stroke();
myDoc.polygon([40, 360], [570, 360], [570, 600], [40, 600]).stroke();
myDoc.polygon([40, 400], [570, 400]).stroke();
myDoc.polygon([110, 360], [110, 600]).stroke();
myDoc.polygon([380, 360], [380, 600]).stroke();
myDoc.polygon([470, 360], [470, 600]).stroke();
myDoc.polygon([390, 650], [560, 650],[560, 720],[390, 720]).stroke();
myDoc.polygon([470, 650], [470, 720]).stroke();
myDoc.polygon([390, 675], [560, 675]).stroke();
myDoc.polygon([390, 697], [560, 697]).stroke();
myDoc.polygon([100, 690], [300, 690]).stroke();
//Datos de la empresa
myDoc.fontSize(11)
    .text('Datos de la empresa', 50, 100);
myDoc.fontSize(20)
    .text('Empresa SA de CV', 50, 120);
myDoc.fontSize(15)
    .text('R.F.C RAAE', 50, 143);
myDoc.fontSize(15)
    .text('Direccion: Enrique Segoviano ', 50, 163);
//Datos cliente
myDoc.fontSize(11)
    .text('Datos del cliente', 50, 220);
myDoc.fontSize(15)
  .text('Nombre:', 50, 240);
  myDoc.fontSize(15)
      .text(factura.cliente, 150, 240);
myDoc.fontSize(15)
  .text('R.F.C.:', 50, 260);
  myDoc.fontSize(15)
      .text(factura.RFC, 150, 260);
myDoc.fontSize(15)
  .text('Direccion:', 50, 280);
  myDoc.fontSize(15)
      .text(factura.direccion, 150, 280);
//Datos de la factura
myDoc.fontSize(11)
  .text('Datos de la compra', 50,320);
myDoc.fontSize(12)
    .text('Fecha: '+factura.fecha, 400, 340);
myDoc.fontSize(12)
    .text('No. factura: '+factura.noFactura, 50, 340);
myDoc.fontSize(12)
    .text('Cantidad', 50, 370);
myDoc.fontSize(12)
    .text('Descripcion', 210, 370);
myDoc.fontSize(12)
    .text('Precio \nunitario ', 400, 370);
myDoc.fontSize(12)
    .text('Precio total', 500, 370);
myDoc.fontSize(12)
    .text(' canti', 50, 410);
myDoc.fontSize(12)
    .text('desc', 120, 410);
myDoc.fontSize(12)
    .text('$', 400, 410);
myDoc.fontSize(12)
    .text('$', 500, 410);
//Fin Factura
myDoc.fontSize(12)
    .text('Subtotal', 400, 660);
myDoc.fontSize(12)
    .text('IVA', 400, 680);
myDoc.fontSize(12)
    .text('Total', 400, 700);
myDoc.fontSize(12)
    .text('$', 450, 660);
myDoc.fontSize(12)
    .text('$', 450, 680);
myDoc.fontSize(12)
    .text('$', 450, 700);
myDoc.fontSize(11)
    .text('Firma', 180, 705);
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
  var d = new Date()
  var factura = new Factura({
    cliente: req.body.cliente,
    RFC: req.body.rfc,
    direccion: req.body.direccion,
    fecha: d,
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

app.post("/addProd/:idFac",function(req,res){
  res.render("./addProd",{
    factura:req.params.idFac
  });
});

app.post("/AgregarProd/:idFac",function(req,res){
  var nuevosProductos = {
    cantidad: req.body.ncant ,
    descripcion: req.body.ndesc,
    preciounitario: req.body.npunit,
    preciototal: req.body.nptotal

  }
  Factura.findByIdAndUpdate(req.params.idFac, { $push : {productos:nuevosProductos}},function(err,factura){
       if(err){
        console.log(String(err));
      }else{
         console.log(req.params.idFac);
         console.log(factura);
         console.log("Se añadieron mas productos exitosamente");
         res.redirect("/dashboard");
      }
  })

});

app.listen(8000);
