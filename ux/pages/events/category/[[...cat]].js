import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Category from "../../../components/Category";
import Container from "../../../components/Container";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import Pagination from "../../../components/Pagination";
import Events from "../../../components/Events";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const { query } = useRouter();

  useEffect(() => {
      (async () => {
          if (query.cat) {
              setCategoryName(query.cat[0]);
              try {
                  const eventsByCategory = await fetch(`/api/news-by-category?code=${query.cat[0]}`).then(response => response.json());
                  setEvents(() => eventsByCategory);
              } catch (e) {
                  console.error(e);
              }
          }
      })();
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
            category={`Category: ${categoryName}`}
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
