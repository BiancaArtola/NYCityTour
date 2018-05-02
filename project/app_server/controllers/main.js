const mongoose=require('mongoose');
const Recorridos=mongoose.model('Recorridos');

/* GET home page. */
const index = function(req, res) {
  Recorridos
    .find()
    .exec((err, recorridos) => {
      if (err) { 
        res.render('error', { error : err });    
      } else {
        res.render('index', {
          title: 'Ciudades Turisticas', 
          recorridos: recorridos 
        });
      }
    })
};
module.exports = { index }; 