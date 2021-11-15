const Logger = require('-/Logger');
const TrackerDestination = require('./DescriptorDestination');

module.exports = class HttpPostDestination extends TrackerDestination {
  postToDiscord(webhookURL, item) {
    return;

    const discordTemplate = {
      content: 'Deal Item Found!',
      embeds: [
        {
          title: '>> View Deal <<',
          url: item.link,
          color: 3447787,
          footer: { text: 'Review Hardware Before Purchasing!' },
          author: { name: item.title }
        }
      ]
    };

    return fetch(webhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(discordTemplate)
    })
      .then(async resp => {
        return resp.json();
      })
      .then(msg => Logger.info(msg));
  }
};
