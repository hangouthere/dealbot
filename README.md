# TODO:

* Split up Source/Dest in tracker for proper encapsulation
    * Destinations *might* need to be pooled to avoid GC thrashing
* Do proper detection for source/output types
    * Source: Skip non RSS for now
    * Destination: Skip non discord for now
* Better error handling on HTTP requests
* Rate Limiting Support
* Add env/cli flag supports for the following:
    * Trackers file location
    * RSS and other pagination limits (ie, more than 50 items if desired)
* Destination: Implement Twitter Posting
* Source: Implement Web Scraping? Maybe super low priority?
* Move common handlers from Trackers to strategy/implementations internally
    * Convert abstracted handlers to JSON tracker format for simplification
