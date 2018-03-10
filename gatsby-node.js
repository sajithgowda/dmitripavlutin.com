const Promise = require('bluebird');

const createPaginationPages = require('./create/pagination-pages');
const createPosts = require('./create/posts');

const query = `
{
  allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, limit: 1000) {
    edges {
      node {
        frontmatter {
          title
          slug
        }
      }
    }
  }
}`;


exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;
  return new Promise(function(resolve, reject) {
    const queryResult = graphql(query).then(result => {
      if (result.errors) {
        console.log(result.errors);
        reject(result.errors);
        return;
      }
      // Create blog posts pages.
      const edges = result.data.allMarkdownRemark.edges;
      createPaginationPages(createPage, '/page', edges);
      createPosts(createPage, edges);
    });
    resolve(queryResult);
  });
};