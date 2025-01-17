const cors_proxy = require('../lib/cors-anywhere');

// Define origin whitelist
const originWhitelist = ['https://hackerciano.github.io'];

const server = cors_proxy.createServer({
  originWhitelist: originWhitelist,
  requireHeader: ['origin', 'x-requested-with'],
  removeHeaders: ['cookie', 'cookie2'],
  redirectSameOrigin: true,
  httpProxyOptions: {
    xfwd: false,
  },
});

// Vercel serverless function handler
module.exports = (req, res) => {
  // Ensure the URL to proxy is taken from the path after /api/
  const urlToProxy = req.url.replace(/^\/api\//, ''); // Remove "/api/" from the path
  console.log('URL to proxy:', urlToProxy); // Log the URL to proxy
  if (!urlToProxy) {
    return res.status(400).send('Missing URL to proxy.');
  }

  // Modify the request URL to pass to the CORS Anywhere server
  req.url = `/${urlToProxy}`; // Fix the URL format
  server.emit('request', req, res); // Proxy the request
};