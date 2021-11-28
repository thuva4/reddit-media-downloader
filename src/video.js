const path = require('path');

const { REDDIT_VIDEO_RESOLUTIONS, REDDIT_BASE_VIDEO_URL, POST_TYPE_VIDEO } = require("./constants");
const { scrape, getContentLength, getAudioAvailable } = require("./utils");

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
    let url =  `${REDDIT_BASE_VIDEO_URL}/${mediaId}/DASH_${resolution}.mp4`;
    let contentLength = await getContentLength(url);
    const { isAudioAvailable } = await getAudioAvailable(mediaId);

    if (!contentLength) {
      url =  `${REDDIT_BASE_VIDEO_URL}/${mediaId}/DASH_${resolution}`;
      contentLength = await getContentLength(url);
    }

    return {
      postType: POST_TYPE_VIDEO,
      resolution,
      url,
      contentLength,
      isAudioAvailable,
    };
  }));
  return sources.filter(source => source.contentLength);
};


const getByVideoUrl = async (url, filePath, resolution, options) => {
  const mediaId = url.split('/').pop();
  const mediaSourceUrl = await getRedditVideoUrls(url, resolution);
  const mediaPath = path.join(filePath, `${mediaId}.mp4`);
  if (mediaSourceUrl.length) {
    return await scrape(mediaId, mediaSourceUrl[0].url, mediaPath, options);
  } 
  return {};
};

module.exports = {
  getRedditVideoUrls,
  getByVideoUrl,
};
