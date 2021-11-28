const { default: axios } = require("axios");
const fs = require("fs");

const {
  REDDIT_API_BASE_URL,
  REDDIT_URL_POST_ID_INDEX,
  IMGUR_URL,
  REDDIT_IMAGE_BASE_URL,
  POST_TYPE_VIDEO,
  POST_TYPE_IMAGE,
} = require("./src/constants");
const { logger } = require("./src/logger");
const { getImageByUrl, getImageUrls } = require("./src/image");
const { getByVideoUrl, getRedditVideoUrls } = require("./src/video");

const getRedditByMediaUrl = (
  mediaUrl,
  mediaType,
  pathName = ".",
  resolution = "1080",
  options = ["-c:v", "copy"]
) => {
  if (!fs.existsSync(pathName)) {
    logger.error(`Path ${pathName} is not exist`);
    return;
  }
  switch (mediaType) {
    case POST_TYPE_IMAGE:
      return getImageByUrl(mediaUrl, pathName);
    case POST_TYPE_VIDEO:
      return getByVideoUrl(mediaUrl, pathName, resolution, options);
    default:
      return "Not Supported Media Type";
  }
};

const getRedditMedia = async (postUrl, filePath) => {
  const postId = postUrl.split("/")[REDDIT_URL_POST_ID_INDEX];
  const {
    data: { data },
  } = await axios.get(`${REDDIT_API_BASE_URL}/info/?id=t3_${postId}`);
  if (
    data &&
    data.children &&
    data.children.length > 0 &&
    data.children[0].data
  ) {
    const {
      post_hint: postHint,
      url: mediaUrl,
      is_video: isVideo,
      url,
      title
    } = data.children[0].data;
    const isImage =
      url.includes(IMGUR_URL) || url.includes(REDDIT_IMAGE_BASE_URL);
    const mediaType = postHint
      ? postHint
      : isVideo
      ? POST_TYPE_VIDEO
      : isImage
      ? POST_TYPE_IMAGE
      : "";
    switch (mediaType) {
      case POST_TYPE_VIDEO:
        return {title, ...getRedditVideoUrls}(url);
      case POST_TYPE_IMAGE:
        return {title, ...getImageUrls(url)};
      default:
        return null;
    }
  }
  return null;
};

module.exports = {
  getRedditMedia,
  getRedditByMediaUrl,
  getRedditVideoUrls,
};