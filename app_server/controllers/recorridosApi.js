const mongoose = require('mongoose');

const recorridos = mongoose.model('recorridos');
const estilos=mongoose.model('estilos');

const getRecorridos = function (req, res) {
  console.log("hola");
  recorridos
    .find()
    .exec((err, Recs) => {
      if (err) { 
        res.status(404).json(err);    
      } else {
        res.status(200).json(Recs);
      }
    })
}

const getEstilos= function(req,res){
 	estilos
	 .find({"user":req.query.user}).select({"style":1,"_id":0})
	  .exec((err, Recs) => {
      if (err) { 
        res.status(404).json(err);    
      } else {
        res.status(200).json(Recs);
      }
    })
}

const setEstilo=function(req,res){
  var usuario=req.body.user;
  var estilo=req.body.newstyle;
  estilos
   .update({"user":usuario},{ "user":usuario,"style":estilo},{upsert:true})
    .exec((err, Recs) => {
      if (err) { 
        res.status(404).json(err);     
      } else {
        res.status(200).json(Recs);
      }
    })
}

const getRecoByURL=function(req,res){
  recorridos
    .find({"nombre_url":req.query.url})
    .exec((err, Recs) => {
      if (err) { 
        res.status(404).json(err);    
      } else {
        res.status(200).json(Recs);
      }
    })

}

module.exports = { getRecorridos, getEstilos, setEstilo };