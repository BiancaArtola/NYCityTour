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
	 .find({"user":req.params.user}).select('style')
	  .exec((err, Recs) => {
      if (err) { 
        res.status(404).json(err);    
      } else {
        res.status(200).json(Recs);
      }
    })
}

module.exports = { getRecorridos, getEstilos };