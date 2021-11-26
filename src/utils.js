const fs = require("fs");
const axios = require("axios");
const { logger } = require("./logger");
const ffmpeg = require("fluent-ffmpeg");
const { REDDIT_BASE_VIDEO_URL } = require("./constants");

const isUrlExist = async (url) => {
  try {
    const response = await axios.head(url);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

const downloadFile = async (url, mediaPath) => {
  const writer = fs.createWriteStream(mediaPath);
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

const scrape = async (mediaId, url, filePath, options = ["-c:v", "copy"]) => {
  const audioUrl = `${REDDIT_BASE_VIDEO_URL}/${mediaId}/DASH_audio.mp4`;
  const isAudioAvailable = await isUrlExist(audioUrl);
  const proc = new ffmpeg();
  return new Promise((resolve, reject) => {
    proc
      .addInput(url)
      .output(`${filePath}`)
      .outputOptions(options)
      .on("error", (err) => {
        logger.info(`Error: ${err}`);
        reject({});
      })
      .on("end", () => {
        logger.info("Done");
        resolve({ isAudioAvailable, mediaPath: filePath });
      });
    if (isAudioAvailable) {
      logger.info("Founded audio track...");
      proc.addInput(audioUrl);
    } else {
      logger.info("No audio track...");
    }
    logger.info("Downloading and converting...");
    proc.run();
  });
};

const getContentLength = async (urlPath) => {
  console.log(urlPath);
  const { headers } = await axios.head(urlPath).catch(() => {
    return { headers: {} };
  });
  return headers["content-length"];
};

module.exports = {
  downloadFile,
  scrape,
  getContentLength,
  isUrlExist,
};
