const mongoose=require('mongoose');
const recorridos=mongoose.model('recorridos');

/* GET home page. */
const index = function(req, res) {
  console.log("EL USUARIO ESSSSSSSSSSSSSSSSSSSSSSSS "+req.isAuthenticated());
  recorridos
    .find()
    .exec((err, recorridos) => {
      if (err) { 
        res.render('error', { error : err });    
      } else {
        res.render('index', {
          title: 'Ciudades Turisticas', 
          recorridos: recorridos,
          user: req.isAuthenticated() 
        });
      }
    })
};
module.exports = { index }; 