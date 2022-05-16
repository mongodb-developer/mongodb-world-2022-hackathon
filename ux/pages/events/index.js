import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Category from "../../components/Category";
import Container from "../../components/Container";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Pagination from "../../components/Pagination";
import Events from "../../components/Events";

export default function Home() {
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const { query } = useRouter();

    const lat = parseFloat(query.lat);
    const lng = parseFloat(query.lng);

    useEffect(() => {
        if(lat && lng) {
            (async () => {
                try {
                    setEvents(await fetch(`/api/news?lat=${lat}&lng=${lng}`).then(response => response.json()));
                } catch (e) {
                    console.error(e);
                }
            })();
        }
    }, [query]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Head>
                <title>GDELT Hackathon UX</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="bg-white w-full min-h-screen flex flex-col">
                <Header />
                <Container>
                    <Category
                        category={`Events Near [${lng}, ${lat}]`}
                        categories={categories}
                        eventCount={`${events.length} Events`}
                    />
                    <Events events={events} />
                    {/* <Pagination /> */}
                </Container>
                <Footer />
            </div>
        </div>
    );
}
