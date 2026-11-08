
import { useState } from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SearchSection from "../components/SearchSection";
import BlogSection from "../components/BlogSection";
import StoryCTA from "../components/StoryCTA";
import Footer from "../components/Footer";

function Explore() {

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Stories");
    const [sortOrder, setSortOrder] = useState("newest");

    return (
        <>
            <Navbar />

            <Hero />

            <SearchSection
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
            />

            <BlogSection
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                sortOrder={sortOrder}
            />

            <StoryCTA />

            <Footer />
        </>
    );
}

export default Explore;
