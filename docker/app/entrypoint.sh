#!/bin/sh

<< INFO

Dealbot Entrypoint
--------------------------------------------------------------------------------------------

This Entrypoint will simply write out the necessary crontab in order to establish the
frequency at which the various modes of the Dealbot support.

INFO

LOG_CRONTAB=/var/log/cron
CRONTAB_PATH=/etc/crontabs/node

# Helper function to write crontab entries
addCronEntry() {
    local pattern=$1
    local dealbotFlags=$2

    echo "$pattern cd /app && npm -s start -- $dealbotFlags" >> $CRONTAB_PATH
}

addAllCronEntries() {
    addCronEntry "$CRONTAB_PATTERN_IMPORT"                          "-i"
    addCronEntry "$CRONTAB_PATTERN_NOTIFY"                          "-n"
    addCronEntry "$CRONTAB_PATTERN_PRUNE_ERRORED_NOTIFICATIONS"     "-p errored"
    addCronEntry "$CRONTAB_PATTERN_PRUNE_OLD_DATA"                  "-p keepmin"
    addCronEntry "$CRONTAB_PATTERN_PRUNE_REPORTS"                   "-p reports"
    addCronEntry "$CRONTAB_PATTERN_REPORT_COMPARE"                  "-r compare"
    addCronEntry "$CRONTAB_PATTERN_REPORT_PERIODIC"                 "-r period"
}

if [ ! -f "$CRONTAB_PATH" ]; then
    echo "Setting up Crontabs"
    addAllCronEntries
fi

LINE_SEPARATOR="-----------------------------------------------------------------------------------------"

read -r -d '' HEADER << HEADER

888888ba   88888888b  .88888.  888888ba                    dP  888888ba             dP
88    '8b  88        d8'   '88 88    '8b                   88  88    '8b            88
88     88 a88aaaa    88        88     88 .d8888b. .d8888b. 88 a88aaaa8P' .d8888b. d8888P
88     88  88        88   YP88 88     88 88ooood8 88'  '88 88  88   '8b. 88'  '88   88
88     88  88        Y8.   .88 88    .8P 88.  ... 88.  .88 88  88    .88 88.  .88   88
dP     dP  dP         '88888'  8888888P  '88888P' '88888P8 dP  88888888P '88888P'   dP

                                                                             by nfgCodex

`date`

$LINE_SEPARATOR
HEADER

echo -e "$HEADER"

# Work inside the app!
cd /app

echo -e "\nMigrating Database (if needed)...\n"

# Run DB Migrations
npm -s run migrate

# Ensure `node` user can write to db
chown -R node:node db

echo -e "\n$LINE_SEPARATOR\n\nStarting Crontabs...\n"

crond -f
