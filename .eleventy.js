module.exports = function(eleventyConfig) {
  // 添加markdown-it插件
  const markdownIt = require("markdown-it");
  const markdownItAnchor = require("markdown-it-anchor");
  
  const mdLib = markdownIt({
    html: true,
    breaks: false,
    linkify: true,
    langPrefix: 'language-',
    typographer: true
  }).use(markdownItAnchor, {
    permalink: true,
    permalinkClass: "header-anchor",
    permalinkSymbol: "#",
    level: [1, 2, 3, 4]
  });

  eleventyConfig.setLibrary("md", mdLib);

  // 确保UTF-8编码
  eleventyConfig.addGlobalData("encoding", "utf-8");

  // 静态资源
  eleventyConfig.addPassthroughCopy("static");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("_data");
  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.addPassthroughCopy("src/js");

  // 日期格式化过滤器
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  // 日期格式化过滤器（用于 Nunjucks）
  eleventyConfig.addFilter("date", (dateObj, format) => {
    const date = new Date(dateObj);
    if (format === "%Y年%m月") {
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit'
      }).replace('/', '年').replace('/', '月') + '月';
    }
    return date.toLocaleDateString('zh-CN');
  });

  // 数组限制过滤器
  eleventyConfig.addFilter("limit", (array, count) => {
    if (!array || !Array.isArray(array)) return [];
    return array.slice(0, count);
  });

  // 截断文本过滤器
  eleventyConfig.addFilter("truncate", (text, length = 100) => {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  });

  // Markdown渲染过滤器
  eleventyConfig.addFilter("markdownify", (content) => {
    if (!content) return '';
    return mdLib.render(content);
  });

  // 添加集合
  eleventyConfig.addCollection("recipes", function(collection) {
    return collection.getFilteredByGlob("src/recipes/**/*.md");
  });

  eleventyConfig.addCollection("travels", function(collection) {
    return collection.getFilteredByGlob("src/travels/**/*.md");
  });

  eleventyConfig.addCollection("notes", function(collection) {
    return collection.getFilteredByGlob("src/notes/**/*.md");
  });

  // 返回设置
  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
    charset: "utf-8"
  };
};