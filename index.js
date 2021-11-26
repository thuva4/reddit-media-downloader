const { default: axios } = require('axios');
const fs = require('fs');

const { REDDIT_API_BASE_URL, REDDIT_URL_POST_ID_INDEX } = require('./src/constants');
const { logger } = require('./src/logger');
const { getImageByUrl } = require("./src/image");
const { getByVideoUrl, getRedditVideoUrls } = require("./src/video");

const getRedditByMediaUrl = (mediaUrl, mediaType, pathName = '.', resolution='1080') => {
  if (!fs.existsSync(pathName)) {
      logger.error(`Path ${pathName} is not exist`);
      return;
  }
  switch(mediaType) {
    case "image":
      return getImageByUrl(mediaUrl, pathName);
    case "video":
      return getByVideoUrl(mediaUrl, pathName, resolution);
    default:
      return "Not Supported Media Type";
  }
};

const getRedditMedia = async (postUrl, filePath) => {
  const postId = postUrl.split('/')[REDDIT_URL_POST_ID_INDEX];
  const {data: {data}} = await axios.get(`${REDDIT_API_BASE_URL}/info/?id=t3_${postId}`)
  if (data && data.children && data.children.length> 0 && data.children[0].data) {
    const { post_hint: postHint, url: mediaUrl, is_video: isVideo, is_image: isImage } = data.children[0].data;
    const mediaType = postHint ? postHint : isVideo ? "video" : isImage ? "image" : "";
    return getRedditByMediaUrl(mediaUrl, mediaType, filePath);
  }
  return "Could find the post information";
}

module.exports = {
  getRedditMedia,
  getRedditByMediaUrl,
  getRedditVideoUrls, 
};