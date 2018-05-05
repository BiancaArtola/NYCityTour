const mongoose=require('mongoose');
const recorridos=mongoose.model('recorridos');

/* GET home page. */
const index = function(req, res) {
  recorridos
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