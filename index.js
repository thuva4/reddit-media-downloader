const fs = require('fs')

const { getImageByUrl } = require("./src/image");
const { logger } = require('./src/logger');
const { getByVideoUrl, getRedditVideoUrls } = require("./src/video");

const getRedditMedia = (mediaUrl, mediaType, pathName) => {
  if (!fs.existsSync(pathName)) {
      logger.error(`${pathName} is not exist`);
      return;
  }
  switch(mediaType) {
    case "image":
      return getImageByUrl(mediaUrl, pathName);
    case "video":
      return getByVideoUrl(mediaUrl, pathName);
    default:
      return "Not Supported Media Type";
  }
};

module.exports = {
  getRedditMedia,
  getRedditVideoUrls, 
};