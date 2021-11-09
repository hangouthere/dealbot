class Tracker {
  config = null;
  data = null;

  get name() {
    return this.config?.name;
  }

  get items() {
    throw new Error('Not Implemented in Tracker');
  }

  get predicate() {
    throw new Error('Not Implemented in Tracker');
  }

  retrieveData() {
    throw new Error('Not Implemented in Tracker');
  }
}

module.exports = Tracker;
