import axios from "axios";

async function getAnalisis(text) {
  const positiveReplies = [
    "The text provided shows a positive sentiment.",
    "It seems that the text provided shows a positive sentiment.",
    "Your text shows a positive sentiment.",
  ];
  const negativeReplies = [
    "The text provided shows a negative sentiment.",
    "It seems that the text provided shows a negative sentiment.",
    "Your text shows a negative sentiment.",
  ];
  const neutralReplies = [
    "The text provided shows a neutral sentiment.",
    "It seems that the text provided shows a neutral sentiment.",
    "Your text shows a neutral sentiment.",
  ];
  try {
    const resp = await axios.post("http://127.0.0.1:5000/predict", {
      review_texts: [text],
    });
    const negative = resp.data.negative;
    const positive = resp.data.positive;
    const neutral = resp.data.neutral;
    let info = "";
    if (negative > positive && negative > neutral) {
      let random = Math.floor(Math.random() * negativeReplies.length);
      info = negativeReplies[random];
    } else if (positive > negative && positive > neutral) {
      let random = Math.floor(Math.random() * positiveReplies.length);
      info = positiveReplies[random];
    } else if (neutral > negative && neutral > positive) {
      let random = Math.floor(Math.random() * neutralReplies.length);
      info = neutralReplies[random];
    }
    const censorship = [
      "fuck",
      "kill",
      "die",
      "suicide",
      "nigger",
      "dick",
      "pussy",
      "penis"
    ]
    for (let i = 0; i < censorship.length; i++){
      if (text.includes(censorship[i])){
        info += "\n\nthe content of your input contains explicit language. Please refrain from using explicit language in this conversation."
      }
    }
    return {
      text: info,
      negative: negative,
      positive: positive,
      neutral: neutral,
    };
  } catch (error) {
    const dataEr = {
      message: error.message,
      error,
      data: "I'm sorry, I can't do that. Please try again later.",
    };
    console.log(error);
    return dataEr.data;
  }
}

async function analyseYoutubeVideo(text) {
  try {
    const url = new URL(text);
    const videoId = url.searchParams.get("v");
    const options = {
      method: "GET",
      url: `http://localhost:3000/api/youtube/youtube-controller?videoId=${videoId}`,
    };
    const response = await axios.request(options);
    const positive = response.data.bertResponse.positive;
    const negative = response.data.bertResponse.negative;
    const neutral = response.data.bertResponse.neutral;
    let info = `The video provided shows a ${positive}% positive sentiment, a ${negative}% negative sentiment and a ${neutral}% neutral sentiment for 150 random comments.`;
    return {
      text: info,
      bertResponse: response.data.bertResponse
    };
  } catch (error) {
    console.log(error);
  }
}

export default {
  getAnalisis,
  analyseYoutubeVideo,
};
