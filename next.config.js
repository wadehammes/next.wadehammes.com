const withOptimizedImages = require('next-optimized-images');

module.exports = withOptimizedImages();

module.exports = {
  env: {
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
    CONTENTFUL_API_TOKEN: process.env.CONTENTFUL_API_TOKEN,
  },
};
