import { useState } from "react";
import { Search, Flame, Award, BookOpen, Star, Sparkles, ChevronRight, Play } from "lucide-react";
import { Book, Category } from "../types";

interface HomeScreenProps {
  books: Book[];
  categories: Category[];
  activeCategory: string | null;
  setActiveCategory: (catName: string | null) => void;
  onSelectBook: (book: Book) => void;
  onStartReading: (book: Book) => void;
  onNavigateScreen: (screen: 'categories' | 'library') => void;
}

export default function HomeScreen({
  books,
  categories,
  activeCategory,
  setActiveCategory,
  onSelectBook,
  onStartReading,
  onNavigateScreen,
}: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredIndex, setFeaturedIndex] = useState(0);

  // Filter books by search query and category pill
  const filteredBooks = books.filter((book) => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory ? book.genre === activeCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  const trendingBooks = filteredBooks.filter(b => b.isTrending);
  const recommendedBooks = filteredBooks.filter(b => b.isRecommended);
  const continueReadingBooks = books.filter(b => b.isInLibrary && b.progress > 0 && b.progress < 100);

  // Interactive banner list
  const banners = [
    {
      id: "b-1",
      title: "Meet Your Personal AI Literature Guide",
      subtitle: "Discover smart thematic summaries and chats with classic characters.",
      badge: "BookVerse AI",
      bgClass: "bg-gradient-to-r from-sky-400/90 via-cyan-500/90 to-teal-500/90",
      icon: Sparkles
    },
    {
      id: "b-2",
      title: "Escape Into Fantasy Classics",
      subtitle: "Explore curated legendary masterpieces from Frank Herbert to Doyle.",
      badge: "Editors Choice",
      bgClass: "bg-gradient-to-r from-purple-500/90 via-indigo-500/90 to-blue-500/90",
      icon: Award
    }
  ];

  const handleNextBanner = () => {
    setFeaturedIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50/60 overflow-y-auto px-4 pt-4 pb-20 scrollbar-hide select-none">
      
      {/* Search Header */}
      <div className="relative w-full shrink-0 mb-4">
        <div className="relative flex items-center bg-white border border-slate-100/80 rounded-2xl shadow-sm px-4 py-2.5 transition-all focus-within:ring-2 focus-within:ring-teal-400/20">
          <Search size={16} className="text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search titles, authors, genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-medium text-slate-700 placeholder-slate-400 outline-none bg-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-[10px] font-bold text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full w-4 h-4 flex items-center justify-center ml-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {searchQuery ? (
        // Search Results state
        <div className="flex-1 flex flex-col animate-fadeIn">
          <h2 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-3 px-1">
            Search Results ({filteredBooks.length})
          </h2>
          {filteredBooks.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white/50 rounded-3xl border border-dashed border-slate-200">
              <BookOpen size={28} className="text-slate-400 mb-2" />
              <p className="text-xs font-medium text-slate-600">No books found matching "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-[10px] text-teal-600 font-semibold mt-2 underline"
              >
                Clear search filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5 pb-6">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => onSelectBook(book)}
                  className="flex flex-col bg-white rounded-2xl p-2.5 border border-slate-100 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="relative aspect-[3/4] w-full bg-slate-100 rounded-xl overflow-hidden shadow-sm mb-2.5 group">
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-md px-1.5 py-0.5 rounded-lg flex items-center gap-0.5 shadow-sm text-[8px] font-extrabold text-amber-500">
                      <Star size={8} className="fill-amber-500 text-amber-500" />
                      <span>{book.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <h3 className="text-[11px] font-bold text-slate-800 line-clamp-1 leading-tight">{book.title}</h3>
                  <p className="text-[9px] font-medium text-slate-400 mt-0.5 truncate">{book.author}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Normal Dashboard state
        <>
          {/* Featured Banner Carousel */}
          <div 
            onClick={handleNextBanner}
            className={`w-full ${banners[featuredIndex].bgClass} rounded-2xl p-4 text-white shadow-md shadow-sky-100 mb-5 relative overflow-hidden transition-all hover:scale-[1.01] cursor-pointer shrink-0 animate-fadeIn`}
          >
            <div className="absolute -right-6 -bottom-6 opacity-10 bg-white rounded-full w-24 h-24 transform rotate-12"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <span className="inline-block bg-white/25 backdrop-blur-md px-2 py-0.5 rounded-full text-[8px] font-mono tracking-wider uppercase mb-2">
                  {banners[featuredIndex].badge}
                </span>
                <h3 className="text-[14px] font-extrabold tracking-tight leading-snug mb-1">
                  {banners[featuredIndex].title}
                </h3>
                <p className="text-[10px] text-white/80 font-medium leading-relaxed">
                  {banners[featuredIndex].subtitle}
                </p>
              </div>
              <div className="flex items-center gap-1 text-[9px] font-bold text-teal-100 mt-3 self-end bg-white/10 px-2 py-1 rounded-lg">
                <span>View Highlights</span>
                <ChevronRight size={10} />
              </div>
            </div>
          </div>

          {/* Categories Pill Grid */}
          <div className="mb-5 shrink-0">
            <div className="flex justify-between items-center mb-2.5 px-0.5">
              <h2 className="text-[13px] font-extrabold text-slate-800">Categories</h2>
              <button
                onClick={() => onNavigateScreen('categories')}
                className="text-[10px] font-bold text-teal-600 flex items-center hover:text-teal-700"
              >
                <span>View All</span>
                <ChevronRight size={10} />
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all shrink-0 ${
                  activeCategory === null
                    ? "bg-teal-600 border-teal-600 text-white shadow-sm shadow-teal-100"
                    : "bg-white border-slate-200/60 text-slate-600"
                }`}
              >
                All Genres
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all shrink-0 ${
                    activeCategory === cat.name
                      ? "bg-teal-600 border-teal-600 text-white shadow-sm shadow-teal-100"
                      : "bg-white border-slate-200/60 text-slate-600"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Continue Reading Section (if any is active) */}
          {continueReadingBooks.length > 0 && (
            <div className="mb-5 shrink-0 animate-fadeIn text-slate-800">
              <div className="flex justify-between items-center mb-2.5 px-0.5">
                <h2 className="text-[13px] font-extrabold text-slate-800">Continue Reading</h2>
                <span className="text-[9px] font-mono whitespace-nowrap bg-grey-100 text-slate-500 px-1.5 py-0.5 rounded-full font-bold">
                  {continueReadingBooks.length} book{continueReadingBooks.length > 1 ? 's' : ''} progress
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {continueReadingBooks.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => onSelectBook(book)}
                    className="flex items-center gap-3 bg-white border border-slate-100/80 rounded-2xl p-2.5 shadow-sm cursor-pointer hover:shadow"
                  >
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      referrerPolicy="no-referrer"
                      className="w-11 h-15 object-cover rounded-lg shadow-sm shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-[11px] font-extrabold text-slate-800 truncate pr-2">{book.title}</h4>
                        <span className="text-[9px] font-extrabold text-teal-600 whitespace-nowrap">{book.progress}%</span>
                      </div>
                      <p className="text-[9px] text-slate-400 mt-0.5 truncate">{book.author}</p>
                      
                      {/* Sub progress line */}
                      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-2">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${book.progress}%` }}></div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartReading(book);
                      }}
                      className="w-8 h-8 rounded-full bg-sky-50 text-teal-600 flex items-center justify-center shrink-0 hover:bg-teal-600 hover:text-white transition-colors"
                    >
                      <Play size={12} className="fill-current ml-0.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Slider Section */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-2.5 px-0.5">
              <h2 className="text-[13px] font-extrabold text-slate-800 flex items-center gap-1.5">
                <Flame size={14} className="text-orange-500 animate-pulse" />
                <span>Trending Books</span>
              </h2>
            </div>
            
            {trendingBooks.length === 0 ? (
              <p className="text-[10px] text-slate-400 italic">No trending items in filtered genre.</p>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {trendingBooks.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => onSelectBook(book)}
                    className="w-[110px] shrink-0 cursor-pointer flex flex-col group"
                  >
                    {/* Floating Book Cover and Binding shadows */}
                    <div className="relative w-[110px] h-[155px] bg-slate-100 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-all transform group-hover:-translate-y-0.5 duration-200">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {/* Rich custom left fold overlay for genuine hardcover feel */}
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-r from-black/25 via-black/5 to-transparent"></div>
                      
                      <div className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-md px-1 py-0.5 rounded flex items-center gap-0.4 text-[7px] font-extrabold text-amber-400">
                        <Star size={7} className="fill-amber-400 text-amber-400" />
                        <span>{book.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <h4 className="text-[10px] font-extrabold text-slate-800 mt-2 line-clamp-1 leading-tight group-hover:text-teal-600 truncate">
                      {book.title}
                    </h4>
                    <p className="text-[8.5px] font-medium text-slate-400 mt-0.5 truncate">{book.author}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Section Grid */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2.5 px-0.5">
              <h2 className="text-[13px] font-extrabold text-slate-800">Recommended For You</h2>
              <button 
                onClick={() => onNavigateScreen('categories')}
                className="text-[9px] font-bold text-slate-400 hover:text-slate-600 flex items-center"
              >
                <span>Browse Menu</span>
                <ChevronRight size={10} />
              </button>
            </div>
            {recommendedBooks.length === 0 ? (
              <p className="text-[10px] text-slate-400 italic">No recommended items under active filter.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3.5">
                {recommendedBooks.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => onSelectBook(book)}
                    className="flex flex-col bg-white rounded-2xl p-2.5 border border-slate-100/70 hover:shadow shadow-sm cursor-pointer transition-all duration-200"
                  >
                    <div className="relative aspect-[3/4] w-full bg-slate-100 rounded-xl overflow-hidden shadow-sm mb-2 group">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-r from-black/20 via-black/5 to-transparent"></div>
                      <div className="absolute top-1.5 right-1.5 bg-white/95 backdrop-blur-sm px-1.5 py-0.5 rounded-lg flex items-center gap-0.5 shadow-xs text-[8px] font-extrabold text-amber-500">
                        <Star size={8} className="fill-amber-500 text-amber-500" />
                        <span>{book.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <h3 className="text-[10.5px] font-bold text-slate-800 line-clamp-1 leading-tight">{book.title}</h3>
                    <p className="text-[8.5px] font-medium text-slate-400 mt-0.5 truncate">{book.author}</p>
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span className="text-[7.5px] bg-sky-50 text-sky-600 px-1 py-0.2 rounded font-extrabold tracking-wide uppercase">
                        {book.genre}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
