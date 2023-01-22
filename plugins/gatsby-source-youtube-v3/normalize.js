const get = require("lodash/get");
const { createRemoteFileNode } = require("gatsby-source-filesystem");
const crypto = require("crypto");
//const polyfill = require("babel-polyfill");

const digest = (str) => crypto.createHash(`md5`).update(str).digest(`hex`);

exports.createGatsbyIds = (items, createNodeId) => {
  return items.map((e) => {
    e.originalID = e.id;
    e.id = createNodeId(e.id.toString());
    return e;
  });
};

exports.normalizeRecords = (items) => {
  return (items || []).map((item) => {
    //console.log(JSON.stringify(item));

    const e = {
      id: get(item, "id"),
      publishedAt: get(item, "snippet.publishedAt"),
      title: get(item, "snippet.title"),
      description: get(item, "snippet.description"),
      videoId: get(item, "contentDetails.videoId"),
      privacyStatus: get(item, "status.privacyStatus"),
      channelId: get(item, "snippet.channelId"),
      channelTitle: get(item, "snippet.channelTitle"),
      thumbnail: get(
        item,
        "snippet.thumbnails.maxres",
        get(
          item,
          "snippet.thumbnails.standard",
          get(
            item,
            "snippet.thumbnails.high",
            get(
              item,
              "snippet.thumbnails.medium",
              get(item, "snippet.thumbnails.default")
            )
          )
        )
      ),
    };

    return e;
  });
};

exports.updateVideoDetails = (items, details) => {
  return (items || []).map((item) => {
    const e = item;
    let detail = details.find((d) => d.id === e.videoId);
    e.tags = detail.snippet.tags;
    e.duration = detail.contentDetails.duration;
    e.viewCount = detail.statistics.viewCount;
    e.likeCount = detail.statistics.likeCount;
    e.commentCount = detail.statistics.commentCount;
    return e;
  });
};

exports.createTagsFromVideos = (videos) => {
  let allTags = [];

  (videos || []).map((video) => {
    (video.tags || []).map((tag) => {
      let existingTag = allTags.find((t) => t.tag === tag);
      if (existingTag) {
        existingTag.videos.push(video.videoId);
        existingTag.numVideos += 1;
      } else {
        const newTag = {
          id: tag,
          tag: tag,
          videos: [video.videoId],
          numVideos: 1,
        };
        allTags.push(newTag);
      }
    });
  });

  return allTags;
};

exports.downloadThumbnails = async ({
  items,
  getCache,
  createNode,
  createNodeId,
}) =>
  Promise.all(
    items.map(async (item) => {
      let fileNode;
      if (item.thumbnail && item.thumbnail.url) {
        try {
          fileNode = await createRemoteFileNode({
            url: item.thumbnail.url,
            getCache,
            createNode,
            createNodeId,
          });
        } catch (error) {
          // noop
          console.error(error);
        }
      }

      if (fileNode) {
        item.localThumbnail___NODE = fileNode.id;
      }

      return item;
    })
  );

exports.normalizePlaylists = (items) => {
  return (items || []).map((item) => {
    let videos = [];
    const playlistItems = get(item, "videos");
    (playlistItems || []).map((video) => {
      videos.push(get(video, "contentDetails.videoId"));
    });
    //console.log(videos);
    const e = {
      id: get(item, "id"),
      videos: videos,
    };

    return e;
  });
};

exports.createNodesFromEntities = (items, createNode, type) => {
  items.forEach((e) => {
    let { ...entity } = e;
    let node = {
      ...entity,
      parent: null,
      children: [],
      internal: {
        type: type,
        contentDigest: digest(JSON.stringify(entity)),
      },
    };

    createNode(node);
  });
};
