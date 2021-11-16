const config = {
  name: 'Discord - Garage Deals',
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
  data: {
    url: 'https://discord.com/api/webhooks/910086000347320320/tRybMfR5lzxjDHcNHkD0e82vl1qXAcRkgYNJycEMT2n_sb9-hNf-WXBX5laweicy15af',
    requestLimits: {
      tokensPerInterval: 5,
      interval: 1000
    }
  }
};

module.exports = config;
