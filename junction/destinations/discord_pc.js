const config = {
  name: 'Discord - PC Deals',
  type: 'http_post',
  template: `{
                "content": "Deal Item Found!",
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
    url: 'https://discord.com/api/webhooks/907756988740554833/DrufzQ61uMyfXFvgnIkg5uvsnPahfd0UojJVUyxwLFBtFLXf2K2-01lLwnnBAuf6hFCP',
    requestLimits: {
      tokensPerInterval: 5,
      interval: 1000
    }
  }
};

module.exports = config;
