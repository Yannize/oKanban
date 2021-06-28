const { Card, Label } = require('../models');

const assoController = {
  association: async (req, res, next) => {
    const { card_id, label_id } = req.params;

    const card = await Card.findByPk(card_id);
    const label = await Label.findByPk(label_id);

    if (!card || !label) {
      return next(); // <= 404
    }

    const check = await card.addLabel(label);

    if (!check) {
      res.json({
        message: `Association déjà éxistante entre carte_id(${card_id}) et label_id(${label_id})`,
      });
    } else {
      res.json({
        message: `Association créer : carte_id(${card_id}) <-> label_id(${label_id})`,
      });
    }
  },

  dissociation: async (req, res, next) => {
    const { card_id, label_id } = req.params;

    const card = await Card.findByPk(card_id);
    const label = await Label.findByPk(label_id);

    if (!card || !label) {
      return next(); // <= 404
    }


    const check = await card.removeLabel(label);

    if (check === 0) {
      res.json({
        message: `Cannot delete : Aucune association existante entre carte_id(${card_id}) et label_id(${label_id})`,
      });
    } else {
      res.json({
        message: `Association supprimé : carte_id(${card_id}) <-> label_id(${label_id})`,
      });
    }
  },
};

module.exports = assoController;
