const MongoClient = require('mongodb').MongoClient;

const db_uri = process.env.DB_URI;

let cachedDB = null;

// TODO: This can probably be refactored
const connectToDB = async () => {
    if (cachedDB) return cachedDB;
    const client = await MongoClient.connect(db_uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = await client.db(process.env.DB_NAME);
    cachedDB = db;
    return db;
};

async function peopleDb() {
    const db = await connectToDB();
    return await db.collection('people');
}

async function shippingDb() {
    const db = await connectToDB();
    return await db.collection('shipping');
}

async function AskDb() {
    const db = await connectToDB();
    return await db.collection('questions');
}

module.exports = {
    peopleDb,
    shippingDb,
    AskDb
}