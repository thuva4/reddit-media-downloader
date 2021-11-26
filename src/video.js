const path = require('path');

const { REDDIT_VIDEO_RESOLUTIONS, REDDIT_BASE_VIDEO_URL } = require("./constants");
const { scrape, getContentLength } = require("./utils");

const getRedditVideoUrls = async (mediaUrl, quality) => {
  const mediaId = mediaUrl.split('/').pop();
  const getIndexOfQuality = (quality) => {
    const index = REDDIT_VIDEO_RESOLUTIONS.indexOf(quality);
    if (index === -1) {
      return 0;
    } 
    return index;
  };
  const index = getIndexOfQuality(quality);
  const sources = await Promise.all(REDDIT_VIDEO_RESOLUTIONS.slice(index).map(async (resolution) => {
    const url =  `${REDDIT_BASE_VIDEO_URL}/${mediaId}/DASH_${resolution}.mp4`;
    const contentLength = await getContentLength(url);
    return {
      resolution,
      url,
      contentLength,
    };
  }));
  return sources.filter(source => source.contentLength);
};


const getByVideoUrl = async (url, filePath, resolution ) => {
  const mediaId = url.split('/').pop();
  const mediaSourceUrl = await getRedditVideoUrls(url, resolution);
  const mediaPath = path.join(filePath, mediaId);
  return await scrape(mediaId, mediaSourceUrl[0], mediaPath, options);
};

module.exports = {
  getRedditVideoUrls,
  getByVideoUrl,
};
