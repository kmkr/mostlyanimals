const { MongoClient } = require("mongodb");

const getCollection = require("./get");
const insertToCollection = require("./insert");
const destroyFromCollection = require("./destroy");
const updateOneInCollection = require("./update");

const url = process.env.SN_DB_URL;
const getDb = new Promise((resolve, reject) => {
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    if (err) {
      return reject(err);
    }

    return resolve(client.db("splendid-nudibranch"));
  });
});

module.exports = {
  insert(collectionName, data) {
    return getDb.then((db) => insertToCollection(db, collectionName, data));
  },
  list(collectionName, filter) {
    return getDb.then((db) => getCollection(db, collectionName, filter));
  },
  delete(collectionName, filter) {
    console.log("Deleting from %s %o", collectionName, filter);
    return getDb.then((db) =>
      destroyFromCollection(db, collectionName, filter)
    );
  },
  update(collectionName, filter, newValues) {
    return getDb
      .then((db) =>
        updateOneInCollection(db, collectionName, filter, newValues)
      )
      .then(() => this.list(collectionName, filter))
      .then((data) => data[0]);
  },
  updateWithInsertFallback(collectionName, filter, data) {
    return getDb.then((db) => {
      return getCollection(db, collectionName, filter).then((collection) => {
        if (collection.length) {
          return updateOneInCollection(db, collectionName, filter, data);
        }

        return insertToCollection(db, collectionName, data);
      });
    });
  },
};
