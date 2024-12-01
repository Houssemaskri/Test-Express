var express = require('express');
var router = express.Router();
const Livre = require('../models/livre');

/* GET livres listing. */
router.get('/', async function(req, res, next) {
  const livres = await Livre.find();
  res.json(livres);
  //res.render('livres', { title: 'Livres', livres: livres });
});


/* GET livres by GENRE */
router.get('/genre/:genre', async function(req, res, next) {
  try{
  const livres = await Livre.find({genre : req.params.genre});
  res.json(livres);
}catch(err){
  next(err);
}

})

/* GET form to add a new livre */
router.get('/add', function(req, res, next) {
  res.render('addLivre');
  
});

/* POST a single livre. */
router.post('/add',async function(req, res, next) {
  const newLivre = new Livre({
    
    title : req.body.title,
    author : req.body.author,
    genre : req.body.genre,
    price : req.body.price,
    available : req.body.available,
});

const savedLivre = await newLivre.save();
res.json(savedLivre);

});

router.delete('/:id', async function(req, res, next) {
  const livre = await Livre.findByIdAndDelete(req.params.id);
  res.json(livre);
});


router.put('/edit/:id', async function(req, res, next) {
  const updatedLivre = await Livre.findByIdAndUpdate(req.params.id, {
    title : req.body.title,
    author : req.body.author,
    genre : req.body.genre,
    price : req.body.price,
    available : req.body.available,
  });
  res.json(updatedLivre);
});

router.put('/buy/:id', async function(req, res, next) {
  const livre = await Livre.findById(req.params.id);
  const newPrice = livre.price - (livre.price * req.body.discount / 100);
  const updatedLivre = await Livre.findByIdAndUpdate(req.params.id, {
    discount : req.body.discount,
    price : newPrice,
    available : false,
  });
  res.json(updatedLivre);
  
});

// Route to get the count of available books
router.get('/availableCount', async (req, res) => {
  const count = await Livre.countDocuments({ available: true });
  res.json({ count });
});

module.exports = router;