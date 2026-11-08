import "./SearchSection.css";

function SearchSection({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortOrder,
    setSortOrder
}) {

    const categories = [
        "All Stories",
        "Beaches",
        "Mountains",
        "Historical Places",
        "Adventure",
        "Nature and Wildlife",
        "Religious Places",
        "Cities"
    ];

    return (
        <section className="search-section">

            {/* Search bar */}
            <div className="search-bar">

                <input
                    type="text"
                    placeholder="Search stories, destinations, or travel experiences..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <button className="search-btn">
                    Search stories
                </button>

            </div>

            {/* Categories and sorting */}
            <div className="filter-row">

                <div className="category-buttons">

                    {categories.map((category) => (

                        <button
                            key={category}
                            className={
                                selectedCategory === category
                                    ? "category-btn active"
                                    : "category-btn"
                            }
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>

                    ))}

                </div>

                <select
                    className="sort-select"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>

            </div>

        </section>
    );
}

export default SearchSection;