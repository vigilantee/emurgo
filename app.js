const express = require('express');
const axios = require('axios');
const cache = require('memory-cache');

const app = express();
const cacheDuration = 3600 * 1000; // Cache duration in milliseconds (1 hour)

// API routes
app.get('/articles', async (req, res) => {
  const { keyword="example", author, title, n = 10 } = req.query;
  const articles = await fetchArticles(keyword, author, title, n);
  res.json(articles);
});

app.get('/articles/:articleId', async (req, res) => {
  const articleId = req.params.articleId;
  const article = await fetchArticle(articleId);
  res.json(article);
});

// Fetch articles from GNews API and apply caching
async function fetchArticles(keyword, author, title, n) {
  const cacheKey = `articles:${keyword}:${author}:${title}:${n}`;
  const cachedArticles = cache.get(cacheKey);
  if (cachedArticles) {
    return cachedArticles;
  }

  const url = 'https://gnews.io/api/v4/search';
  const params = {
    q: keyword,
    lang: 'en',
    token: '5f30265226719b34e51e1efd2140573e', // Replace with your GNews API token
    // token: '<your_gnews_api_token>', // Replace with your GNews API token
    max: n,
  };
  if (author) {
    params.topic = `author:"${author}"`;
  }
  if (title) {
    params.topic = `title:"${title}"`;
  }

  try {
    const response = await axios.get(url, { params });
    const articles = response.data.articles || [];
    cache.put(cacheKey, articles, cacheDuration);
    return articles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

// Fetch a specific article from GNews API and apply caching
async function fetchArticle(articleId) {
  const cacheKey = `article:${articleId}`;
  const cachedArticle = cache.get(cacheKey);
  if (cachedArticle) {
    return cachedArticle;
  }

  const url = `https://gnews.io/api/v4/articles/${articleId}`;
  const params = {
    lang: 'en',
    token: '5f30265226719b34e51e1efd2140573e', // Replace with your GNews API token
    // token: '<your_gnews_api_token>', // Replace with your GNews API token
  };

  try {
    console.log('came here.....', url, url)
    const response = await axios.get(url, { params });
    console.log('came here..q231231...', response)
    const article = response.data;
    cache.put(cacheKey, article, cacheDuration);
    return article;
  } catch (error) {
    console.error('Error fetching article:', error);
    return {};
  }
}

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
