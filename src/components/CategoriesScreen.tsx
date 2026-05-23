import { useState } from "react";
import { BookOpen, Search, Compass, Sparkles, Clock, User, Library, Star, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Book, Category } from "../types";

interface CategoriesScreenProps {
  books: Book[];
  categories: Category[];
  onSelectBook: (book: Book) => void;
  onFilterCategory: (catName: string | null) => void;
}

// Map strings to Icon components safely
const iconMap: { [key: string]: any } = {
  BookOpen: BookOpen,
  Search: Search,
  Compass: Compass,
  Sparkles: Sparkles,
  Clock: Clock,
  User: User,
};

type SortOption = 'rating' | 'title' | 'pages';

export default function CategoriesScreen({
  books,
  categories,
  onSelectBook,
  onFilterCategory,
}: CategoriesScreenProps) {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>('rating');
  const [showFilters, setShowFilters] = useState(false);

  // Filter books
  const filteredBooks = books.filter((book) => {
    const matchesGenre = selectedGenre ? book.genre === selectedGenre : true;
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  // Sort books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortOption === 'rating') return b.rating - a.rating;
    if (sortOption === 'pages') return b.pages - a.pages;
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="w-full h-full flex flex-col bg-slate-50/60 p-4 pb-20 overflow-y-auto scrollbar-hide select-none animate-fadeIn">
      {/* Search and Filters Header */}
      <div className="mb-4 shrink-0">
        <h2 className="text-[16px] font-extrabold text-slate-800 mb-3">Explore Categories</h2>
        
        <div className="flex gap-2">
          {/* Internal search input */}
          <div className="flex-1 flex items-center bg-white border border-slate-100/80 rounded-2xl shadow-sm px-3 py-2">
            <Search size={14} className="text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Filter genre titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-semibold text-slate-700 placeholder-slate-400 outline-none bg-transparent"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-2xl border transition-colors flex items-center justify-center ${
              showFilters ? "bg-teal-50 border-teal-200 text-teal-600" : "bg-white border-slate-100 text-slate-500"
            }`}
          >
            <SlidersHorizontal size={14} />
          </button>
        </div>

        {/* Dynamic filters panel */}
        {showFilters && (
          <div className="mt-2.5 bg-white border border-slate-100 rounded-2xl p-3 shadow-md divide-y divide-slate-100 animate-fadeIn">
            <div className="pb-2.5">
              <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1">
                <ArrowUpDown size={10} />
                <span>Sort Literature by</span>
              </span>
              <div className="flex gap-2">
                {(['rating', 'title', 'pages'] as SortOption[]).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSortOption(opt)}
                    className={`px-3 py-1.5 rounded-xl text-[9.5px] font-extrabold capitalize transition-colors ${
                      sortOption === opt 
                        ? "bg-teal-600 text-white shadow-sm"
                        : "bg-slate-50 border border-slate-100 text-slate-600"
                    }`}
                  >
                    {opt === 'rating' ? '⭐ Highest Rated' : opt === 'title' ? '🔤 Title A-Z' : '📄 Page Count'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Categories Grid (only if no specific genre is isolated) */}
      {!selectedGenre ? (
        <div className="mb-5 shrink-0">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-3 pl-0.5">Genres Bento</span>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => {
              const IconComp = iconMap[cat.iconName] || BookOpen;
              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    setSelectedGenre(cat.name);
                    onFilterCategory(cat.name);
                  }}
                  className={`rounded-2xl p-4 text-white ${cat.gradientClass} relative overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-all h-[100px] flex flex-col justify-between group`}
                >
                  <div className="absolute -right-2 -top-2 opacity-15 transform rotate-12 transition-transform group-hover:scale-110 duration-300">
                    <IconComp size={54} />
                  </div>
                  
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                    <IconComp size={16} className="text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-[11px] font-bold leading-tight uppercase tracking-wider">{cat.name}</h3>
                    <p className="text-[9px] text-white/80 font-mono mt-0.5">{cat.bookCount} books</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Active Filter Banner
        <div className="mb-4 shrink-0 flex justify-between items-center bg-teal-50 border border-teal-100 rounded-2xl p-3 animate-fadeIn">
          <div>
            <span className="text-[8px] font-mono bg-teal-200/50 text-teal-800 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Active Genre</span>
            <h3 className="text-[14px] font-extrabold text-teal-800 mt-1">{selectedGenre} Collection</h3>
          </div>
          <button
            onClick={() => {
              setSelectedGenre(null);
              onFilterCategory(null);
            }}
            className="text-[9.5px] font-extrabold text-teal-700 bg-white border border-teal-200 shadow-sm px-2.5 py-1 rounded-xl hover:bg-teal-100"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Book List container */}
      <div className="flex-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-3 pl-0.5">
          {selectedGenre ? `Books under ${selectedGenre}` : "All Books Library"} ({sortedBooks.length})
        </span>

        {sortedBooks.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-3xl border border-slate-100">
            <Library size={24} className="text-slate-300 mx-auto mb-2" />
            <p className="text-[10.5px] text-slate-500 font-medium font-sans">No matching literature found.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pb-6">
            {sortedBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => onSelectBook(book)}
                className="flex gap-3.5 bg-white border border-slate-100/70 rounded-2xl p-2.5 shadow-sm cursor-pointer hover:shadow hover:scale-[1.005] transition-all"
              >
                <div className="relative w-16 h-22 rounded-xl overflow-hidden shadow-sm bg-slate-100 shrink-0">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-r from-black/25 via-black/5 to-transparent"></div>
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <h3 className="text-[11px] font-extrabold text-slate-800 line-clamp-1 leading-snug">{book.title}</h3>
                    <p className="text-[9.5px] font-medium text-slate-400 mt-0.5 truncate">{book.author}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 flex-wrap gap-1">
                    <span className="text-[8px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-extrabold tracking-wide uppercase">
                      {book.genre}
                    </span>
                    <div className="flex items-center gap-0.5 text-[9.5px] font-bold text-amber-500">
                      <Star size={9} className="fill-amber-500 text-amber-500" />
                      <span>{book.rating.toFixed(1)}</span>
                      <span className="text-slate-300 font-normal ml-1">({book.pages}p)</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
