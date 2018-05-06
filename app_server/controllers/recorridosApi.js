const mongoose = require('mongoose');

const recorridos = mongoose.model('recorridos');

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

module.exports = { getRecorridos };