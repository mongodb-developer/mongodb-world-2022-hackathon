import { connectToDatabase } from "../../lib/mongodb";

export default async function search(request, response) {
    const { database } = await connectToDatabase();
    const collection = database.collection(process.env.NEXT_ATLAS_COLLECTION);

    const results = await collection.aggregate(
        [
            {
                '$search': {
                    'index': 'news',
                    'text': {
                        'query': request.query.query,
                        'path': [
                            'Info.meta.title'
                        ]
                    }
                }
            }, {
                '$project': {
                    '_id': 1,
                    'SourceURL': 1,
                    'Title': '$Info.meta.title',
                    'Description': '$Info.meta.description',
                    "Image": "$Info.og.image",
                    "Day": 1
                }
            }
        ]
    ).toArray();

    response.status(200).json(results);
}
