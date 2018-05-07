const mongoose = require('mongoose');

const recorridos = mongoose.model('recorridos');
const estilos=mongoose.model('estilos');

const getRecorridos = function (req, res) {
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
  console.log("Los parametros son"+req.query.user+" "+req.query.newstyle);
  estilos
   .update({"user":req.query.user},{"user":req.query.user,"style":req.query.newstyle},{upsert:true})
    .exec((err, Recs) => {
      if (err) { 
        res.status(404).json(err);     
      } else {
        res.status(200).json(Recs);
      }
    })
}

module.exports = { getRecorridos, getEstilos, setEstilo };