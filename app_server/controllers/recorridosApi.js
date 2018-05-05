const mongoose = require('mongoose');

const Recorridos = mongoose.model('Recorridos');

const getRecorridos = function (req, res) {
  Recorridos
    .find()
    .exec((err, Recs) => {
      if (err) { 
        res.status(404).json(err);    
      } else {
        res.status(200).json(Recs);
      }
    })
}

module.exports = { getRecorridos };