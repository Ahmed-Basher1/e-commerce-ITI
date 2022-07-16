const mongoose = require("mongoose");
require("../models/user");

const User = mongoose.model("user");

module.exports.updateUser = async (req, res, next) => {
  const updateFields = Object.keys(req.body);
  const allowedUpdates = [
    "email",
    "city",
    "street",
    "building",
    "phone",
    "isVerified",
  ];

  const isValidUpdate = updateFields.every((updateField) =>
    allowedUpdates.includes(updateField)
  );

  if (!isValidUpdate) return next(new Error("Invalid update field(s)."));
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new Error("Couldn't find a user with that id."));

    const address = ["city", "street", "building"];

    updateFields.forEach((updateField) => {
      if (address.includes(updateField)) {
        user.address[updateField] = req.body[updateField];
      } else {
        user[updateField] = req.body[updateField];
      }
    });
    await user.save();
    res.status(200).json({ success: true, message: "Updated Successfully!" });
  } catch (e) {
    next(e);
  }
};

module.exports.removeUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(new Error("Couldn't find a user with that id."));
    res.status(200).json({ success: true, message: "Deleted Successfully!" });
  } catch (e) {
    next(e);
  }
};
