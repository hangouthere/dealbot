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
    url: 'https://discord.com/api/webhooks/CHANGE_THIS',
    requestLimits: {
      tokensPerInterval: 5,
      interval: 1000
    }
  }
};

module.exports = config;
