const { google } = require("googleapis");
const { bertPost } = require("../Bert/bertAxios");
require("dotenv").config();

const youtube = google.youtube({
  version: "v3",
  auth: process.env.KEY_YOUTUBE_API,
});

export default async function handler(req, res) {
  if (req.method === "GET") {
    const videoId = req.query.videoId;
    if (videoId == null) {
      res.status(400).send({
        status: "bad_request",
        message: "The videoId parameter is required",
      });
      return;
    }

    let pageToken = null;
    let comments = [];

    do {
      const response = await youtube.commentThreads.list({
        part: "snippet",
        videoId: req.query.videoId,
        pageToken: pageToken,
        maxResults: 150,
      });

      comments = comments.concat(response.data.items);
      pageToken = response.data.nextPageToken;
    } while (pageToken && comments.length < 150);

    if (comments.length > 150) {
      comments = comments.slice(0, 150);
    }

    if (comments.length == 0) {
      res
        .status(404)
        .send({ status: "not_found", message: "No comments were found" });
    } else {
      const textOriginals = comments.map(
        (comment) => comment.snippet.topLevelComment.snippet.textOriginal
      );
      const bertResponse = await bertPost(textOriginals);
      res.send({
        status: "success",
        results: textOriginals.length,
        bertResponse,
      });
    }
  }
}
