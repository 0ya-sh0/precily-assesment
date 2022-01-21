const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'precily';

let dbConnection;

module.exports = {
    connectToDb: async () => {
        await client.connect();
        dbConnection = client.db(dbName);
    },
    getDb: () => dbConnection
}