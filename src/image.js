const path = require("path");

const { logger } = require("./logger");
const { POST_TYPE_IMAGE } = require("./constants");
const { downloadFile, isUrlExist, getContentLength } = require("./utils");

const getImageUrls = async (url) => {
  const contentLength = await getContentLength(url);
  return [{
    postType: POST_TYPE_IMAGE,
    url,
    contentLength,
  }];
};

const getImageByUrl = async (mediaUrl, filePath) => {
  const urlExist = await isUrlExist(mediaUrl);
  if (urlExist) {
    const mediaFileName = mediaUrl.split("/").pop();
    const mediaPath = path.join(filePath, mediaFileName);
    try {
      await downloadFile(mediaUrl, mediaPath);
      return { mediaPath };
    } catch (err) {
      logger.error(err);
      return null;
    }
  } else {
    logger.error(`Media Url ${mediaUrl} is not exist`);
    return null;
  }
};

module.exports = {
  getImageByUrl,
  getImageUrls,
};
