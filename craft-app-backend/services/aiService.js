const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-3.6-flash"
});

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const generateCraftResponse = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await model.generateContent(prompt);

      return result.response.text();
    } catch (error) {
      console.error(`Gemini attempt ${attempt} failed:`, error.message);

      if (attempt === maxAttempts) {
        throw error;
      }

      await sleep(1000 * attempt);
    }
  }
};

module.exports = {
  generateCraftResponse
};

