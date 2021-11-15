# Deal Bot

## Building

### Production

Not available, yet.

### Development

```sh
docker-compose -f ./docker-compose.yml -f ./docker-compose.dev.yml build
```

## Running

### Production

```sh
docker-compose up
```

### Development

```sh
docker-compose -f ./docker-compose.yml -f ./docker-compose.dev.yml up
```

## TODO:

* Split Destinations and Sources
    * Use folders!!!!
        * Pathing env vars for both!
    * Destinations must *always* be imported to get naming mapped out
        * Should exist similar to existing importing of trackers
    * Sources should "textually" point to destination id names
    * Clean up TRACKERS verbage
* Implement Destination API
* Predicates need internalization to support JSON, as well as quick helpers in JS
    * See buildapcsales Predicate impl
* Implement Template
    * HTTP Post should have Discord style built in for JSON example
        * another actually included in example
* Better error handling on HTTP requests
* Rate Limiting Support
    * https://www.useanvil.com/blog/engineering/throttling-and-consuming-apis-with-429-rate-limits/
    * https://www.npmjs.com/package/limiter
* Add env/cli flag supports for the following:
    * ~~Trackers file location~~
    * ~~LogLevel~~
    * RSS and other pagination limits (ie, more than 50 items if desired)
* Destination: Implement Twitter Posting
* Source: Implement Web Scraping? Maybe super low priority?
* Move common handlers from Trackers to strategy/implementations internally
    * Convert abstracted handlers to JSON tracker format for simplification
