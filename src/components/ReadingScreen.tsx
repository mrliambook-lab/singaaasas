import { useState, useEffect } from "react";
import { ArrowLeft, BookOpen, Moon, Sun, Type, Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Book } from "../types";
import { BOOK_SAMPLE_CONTENT, DEFAULT_SAMPLE_CONTENT } from "../data";

interface ReadingScreenProps {
  book: Book;
  onBack: () => void;
  onUpdateProgress: (bookId: string, progress: number) => void;
}

type ReaderTheme = 'light' | 'sepia' | 'dark';
type FontStyle = 'serif' | 'sans' | 'mono';

export default function ReadingScreen({
  book,
  onBack,
  onUpdateProgress,
}: ReadingScreenProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [theme, setTheme] = useState<ReaderTheme>('sepia');
  const [fontSize, setFontSize] = useState<number>(14); // in px
  const [fontStyle, setFontStyle] = useState<FontStyle>('serif');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarks, setBookmarks] = useState<number[]>([]); // list of bookmarked pages
  const [showSettings, setShowSettings] = useState(false);

  // Retrieve book pages or default sample lines
  const pages = BOOK_SAMPLE_CONTENT[book.id] || DEFAULT_SAMPLE_CONTENT;

  // Sync bookmark indicators
  useEffect(() => {
    setIsBookmarked(bookmarks.includes(currentPage));
  }, [currentPage, bookmarks]);

  // Handle page shifts & update reading progress bar
  const handlePageChange = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentPage < pages.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      const calcProgress = Math.round((nextPage / (pages.length - 1)) * 100);
      onUpdateProgress(book.id, calcProgress);
    } else if (direction === 'prev' && currentPage > 0) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      const calcProgress = Math.round((prevPage / (pages.length - 1)) * 100);
      onUpdateProgress(book.id, calcProgress);
    }
  };

  const handleToggleBookmark = () => {
    if (bookmarks.includes(currentPage)) {
      setBookmarks(prev => prev.filter(p => p !== currentPage));
      setIsBookmarked(false);
    } else {
      setBookmarks(prev => [...prev, currentPage]);
      setIsBookmarked(true);
    }
  };

  // Setup theme-specific class utilities
  const getThemeClass = () => {
    if (theme === 'dark') return "bg-zinc-900 text-zinc-300 border-zinc-800";
    if (theme === 'sepia') return "bg-[#F7EFE3] text-[#433422] border-[#EADFCB]";
    return "bg-white text-slate-800 border-slate-100";
  };

  const getFontFamilyStyle = () => {
    if (fontStyle === 'serif') return "font-serif";
    if (fontStyle === 'mono') return "font-mono";
    return "font-sans";
  };

  return (
    <div className={`w-full h-full flex flex-col transition-all duration-300 ${getThemeClass()} select-none relative animate-fadeIn`}>
      
      {/* Dynamic Header */}
      <div className={`h-14 px-4 flex justify-between items-center z-20 shrink-0 border-b ${
        theme === 'dark' ? "border-zinc-800/80" : "border-slate-100/80"
      }`}>
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button
            onClick={onBack}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              theme === 'dark' ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-slate-100 text-slate-700"
            }`}
          >
            <ArrowLeft size={16} />
          </button>
          
          <div className="min-w-0 pr-2">
            <h4 className="text-[10px] font-mono tracking-wide uppercase line-clamp-1 opacity-70 leading-none">Reading Mode</h4>
            <h1 className="text-[12px] font-extrabold truncate mt-0.5">{book.title}</h1>
          </div>
        </div>

        {/* Header Tools */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleToggleBookmark}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors`}
          >
            {isBookmarked ? (
              <BookmarkCheck size={16} className="text-teal-600 fill-teal-600 animate-pulse" />
            ) : (
              <Bookmark size={16} className={theme === 'dark' ? "text-zinc-400" : "text-slate-500"} />
            )}
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              theme === 'dark' ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-slate-100 text-slate-700"
            }`}
          >
            <Type size={16} />
          </button>
        </div>
      </div>

      {/* Book Settings Slide Panel */}
      {showSettings && (
        <div className={`absolute top-14 left-0 right-0 p-4 border-b shadow-lg z-30 space-y-3.5 transition-all duration-300 animate-slideDown ${
          theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-white border-slate-100"
        }`}>
          {/* Theme Chooser */}
          <div className="flex justify-between items-center text-slate-800">
            <span className={`text-[10px] font-mono uppercase ${theme === 'dark' ? "text-zinc-400" : "text-slate-500"}`}>Paper Texture</span>
            <div className="flex bg-slate-100/60 p-0.5 rounded-lg border border-slate-100">
              {(['light', 'sepia', 'dark'] as ReaderTheme[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-3 py-1 rounded text-[9.5px] font-bold capitalize transition-all ${
                    theme === t 
                      ? "bg-teal-600 text-white shadow" 
                      : `${theme === 'dark' ? "text-zinc-600 hover:text-zinc-200" : "text-slate-600"}`
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Typography Styles */}
          <div className="flex justify-between items-center text-slate-800">
            <span className={`text-[10px] font-mono uppercase ${theme === 'dark' ? "text-zinc-400" : "text-slate-500"}`}>Font Selection</span>
            <div className="flex gap-1.5">
              {(['serif', 'sans', 'mono'] as FontStyle[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFontStyle(f)}
                  className={`px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all border ${
                    fontStyle === f 
                      ? "bg-teal-600 border-teal-600 text-white" 
                      : `${theme === 'dark' ? "border-zinc-800 text-zinc-400 bg-zinc-800/40" : "border-slate-200 text-slate-500 bg-slate-50"}`
                  }`}
                >
                  {f === 'serif' ? 'Serif' : f === 'sans' ? 'Sans' : 'Mono'}
                </button>
              ))}
            </div>
          </div>

          {/* FontSize Sizing */}
          <div className="flex justify-between items-center text-slate-800">
            <span className={`text-[10px] font-mono uppercase ${theme === 'dark' ? "text-zinc-400" : "text-[#9f9175]"}`}>Font Sizing</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFontSize(prev => Math.max(11, prev - 1))}
                className={`w-6 h-6 rounded border flex items-center justify-center font-bold text-xs ${
                  theme === 'dark' ? "border-zinc-800 text-zinc-300" : "border-slate-200 text-slate-700"
                }`}
              >
                A-
              </button>
              <span className="text-[10.5px] font-mono font-bold leading-none">{fontSize}px</span>
              <button
                onClick={() => setFontSize(prev => Math.min(22, prev + 1))}
                className={`w-6 h-6 rounded border flex items-center justify-center font-bold text-xs ${
                  theme === 'dark' ? "border-zinc-800 text-zinc-300" : "border-slate-200 text-slate-700"
                }`}
              >
                A+
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main text box container with smooth heights and page views */}
      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-center select-text">
        <div 
          className={`leading-relaxed tracking-wide leading-loose mx-auto max-w-sm transition-all select-text selection:bg-teal-300 ${getFontFamilyStyle()}`}
          style={{ fontSize: `${fontSize}px` }}
        >
          {pages[currentPage]}
        </div>
      </div>

      {/* Pages bottom indicators & sliders bar */}
      <div className={`h-16 px-6 border-t flex flex-col justify-center items-center gap-1 z-20 shrink-0 ${
        theme === 'dark' ? "border-zinc-800/60 bg-zinc-950/20" : "border-slate-100 bg-slate-50/30"
      }`}>
        {/* Dynamic Pagination arrows */}
        <div className="w-full flex justify-between items-center text-slate-800">
          <button
            onClick={() => handlePageChange('prev')}
            disabled={currentPage === 0}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
              theme === 'dark' ? "border-zinc-800 hover:bg-zinc-800" : "border-slate-100 hover:bg-slate-100"
            } disabled:opacity-20`}
          >
            <ChevronLeft size={14} className={theme === 'dark' ? "text-zinc-400" : "text-slate-600"} />
          </button>

          <span className={`text-[10px] font-mono uppercase font-bold tracking-widest ${
            theme === 'dark' ? "text-zinc-400" : "text-slate-500"
          }`}>
            Page {currentPage + 1} of {pages.length}
          </span>

          <button
            onClick={() => handlePageChange('next')}
            disabled={currentPage === pages.length - 1}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
              theme === 'dark' ? "border-zinc-800 hover:bg-zinc-800" : "border-slate-100 hover:bg-slate-100"
            } disabled:opacity-20`}
          >
            <ChevronRight size={14} className={theme === 'dark' ? "text-zinc-400" : "text-slate-600"} />
          </button>
        </div>
      </div>
    </div>
  );
}
