const express = require("express");
const { generateCraftResponse } = require("../services/aiService");
const Product = require("../models/Product");

const router = express.Router();

router.post("/ask", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    // Get actual products from the Hastakala database
    const products = await Product.find({
      isActive: true
    })
      .select("title price description category stock")
      .populate("category", "name")
      .limit(100);

    const productList = products.map((product) => ({
      id: product._id,
      name: product.title,
      price: product.price,
      description: product.description,
      category: product.category?.name || "Handmade Crafts",
      stock: product.stock
    }));

    const prompt = `
You are Hastakala AI, a helpful shopping assistant for an Indian handmade crafts marketplace.

Hastakala connects customers with Indian artisans who create handmade products.

IMPORTANT RULES:
- Recommend ONLY products from the product list below.
- NEVER invent a product.
- NEVER invent a price.
- NEVER recommend a product that is not in the product list.
- Use the exact product name and price provided.
- If no products match the user's request, clearly say that no matching product is currently available.
- If the user asks for products under a specific budget, only recommend products within that budget.
- Consider the product description and category when making recommendations.
- Keep responses friendly, simple, concise, and helpful.
- Mention the actual product price when recommending a product.

AVAILABLE HASTAKALA PRODUCTS:
${JSON.stringify(productList, null, 2)}

USER'S MESSAGE:
${message}

Answer the user naturally using ONLY the available Hastakala products.
`;

    const answer = await generateCraftResponse(prompt);

    res.json({
      success: true,
      answer
    });
  } catch (error) {
    console.error("AI assistant error:", error);

    if (error.status === 503) {
      return res.status(503).json({
        error: "Hastakala AI is temporarily busy. Please try again in a few seconds."
      });
    }

    res.status(500).json({
      error: "Failed to get AI response"
    });
  }

});

module.exports = router;

