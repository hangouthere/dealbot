#!/usr/bin/env node
'use strict';

const ElapsedTime = require('elapsed-time');

const Logger = require('-/Logger');
const { closeDB, knex } = require('./db');

const { isProd } = require('-/Util');
const cli = require('./cli');
const JobManager = require('./Descriptor/JobManager');

class App {
  elapsed = null;

  constructor() {
    this._determineJob(...arguments);
  }

  async _determineJob({ flags, showHelp }) {
    try {
      let jobSuccess = false;

      if (flags.import || flags.i) jobSuccess = await this._jobImport();
      if (flags.notify || flags.n) jobSuccess = await this._jobNotify();
      if (flags.clear || flags.c) jobSuccess = await this._jobClearAllEntries();

      if (!jobSuccess) {
        showHelp();
      }

      await closeDB();
    } catch (err) {
      const chosenErr = isProd ? err.message : err;

      // @ts-ignore
      Logger.critical(chosenErr);
      process.exit(-1);
    }
  }

  _startJob(jobName) {
    this.elapsed = ElapsedTime.new().start();
    Logger.info(`${jobName} Job Starting`);
  }

  _endJob(jobName) {
    const et = this.elapsed.getValue();
    Logger.info(`${jobName} Job Done in ${et}`);
  }

  async _jobImport() {
    this._startJob('Import');

    await new JobManager().scanAndCreateEntries();

    this._endJob('Import');

    return true;
  }

  async _jobNotify() {
    this._startJob('Notify');

    await new JobManager().notifyDestinations();

    this._endJob('Notify');

    return true;
  }

  async _jobClearAllEntries() {
    this._startJob('Clear Entries');

    await knex('entries').delete();

    this._endJob('Clear Entries');

    return true;
  }
}

process.on('unhandledRejection', error => {
  // @ts-ignore
  Logger.critical('unhandledRejection', error);
});

const cliStarter = cli();

new App(cliStarter);
