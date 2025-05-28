const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        // nameonproduct: {
        //   type: String,
        //   required: false,
        // },
        // color: {
        //   type: String,
        //   required: false,
        // },
        note: {
          type: String,
          required: false,
        }
      },
    ],
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", CartSchema);
