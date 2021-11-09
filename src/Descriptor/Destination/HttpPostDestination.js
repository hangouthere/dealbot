const fetch = require('node-fetch');

const { RateLimiter } = require('limiter');

const Logger = require('-/Logger');
const DescriptorDestination = require('./DescriptorDestination');
const chalk = require('chalk');

module.exports = class HttpPostDestination extends DescriptorDestination {
  get url() {
    return this.config?.extraOptions.url;
  }

  constructor(config) {
    super(config);

    if (!config.extraOptions.requestLimits) {
      throw new Error('HTTP Post Descriptor must have `extraOptions.requestLimits` defined!');
    }

    this._limiter = new RateLimiter(config.extraOptions.requestLimits);
  }

  async notifyDestination({ deserializedData, sourceLoader, templatedEntry }) {
    await this._limiter.removeTokens(1);

    // Then try to Attempt Notify...
    const resp = await this._httpPost(templatedEntry);

    if (!resp.ok) {
      const err = await resp.json();
      Logger.error(
        `Entry Failed to Notify: ${chalk.red(`[${err.message}]`)} ${sourceLoader.getEntryName(deserializedData)}`
      );
    }

    return resp;
  }

  _updateTokenBucket(rateLimit, rateWindow) {
    // Reset the request limits based on response headers
    this.config.extraOptions.requestLimits.tokensPerInterval = rateLimit;
    this.config.extraOptions.requestLimits.interval += rateWindow;

    this._limiter = new RateLimiter(this.config.extraOptions.requestLimits);
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
      `Setting Rate Limit to ${this.config.extraOptions.requestLimits.tokensPerInterval} and Rate Window to ${this.config.extraOptions.requestLimits.interval}`
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
