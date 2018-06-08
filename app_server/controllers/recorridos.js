const mongoose=require('mongoose');
const recorridos=mongoose.model('recorridos');

const reco = function(req, res) {
         recorridos
    .find({"nombre_url":req.params.id})
    .exec((err, Recs) => {
      if (err) { 
       res.render('error', { title: req.params.id });    
      } else {
          res.render('recorrido', { title: req.params.id, reco : Recs }); 
      }
    })
        
    };

module.exports = { reco }; 

