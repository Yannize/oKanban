const express = require('express')
const assoController = require('./controllers/assoController')
const mainController = require('./controllers/mainController')
const tryCatch = require('./controllers/tryCatch')
const router = express.Router()
// const listController = require('./controllers/listController')
// const cardController = require('./controllers/cardController')

const getClassFromName = require('./middleware/tableName')

// get Model Name for sequelize methods
router.param('name', getClassFromName)

// CREATE
router.post('/api/:name', tryCatch(mainController.createOne))

// READ
router.get('/api/:name', tryCatch(mainController.getAll))
router.get('/api/:name/:id', tryCatch(mainController.getOne))

// UPDATE
router.patch('/api/:name/:id', mainController.updateOne)

// DELETE
router.delete('/api/:name/:id', tryCatch(mainController.deteleOne))



// Associations
router.post('/api/card/:card_id/label/:label_id', tryCatch(assoController.association))
router.delete('/api/card/:card_id/label/:label_id', tryCatch(assoController.dissociation))



module.exports = router

