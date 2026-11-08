
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import './App.css';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SearchSection from './components/SearchSection';
import BlogSection from './components/BlogSection';
import Footer from './components/Footer';
import StoryCTA from './components/StoryCTA';
import BlogDetails from './pages/BlogDetails';
import CreateBlog from './pages/CreateBlog';
import MyBlogs from './pages/MyBlogs';
import Explore from "./pages/Explore";
import EditBlog from "./pages/EditBlog";

function Home() {

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

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/blog/:id" element={<BlogDetails />} />
            <Route path="/create-blog" element={<CreateBlog />} />
            <Route path="/my-blogs" element={<MyBlogs />} />
            <Route path="/edit-blog/:id" element={<EditBlog />} />
        </Routes>
    );
}

export default App;
