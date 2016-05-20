var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cosas");
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var usuarioSchema = new Schema();
var facturaSchema = new Schema();

usuarioSchema.add({
id:ObjectId,
nombre:String,
apellido: String,
email:String,
contrasena:String,

});

facturaSchema.add({
id:ObjectId,
cliente: String,
RFC: String,
direccion: String,
fecha: String,
noFactura: Number,
productos: [{
  cantidad: Number,
  descripcion: String,
  preciounitario: Number,
  preciototal: Number
}],
  subtotal: Number,
  iva: Number,
  total: Number,
  usuario: {type : mongoose.Schema.ObjectId, ref : 'Usuario'}
});


module.exports = {

Usuario: mongoose.model('Usuario', usuarioSchema),
Factura: mongoose.model('Factura', facturaSchema)
};
