const { MongoClient, ObjectId } = require('mongoDB');
const fs = require('fs');
const path = require('path');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db('dev');
        const collection = database.collection('botv2');
        const filePath = path.join(__dirname, 'db-commands/botv2.json');
        const jsonData = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(jsonData);

        const formattedData = data.map(item => {
            if (item._id && item._id.hasOwnProperty('$oid')) {
                item._id = new ObjectId(item._id.$oid);
            }
            return item;
        });

        const result = await collection.insertMany(formattedData);
        console.log(`${result.insertedCount} documents were inserted`);
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

run().catch(console.error);
