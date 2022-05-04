import { connectToDatabase } from "../../lib/mongodb";

export default async function newsByCategory(request, response) {
    const { database } = await connectToDatabase();
    const collection = database.collection(process.env.NEXT_ATLAS_COLLECTION);

    const page = request.query.page ? parseInt(request.query.page) : 0;
    const limit = request.query.limit ? parseInt(request.query.limit) : 25;

    const results = await collection
        .find(
            {
                "Info": { "$exists": true },
                "Year": 2022,
                "EventCode": request.query.code
            }
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

    response.status(200).json(results);
}
