const axios = require("axios");
const get = require("lodash/get");
const normalize = require("./normalize");
//const polyfill = require("babel-polyfill");

function getApi() {
  const rateLimit = 500;
  let lastCalled = null;

  const rateLimiter = (call) => {
    const now = Date.now();
    if (lastCalled) {
      lastCalled += rateLimit;
      const wait = lastCalled - now;
      if (wait > 0) {
        return new Promise((resolve) => setTimeout(() => resolve(call), wait));
      }
    }
    lastCalled = now;
    return call;
  };

  const api = axios.create({
    baseURL: "https://www.googleapis.com/youtube/v3/",
  });

  api.interceptors.request.use(rateLimiter);

  return api;
}

exports.sourceNodes = async (
  { actions, getCache, createNodeId },
  { channelId, apiKey, maxVideos = 50 }
) => {
  const { createNode } = actions;

  const createVideoNodesFromChannelId = async (channelId, apiKey) => {
    var api = getApi();
    let videos = [];
    let videoIDs = [];
    let videoDetails = [];
    let playlists = [];

    const channelResp = await api.get(
      `channels?part=contentDetails&id=${channelId}&key=${apiKey}`
    );

    const channelData = channelResp.data.items && channelResp.data.items[0];
    if (!!channelData) {
      // get the "Uploads" playlist ID - i.e. all uploaded videos on the channel
      const uploadsId = get(
        channelData,
        "contentDetails.relatedPlaylists.uploads"
      );
      let pageSize = Math.min(50, maxVideos);

      // get the first page of videos
      let videoResp = await api.get(
        `playlistItems?part=snippet%2CcontentDetails%2Cstatus&maxResults=${pageSize}&playlistId=${uploadsId}&key=${apiKey}`
      );
      videos.push(...videoResp.data.items);

      // get the next pages of videos
      while (videoResp.data.nextPageToken && videos.length < maxVideos) {
        pageSize = Math.min(50, maxVideos - videos.length);
        let nextPageToken = videoResp.data.nextPageToken;
        videoResp = await api.get(
          `playlistItems?part=snippet%2CcontentDetails%2Cstatus&maxResults=${pageSize}&pageToken=${nextPageToken}&playlistId=${uploadsId}&key=${apiKey}`
        );
        videos.push(...videoResp.data.items);
      }

      console.log(`Downloaded ${videos.length} video(s)`);
    }

    // create a proper array of videos fron API results
    videos = normalize.normalizeRecords(videos);

    // create an array of all video IDs for requesting additional data
    videos.map((item) => {
      videoIDs.push(item.videoId);
    });
    //let videoIdString = videoIDs.join(",");

    // =========================
    // extract video details
    // =========================
    if (!!channelData) {
      let pageSize = Math.min(50, videos.length);
      let videoIdString = videoIDs.slice(0, pageSize).join(",");

      // get the first page of video details
      let videoResp = await api.get(
        `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoIdString}&key=${apiKey}`
      );
      videoDetails.push(...videoResp.data.items);

      // get the next pages of video details
      while (videoDetails.length < videos.length) {
        let pageSize = Math.min(50, videos.length - videoDetails.length);
        let videoIdString = videoIDs
          .slice(videoDetails.length, videoDetails.length + pageSize)
          .join(",");

        let videoResp = await api.get(
          `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoIdString}&key=${apiKey}`
        );
        videoDetails.push(...videoResp.data.items);
      }

      console.log(`Downloaded details of ${videoDetails.length} video(s)`);
    }

    // add video details to video nodes (tags etc)
    videos = normalize.updateVideoDetails(videos, videoDetails);

    // =============================
    // download playlists
    // =============================
    if (!!channelData) {
      let pageSize = Math.min(50, maxVideos);

      // get the first page of playlists
      let playlistResp = await api.get(
        `playlists?channelId=${channelId}&part=id&maxResults=${pageSize}&key=${apiKey}`
      );
      playlists.push(...playlistResp.data.items);

      // get the next pages of playlists
      while (playlistResp.data.nextPageToken) {
        pageSize = Math.min(50, maxVideos - playlists.length);
        let nextPageToken = playlistResp.data.nextPageToken;
        playlistResp = await api.get(
          `playlists?channelId=${channelId}&part=id&maxResults=${pageSize}&pageToken=${nextPageToken}&key=${apiKey}`
        );
        playlists.push(...playlistResp.data.items);
      }

      console.log(`Downloaded ${playlists.length} playlist(s)`);
    }

    // download playlist item ids per playlist
    await Promise.all(
      (playlists || []).map(async (list) => {
        list.videos = [];
        let pageSize = 50;

        // get the first page of playlist items
        let itemsResp = await api.get(
          `playlistItems?playlistId=${list.id}&part=id%2CcontentDetails&maxResults=${pageSize}&key=${apiKey}`
        );
        list.videos.push(...itemsResp.data.items);

        // get the next pages of playlist items
        while (itemsResp.data.nextPageToken) {
          let nextPageToken = itemsResp.data.nextPageToken;
          itemsResp = await api.get(
            `playlistItems?playlistId=${list.id}&part=id%2CcontentDetails&maxResults=${pageSize}&pageToken=${nextPageToken}&key=${apiKey}`
          );
          list.videos.push(...itemsResp.data.items);
        }

        console.log(`Downloaded ${list.videos.length} playlist item(s)`);
      })
    );

    playlists = normalize.normalizePlaylists(playlists);

    // Gatsby requires its own node ids
    videos = normalize.createGatsbyIds(videos, createNodeId);

    // now add thumbnails
    videos = await normalize.downloadThumbnails({
      items: videos,
      getCache,
      createNode,
      createNodeId,
    });

    let tags = normalize.createTagsFromVideos(videos);
    // Gatsby requires its own node ids
    tags = normalize.createGatsbyIds(tags, createNodeId);
    playlists = normalize.createGatsbyIds(playlists, createNodeId);

    //console.log(playlists);

    normalize.createNodesFromEntities(videos, createNode, "YoutubeVideo");
    normalize.createNodesFromEntities(tags, createNode, "YoutubeVideoTag");
    normalize.createNodesFromEntities(playlists, createNode, "YoutubePlaylist");

    return;
  };

  try {
    if (Array.isArray(channelId)) {
      await Promise.all(
        channelId.map(async (channelIdEntry) =>
          createVideoNodesFromChannelId(channelIdEntry, apiKey)
        )
      );
    } else {
      await createVideoNodesFromChannelId(channelId, apiKey);
    }
    return;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

exports.onPreInit = () => {
  // console.log("===== gatsby-source-youtube-v3 loaded");
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type YoutubeVideoTag implements Node {
      videos: [YoutubeVideo] @link(by: "videoId")
    }
    type YoutubeVideo implements Node {
      tags: [YoutubeVideoTag] @link(by: "tag")
    }
    type YoutubePlaylist implements Node {
      videos: [YoutubeVideo] @link(by: "videoId")
    }
  `);
};