const fetch = require('node-fetch');

const { RateLimiter } = require('limiter');

const Logger = require('-/Logger');
const DescriptorDestination = require('./DescriptorDestination');

module.exports = class HttpPostDestination extends DescriptorDestination {
  get url() {
    return this.config?.data.url;
  }

  constructor(config) {
    super(config);

    if (!config.data.requestLimits) {
      throw new Error('HTTP Post Descriptor must have `data.requestLimits` defined!');
    }

    this._limiter = new RateLimiter(config.data.requestLimits);
  }

  async notifyDestination({ templatedEntry }) {
    await this._limiter.removeTokens(1);

    // Then try to Attempt Notify...
    return await this._httpPost(templatedEntry);
  }

  _updateTokenBucket(rateLimit, rateWindow) {
    // Reset the request limits based on response headers
    this.config.data.requestLimits.tokensPerInterval = rateLimit;
    this.config.data.requestLimits.interval += rateWindow;

    this._limiter = new RateLimiter(this.config.data.requestLimits);
  }

  _sleep = duration => new Promise(r => setTimeout(r, duration));

  async _fetchAndRetry(requestor) {
    const resp = await requestor();

    if (429 !== resp.status) {
      return resp;
    }

    const respResetEpoch = +resp.headers.get('x-ratelimit-reset');
    const nowEpoch = Math.round(Date.now() / 1000);
    const resetTime = respResetEpoch - nowEpoch;

    // const respResetAfter = +resp.headers.get('X-RateLimit-Reset-After');
    const respRateLimit = +resp.headers.get('X-RateLimit-Limit');
    const respDuration = resetTime * 1000;

    this._updateTokenBucket(respRateLimit, respDuration / 2);

    Logger.debug(`Exceeded API Request Rate, will Retry [Retry-After]: ${respDuration}`);
    Logger.debug(
      `Setting Rate Limit to ${this.config.data.requestLimits.tokensPerInterval} and Rate Window to ${this.config.data.requestLimits.interval}`
    );

    // Wait for the time specified in the 429 response
    await this._sleep(respDuration);

    // Retry after we've slept (on the job)
    return this._fetchAndRetry(requestor);
  }

  async _httpPost(templatedEntry) {
    return await this._fetchAndRetry(async () => {
      try {
        return await fetch(this.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: templatedEntry
        });
      } catch (err) {
        Logger.error('Error Caught in Chain', err);
      }
    });
  }
};
