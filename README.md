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

* Clean up TRACKERS verbage
* Predicates need internalization to support JSON, as well as quick helpers in JS
* Better error handling on HTTP requests
* Cronjob creation
    * Write crontab at container start
    * Use ENV vars to define pattern, or default
    * Consider new pruning topics
    * Consider new reporting topics
* Pruning
    * Destination needs a "minimum entry retainer count" `minEntryRetainerCount`
        * Will always ensure we have at least this many entries, to avoid stale feed re-cycling
        * HAVE A DEFAULT - JUST. IN. CASE!
    * Errored Items need clearing at some frequency
        * If not *actually* clearing, then some kind of `disabled` flag?
            * This keeps the entry in the database as a `idHash` to be checked upon later
        * Think through, don't want to re-add items to just re-error later due to a stale feed
* Reporting
    * Simple output
        * Number of errored items
          * And how many of them are disabled
        * Stats?
          * Needs new migration/table
          * How many matches overall
          * How many notifies overall
* Docker Image Building
    * In pipeline?
        * https://support.atlassian.com/bitbucket-cloud/docs/run-docker-commands-in-bitbucket-pipelines/#Docker-layer-caching
    * Pushed to dockerhub?
* Add `docker-compose` documentation here

### Nice to haves

* Destination: Implement Twitter Posting
* Source: Implement Web Scraping? Maybe super low priority?
* Move common handlers from Trackers to strategy/implementations internally
    * Convert abstracted handlers to JSON tracker format for simplification
