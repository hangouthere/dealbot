const config = {
  name: 'Discord - Audio Equipment Deals',
  type: 'http_post',
  template: `{
                "content": "Listen to this Deal!",
                "embeds": [
                  {
                    "title": ">> View Deal <<",
                    "url": "{{&url}}",
                    "color": "3447787",
                    "footer": { "text": "Review Hardware Before Purchasing!" },
                    "author": { "name": "{{&title}}" }
                  }
                ]
              }`,
  extraOptions: {
    url: 'https://discord.com/api/webhooks/911477537631264828/nT22n4tTYwFecrpjkMQ5h7_-otWXgT68bFihlWYN0YplZWa2belBuUQ3R2Rce8NM46ok',
    requestLimits: {
      tokensPerInterval: 5,
      interval: 1000
    }
  }
};

module.exports = config;
