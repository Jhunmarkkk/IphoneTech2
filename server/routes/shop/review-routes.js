const express = require("express");

const {
  addProductReview,
  getProductReviews,
  updateReview,
} = require("../../controllers/shop/product-review-controller");

const router = express.Router();

router.post("/add", addProductReview);
router.get("/:productId", getProductReviews);
router.put("/reviews/:id", updateReview);

module.exports = router;
