const _ = require('lodash');

const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blog) => {
  return blog.reduce((max, blog) => (blog.likes > max.likes ? blog : max), blog[0]);
};

const mostBlogs = (blogs) => {
  const authorBlogCounts = _.countBy(blogs, 'author');

  const authorWithMostBlogs = _.maxBy(Object.keys(authorBlogCounts), (author) => authorBlogCounts[author]);

  return { author: authorWithMostBlogs, blogs: authorBlogCounts[authorWithMostBlogs] };
};

const mostLikes = (blogs) => {
  const likesByAuthor = _(blogs)
    .groupBy('author')
    .map((blogs, author) => ({
      author,
      likes: _.sumBy(blogs, 'likes'),
    }))
    .value();

  return _.maxBy(likesByAuthor, 'likes');
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};