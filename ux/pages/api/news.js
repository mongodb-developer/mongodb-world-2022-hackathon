import { connectToDatabase } from "../../lib/mongodb";

export default async function news(request, response) {
    const { database } = await connectToDatabase();
    const collection = database.collection(process.env.NEXT_ATLAS_COLLECTION);

    const page = request.query.page ? parseInt(request.query.page) : 0;
    const limit = request.query.limit ? parseInt(request.query.limit) : 25;

    const lat = parseFloat(request.query.lat);
    const lng = parseFloat(request.query.lng);

    let filter = {
        "Info": { "$exists": true },
        "Year": 2022
    };

    if(lat && lng) {
        filter = {
            ...filter,
           "Action.Location": { 
               "$near": {
                    "$geometry": {
                        "type": "Point",
                        "coordinates": [lng, lat]
                    },
                    "$maxDistance": 100000
                }
            }
        }
    }

    let results = await collection
        .find(
            filter
        )
        .project({
            "_id": 1,
            "SourceURL": 1,
            "Title": '$Info.meta.title',
            "Description": '$Info.meta.description',
            "Image": "$Info.og.image",
            "Day": 1
        })
        .skip(page * limit)
        .limit(limit)
        .toArray();

    // Hack for removing duplicate news items client side
    results = results.reduce((unique, o) => {
        if(!unique.some(obj => obj.SourceURL === o.SourceURL)) {
            unique.push(o);
        }
        return unique;
    }, []);

    response.status(200).json(results);
}
