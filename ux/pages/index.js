import Head from "next/head";
import { useState, useEffect } from "react";
import * as Realm from "realm-web";
import Category from "../components/Category";
import Container from "../components/Container";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Mapbox from "../components/Mapbox";
import Pagination from "../components/Pagination";
import Events from "../components/Events";

import clientPromise from "../lib/mongodb";

export default function Home({ events, mapboxAccessToken, heatmapData }) {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);

//   useEffect(async () => {
//     // add your Realm App Id to the .env.local file
//     const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
//     const app = new Realm.App({ id: REALM_APP_ID });
//     const credentials = Realm.Credentials.anonymous();
//     try {
//       const user = await app.logIn(credentials);
//       const allProducts = await user.functions.getAllProducts();
//       setProducts(() => allProducts);
//       const uniqueCategories = await user.functions.getUniqueCategories();
//       setCategories(() => uniqueCategories);
//     } catch (error) {
//       console.error(error);
//     }
//   }, []);

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
          {/* <Category
            category="Recent Events"
            // categories={categories}
            productCount={`${events.length} Products`}
          /> */}
          <Events events={events} />
          {/* <Pagination /> */}
        </Container>
        <Footer />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.NEXT_ATLAS_DATABASE);
        const collection = db.collection(process.env.NEXT_ATLAS_COLLECTION);

        var events = await collection.find({ "Info": { "$exists": true }}).limit(100).toArray();
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
        
        // Hack for removing duplicate news items client side
        events = events.reduce((unique, o) => {
            if(!unique.some(obj => obj.SourceURL === o.SourceURL)) {
                unique.push(o);
            }
            return unique;
        }, []);

        return {
            props: {
                isConnected: true,
                mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN,
                events: JSON.parse(JSON.stringify(events)),
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