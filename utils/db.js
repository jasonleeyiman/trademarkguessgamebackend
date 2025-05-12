const { MongoClient, ObjectId } = require('mongodb');

process.env.MONGODB_URI = 'mongodb+srv://yimanlee529:Lc335196!@cluster0.5foq0am.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

if (!process.env.MONGODB_URI) {
    process.env.MONGODB_URI = 'mongodb://localhost:27017';
}
async function connectToDB() {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('User');
    db.client = client;
    return db;
}
module.exports = { connectToDB, ObjectId };