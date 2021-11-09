# Deal Bot

- [Deal Bot](#deal-bot)
  - [Building](#building)
    - [Production Build](#production-build)
    - [Development Build](#development-build)
  - [Running](#running)
    - [Envionment Variables](#envionment-variables)
    - [Production Mode](#production-mode)
      - [Docker](#docker)
      - [Docker Compose](#docker-compose)
        - [Configuration](#configuration)
        - [Running](#running-1)
    - [Development Mode](#development-mode)
        - [Hosting the Development Environment](#hosting-the-development-environment)
        - [Iterating the Build](#iterating-the-build)
- [Road Map](#road-map)
  - [WIP](#wip)
  - [TODO](#todo)
    - [Nice to haves](#nice-to-haves)
- [CHANGELOG](#changelog)

## Building

// ! FIXME - May not be true anymore?? Test thoroughly

> When switching between build environments (aka prod->dev), it's important to first remove the previous layers to avoid invalid caching!
> This is most important when stepping *down* a build stage, but as habit you should prune these images to be safe!
>
> ```
> docker rmi -f nfg/dealbot:latest
> ```
>
> This should get rid of all layers pertaining to the current image, allowing a cache to be recreated.

### Production Build

```sh
docker-compose -f ./docker-compose.yml -f ./docker-compose.prod.yml build
```

### Development Build

```sh
docker-compose -f ./docker-compose.yml -f ./docker-compose.dev.yml build
```

## Running

### Envionment Variables

| Env Var                                     | Default Value       | Info                                                                                                                                                                                                                                                 |
| ------------------------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LOG_LEVEL                                   | info                | Set the output Log Level choices: trace, debug, info, warn, silent)                                                                                                                                                                                  |
| DESCRIPTOR_EXTENSIONS                       | ".js .json"         | Extensions to parse in PATH_DESCRIPTORS_BASE (include full '.ext' and space separated)                                                                                                                                                               |
| CRONTAB_PATTERN_IMPORT                      | "\*/5 \* \* \* \*"  | Import every 5 minutes                                                                                                                                                                                                                               |
| CRONTAB_PATTERN_NOTIFY                      | "\*/10 \* \* \* \*" | Notify every 10 minutes                                                                                                                                                                                                                              |
| CRONTAB_PATTERN_REPORT_PERIODIC             | "1 0 0 ? \* MON \*" | Report Periodic Stats every Monday at 0:01                                                                                                                                                                                                           |
| CRONTAB_PATTERN_REPORT_COMPARE              | "2 0 0 ? \* MON \*" | Report Comparison Stats every Monday at 0:02                                                                                                                                                                                                         |
| CRONTAB_PATTERN_PRUNE_REPORTS               | "0 0 0 1 1 ? \*"    | Prune all reports Annually on Jan 1st at 0:00                                                                                                                                                                                                        |
| CRONTAB_PATTERN_PRUNE_ERRORED_NOTIFICATIONS | "0 0 0 ? \* MON \*" | Prune *Errored* Notifications that haven't been sent after some Expiration<br/>date every Monday at 0:00. Actual deletion depends<br/>on whether `PRUNE_SOFT_DELETE` holds *any* value, and are only modified if older than `PRUNE_ERRORED_TTL_DAYS` |
| CRONTAB_PATTERN_PRUNE_OLD_DATA              | "0 0 0 1 1/1 ? \*"  | Prune Old Entries and Notifications every 1st of the Month at 0:00.                                                                                                                                                                                  |
| PRUNE_ERRORED_TTL_DAYS                      | 7                   | Any *Errored* Notifications that have lived longer than this setting will be considered for Pruning                                                                                                                                                  |
| PRUNE_SOFT_DELETE                           | *None*              | When Pruning *Errored* Notifications, indicate whether to ACTUALLY delete or not. If set to *any* value                                                                                                                                              |
| PATH_DESCRIPTORS_BASE                       | "./junction"        | Path to directory for Source/Destination Descriptors base directory. Not to be used in a `docker-compose` setting, you can simply volume mount instead.                                                                                              |

> Use [CronMaker](http://www.cronmaker.com/) to help generate Crontab Patterns if you need help!

### Production Mode

> Production Mode is only supported via `docker`, as that's both the development environment and official deployment method.

#### Docker

```sh
docker run --rm --name dealbot \
    -v $(pwd)/junction:/build/junction \
    -v $(pwd)/db:/app/db \
    nfg/dealbot:latest
```

#### Docker Compose

##### Configuration

```yml
version: '3.7'

services:
  dealbot:
    image: nfg/dealbot:latest
    environment:
        # Import every 2min instead of default 5min
        - CRONTAB_PATTERN_IMPORT = "*/2 * * * *"

    volumes:
      - './junction:/app/junction'
      - './db:/app/db'
```

##### Running

```sh
docker-compose up
```

### Development Mode

To run in *Development Mode*, you'll need 2 shells: one to host the environment, and the other to iterate the build.

// ! FIXME , not exactly true and needs more info

Also while Production is de-escalated to a normal user, Development mode runs as `root` so you can test installing dependencies before modifying the `Dockerfile` to avoid excessive rebuilds.

##### Hosting the Development Environment

```sh
docker-compose -f ./docker-compose.yml -f ./docker-compose.dev.yml up
```

> When starting up, you may see `EACCES: permission denied, scandir '/root/.npm/_logs'` and can ignore it.

##### Iterating the Build

Technically you'll recieve instructions from the `compose` command, but for posterity sake, at this point you can now run the dev build cycle.

```sh
docker exec -it dealbot_dealbot_1 ash
```

# Road Map

## WIP

* Docker Image Building
    * In pipeline?
        * https://support.atlassian.com/bitbucket-cloud/docs/run-docker-commands-in-bitbucket-pipelines/#Docker-layer-caching
    * Pushed to dockerhub?

## TODO

* Pruning
    * Destination needs a "minimum entry retainer count" `minEntryRetainerCount`
        * Will always ensure we have at least this many entries, to avoid stale feed re-cycling
        * HAVE A DEFAULT - JUST. IN. CASE!
    * Errored Items need clearing at some frequency
        * If not *actually* clearing, then some kind of `disabled` flag?
            * This keeps the entry in the database as a `idHash` to be checked upon later
            * Should be an Env Var! `PRUNE_SOFT_DELETE`
        * Think through, don't want to re-add items to just re-error later due to a stale feed
* Reporting
    * Simple output
        * Number of errored items
          * And how many of them are disabled
        * Stats?
          * Needs new migration/table
          * How many matches overall
          * How many notifies overall
          * Maybe keep track of an object for weekly comparrisons, and a running report style of last n-weeks?
* Cron Update
    * When 2 cronjobs run at the same time, it's impossible to tell which is which
        * Add the job type to the debugger label (currently just DealBot)
* Database and volume management needs to be figured out
    * sqlite db as well as remote configuration needs to be available
        * ie, ship with sqlite enabled, but allow knex configs
* Doc Add
    * Template encoding for title, but not url
    * Document example descriptors FULLY and ANNOYINGLY!
    * Document here about the descriptor file structure and their intent (source vs dest, multi srcs can go to single dest)
    * Document `APP_FLAGS` somehow...
    * Exit code with no flags is -2 from `meow`, just needs to be noted
    * Document ComplexSearch structure and flexibility!!!!!
        * Regex is dope, but escapes need double escapes in this context if using single quotes
            * JSON should be fine...
* Build a Test Source/Dest for examples/testing out of the box
* Build a "acceptall" predicate string handler to support accepting EVERYTHING in a source!
* Build a `disabled` semaphore in Dest that still marks as processed. This avoids spam but still keeps stats.
    * Useful for seasonal style notifications.
        * ie, as stats start showing an increase in catches, you can then re-enable

### Nice to haves

* Source: Caching recent requests to avoid hyper-hitting servers (aka same feed but differet predicates)
* Source: Native JSON source? (Reddit supports JSON via `.json` instead of `.rss`)
* Destination: Implement Twitter Posting
* Source: Implement Web Scraping? Maybe super low priority?
