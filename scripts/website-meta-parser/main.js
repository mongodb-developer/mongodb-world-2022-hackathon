const { MongoClient } = require("mongodb");
const { parser } = require("html-metadata-parser");

require("dotenv").config();

const mongoClient = new MongoClient(process.env.ATLAS_URI);

(async () => {
    try {

        await mongoClient.connect();
        const database = mongoClient.db(process.env.ATLAS_DATABASE);
        const collection = database.collection(process.env.ATLAS_COLLECTION);

        // Find All Documents Without News Website Information

        const newsWithoutInfo = await collection
            .find(
                { 
                    "Info": { 
                        "$exists": false 
                    },
                    "SourceURL": {
                        "$exists": true
                    }
                }
            )
            .project(
                { 
                    "_id": 1, 
                    "SourceURL": 1 
                }
            )
            .limit(50)
            .toArray();

        for(let i = 0; i < newsWithoutInfo.length; i++) {
            let result = await parser(newsWithoutInfo[i].SourceURL);
            let metaData = { meta: result.meta, og: result.og };
            await collection.updateOne(
                {
                    "_id": newsWithoutInfo[i]._id
                },
                {
                    "$set": {
                        "Info": metaData
                    }
                }
            );
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoClient.close();
    }
})();