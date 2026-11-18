const mongoose = require("mongoose");

const typeSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, "slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, "slug must contain only a-z, 0-9 and hyphens"],
    },
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    color: {
      type: String,
      required: [true, "color is required"],
      trim: true,
      match: [/^#[0-9a-fA-F]{6}$/, "color must be a hex like #EE8130"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Type", typeSchema);