require('dotenv').config();
const express = require('express');
const app = express();
const router = require('./app/router');
const morgan = require('morgan')
// const cors = require('cors')
const PORT = process.env.PORT || 3000;
const multer = require('multer');
const bodyParser = multer();


app.use(express.static('public'))


// app.use( cors('*') )

app.use( morgan ('dev') )
// on utlise .none() pour dire qu'on attends pas de fichier, uniquement des inputs "classiques" !
app.use( bodyParser.none() );

// app.use(express.urlencoded({ extended: true }));


app.use(router);



app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
