require("../models/category");

const mongoose = require("mongoose");

let Categories = mongoose.model("category");

module.exports.getAllCategories = (req, res, next) => {
  Categories.find({})
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => next(error));
};

module.exports.addCategory = (req, res, next) => {
  let newCategory = new Categories({
    name: req.body.name,
    description: req.body.description,
  });

  newCategory
    .save()
    .then((data) => res.status(200).json({ message: "Product added", data }))
    .catch((err) => next(err));
};

module.exports.updateCategory = (req, res, next) => {
  Categories.findOne({ _id: req.body.id }).then((data) => {
    for (let prop in req.body) {
      data[prop] = req.body[prop];
    }
    return data
      .save()
      .then((data) =>
        res.status(200).json({ message: "category updated", data })
      )
      .catch((err) => next(err));
  });
};

module.exports.getOneCategory = (req, res, next) => {
  Categories.findOne({ _id: req.params.id })
    .then((data) => res.status(200).json({ data }))
    .catch((err) => next(err));
};

module.exports.deleteOneCategory = (req, res, next) => {
  Categories.deleteOne({ _id: req.params.id })
    .then((data) => res.status(200).json({ data }))
    .catch((err) => next(err));
};
