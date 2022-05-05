import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Category from "../components/Category";
import Container from "../components/Container";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Mapbox from "../components/Mapbox";
import Pagination from "../components/Pagination";
import Events from "../components/Events";

import { connectToDatabase } from "../lib/mongodb";

export default function Home({ mapboxAccessToken, categories, heatmapData }) {

    const { query } = useRouter();

    const [events, setEvents] = useState([]);
    const [page, setPage] = useState(parseInt(query.page) || 0);
    const [limit, setLimit] = useState(parseInt(query.limit) || 25);

    useEffect(() => {
        (async () => {
            try {
                setEvents(await fetch(`/api/news?page=${page}&limit=${limit}`).then(response => response.json()));
            } catch (e) {
                console.error(e);
            }
        })();
    }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>GDELT Hackathon UX</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-white w-full min-h-screen">
        <Header />
        <Container>
          <Mapbox mapboxAccessToken={mapboxAccessToken} heatmapData={heatmapData} />
          <Category
            category="Recent Events"
            categories={categories}
            eventCount={`${events.length} Events`}
          />
          <Events events={events} />
          <Pagination page={page} limit={limit} />
        </Container>
        <Footer />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
    try {
        const { database } = await connectToDatabase();
        const collection = database.collection(process.env.NEXT_ATLAS_COLLECTION);

        var categories = await collection.aggregate(
            [
                {
                    "$limit": 1000
                },
                {
                    '$group': {
                        '_id': 1,
                        'Categories': {
                            '$addToSet': '$EventCode'
                        }
                    }
                }
            ]
        ).toArray();

        var heatmap = await collection.aggregate([
            {
                "$limit": 3000
            },
            {
                "$project": {
                    "feature": {
                        "type": "Feature",
                        "geometry": "$Action.Location"
                    }
                }
            },
            {
                "$group": {
                    "_id": 1,
                    "features": {
                        "$push": "$feature"
                    }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "type": "FeatureCollection",
                    "features": 1
                }
            }
        ]).toArray();

        return {
            props: {
                isConnected: true,
                mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN,
                categories: JSON.parse(JSON.stringify(categories[0].Categories)),
                heatmapData: JSON.parse(JSON.stringify(heatmap[0])),
            },
        };
    } catch (e) {
        console.error(e);
        return {
            props: {
                isConnected: false
            }
        }
    }
}