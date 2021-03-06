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

        for(let j = 0; j < 3; j++) {
            const newsWithoutInfo = await collection
                .find(
                    { 
                        "Info": { 
                            "$exists": false 
                        },
                        "SourceURL": {
                            "$exists": true
                        },
                        "Year": 2022
                    }
                )
                .project(
                    { 
                        "_id": 1, 
                        "SourceURL": 1 
                    }
                )
                .limit(100)
                .toArray();

            if(newsWithoutInfo.length == 0) return;

            var documentsToPopulate = [];

            console.log(`Retrieved Batch ${j}`);

            for(let i = 0; i < newsWithoutInfo.length; i++) {
                documentsToPopulate.push(
                    parser(newsWithoutInfo[i].SourceURL)
                        .then(result => {
                            return collection.updateOne(
                                {
                                    "_id": newsWithoutInfo[i]._id
                                },
                                {
                                    "$set": {
                                        "Info": {
                                            "meta": result.meta,
                                            "og": result.og
                                        }
                                    }
                                }
                            );
                        }, error => {
                            if(error.response && error.response.status) {
                                if(![403, 404].includes(error.response.status)) {
                                    console.error(error.message);
                                }
                            } else {
                                console.error(error.message);
                            }
                        })
                );
            }

            await Promise.all(documentsToPopulate);

            console.log(`Batch ${j} Updated`);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await mongoClient.close();
    }
})();