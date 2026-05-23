import { useState } from "react";
import { BookOpen, Star, Bookmark, Library, ChevronRight, Play, Heart, Download } from "lucide-react";
import { Book } from "../types";

interface LibraryScreenProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onStartReading: (book: Book) => void;
  onRemoveFromLibrary: (book: Book) => void;
}

type LibraryFilter = 'all' | 'favorites' | 'reading';

export default function LibraryScreen({
  books,
  onSelectBook,
  onStartReading,
  onRemoveFromLibrary,
}: LibraryScreenProps) {
  const [activeFilter, setActiveFilter] = useState<LibraryFilter>('all');

  // Filter books in the user library
  const libraryBooks = books.filter((b) => b.isInLibrary);

  const filteredBooks = libraryBooks.filter((book) => {
    if (activeFilter === 'favorites') return book.isFavorite;
    if (activeFilter === 'reading') return book.progress > 0 && book.progress < 100;
    return true;
  });

  return (
    <div className="w-full h-full flex flex-col bg-slate-50/60 p-4 pb-20 overflow-y-auto scrollbar-hide select-none animate-fadeIn">
      
      {/* Header Widget */}
      <div className="mb-4 shrink-0">
        <h2 className="text-[16px] font-extrabold text-slate-800">Your Bookshelf</h2>
        <p className="text-[10px] text-slate-400 font-medium">Manage your saved classics and live reading achievements.</p>
        
        {/* Toggle Pills */}
        <div className="flex bg-slate-100/80 p-0.5 rounded-xl mt-3.5 border border-slate-100">
          {(['all', 'reading', 'favorites'] as LibraryFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-1 py-1.5 rounded-lg text-[9.5px] font-bold capitalize transition-all ${
                activeFilter === filter 
                  ? "bg-teal-600 text-white shadow" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {filter === 'all' ? 'All Books' : filter === 'reading' ? 'In Progress' : '❤ Favorites'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Books list */}
      <div className="flex-1 text-slate-800">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-3.5 pl-0.5">
          {activeFilter === 'all' ? 'Saved Collections' : activeFilter === 'reading' ? 'Ongoing Journeys' : 'Secret Favorites'} ({filteredBooks.length})
        </span>

        {filteredBooks.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-3xl border border-slate-100/80 flex flex-col justify-center items-center shadow-xs">
            <Library size={24} className="text-slate-300 mb-2" />
            <h4 className="text-[11px] font-bold text-slate-700">Shelf is Empty</h4>
            <p className="text-[9.5px] text-slate-400 mt-1 max-w-[200px] leading-relaxed">
              {activeFilter === 'all' 
                ? "Browse our rich catalog and add masterpieces to your libraryhelf!"
                : activeFilter === 'reading' 
                ? "No book reads started yet. Launch a sample session!" 
                : "Mark items with a heart to save them as favorites."
              }
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pb-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => onSelectBook(book)}
                className="flex gap-3 bg-white border border-slate-100/80 rounded-2xl p-2.5 shadow-sm cursor-pointer hover:shadow hover:scale-[1.005] transition-all relative overflow-hidden"
              >
                {/* Book Cover */}
                <div className="relative w-15 h-21 rounded-xl overflow-hidden bg-slate-100 shrink-0 shadow-xs">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-r from-black/25 via-black/5 to-transparent"></div>
                </div>

                {/* Info and Progress Area */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <h3 className="text-[11px] font-extrabold text-slate-800 leading-snug truncate pr-6">{book.title}</h3>
                    <p className="text-[9.5px] font-medium text-slate-400 truncate mt-0.2">{book.author}</p>
                  </div>

                  {/* Reading Progress Line */}
                  <div className="mt-2 text-slate-800">
                    <div className="flex justify-between items-center text-[8.5px] font-extrabold mb-1">
                      <span className="text-slate-400 uppercase">Read Progress</span>
                      <span className="text-teal-600 font-bold">{book.progress}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500" style={{ width: `${book.progress}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Right Side Instant Play or Remove buttons */}
                <div className="flex flex-col justify-between items-end self-stretch shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromLibrary(book);
                    }}
                    className="text-[10px] text-rose-400 hover:text-rose-600 p-1 bg-rose-50/50 rounded-lg"
                    title="Remove from bookshelf"
                  >
                    ✕
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartReading(book);
                    }}
                    className="w-7 h-7 bg-teal-50 text-teal-600 flex items-center justify-center rounded-full hover:bg-teal-600 hover:text-white transition-colors"
                  >
                    <Play size={10} className="fill-current ml-0.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
