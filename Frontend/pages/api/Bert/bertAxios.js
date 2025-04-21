const axios = require("axios");

async function bertPost(review_texts) {
  try {
    const options = {
      method: "POST",
      url: "http://127.0.0.1:5000/predict",
      headers: { "Content-Type": "application/json" },
      data: { review_texts },
    };
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to propagate it
  }
}

module.exports = { bertPost };
