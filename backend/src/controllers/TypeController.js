const Type = require("../models/Type");

class TypeController {
  async list(req, res, next) {
    try {
      const types = await Type.find()
        .sort({ name: 1 })
        .select("slug name color -_id");
      res.json(types);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TypeController();