const Model = require('../models');
const tryCatch = require('./tryCatch');

const mainController = {
  getAll: async (req, res) => {
    const data = await Model[req.tableName].findAll({
      include: [{ all: true, nested: true }],
    });
    res.json(data);
  },

  getOne: async (req, res) => {
    const id = req.params.id;
    const data = await Model[req.tableName].findByPk(id);
    res.json(data);
  },

  createOne: async (req, res) => {
    const data = await Model[req.tableName].create(req.body);
    res.json(data);
  },

  updateOne: async (req, res) => {
    const id = req.params.id;
    const newData = req.body;

    const dataToUpdate = await Model[req.tableName].findByPk(id);

    if (!dataToUpdate) {
      return next(); // <= pas de liste, 404
    }

    const dataUpdated = await dataToUpdate.update(newData);

    res.json(dataUpdated);
  },

  deteleOne: async (req, res) => {
    const dataToDelete = await Model[req.tableName].destroy({
      where: { id: req.params.id },
    });
    res.json(dataToDelete);
  },
};

module.exports = mainController;



