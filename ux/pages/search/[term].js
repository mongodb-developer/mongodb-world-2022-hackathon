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
  const { query } = useRouter();

  useEffect(() => {
    (async () => {
        if (query.term) {
            try {
                const searchEvents = await fetch(`/api/search?query=${query.term}`).then(response => response.json());
                setEvents(() => searchEvents);
            } catch (e) {
                console.error(e);
            }
        }
    })();
  }, [query]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>GDELT Hackathon UX</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-white w-full min-h-screen">
        <Header />
        <Container>
          <Category
            category={query.term}
            eventCount={`${events.length} Events`}
          />
          <Events events={events} />
          <Pagination />
        </Container>
        <Footer />
      </div>
    </div>
  );
}
