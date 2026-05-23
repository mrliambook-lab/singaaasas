import { useState, useEffect } from "react";
import { Book, Category, MobileScreen, UserProfile } from "./types";
import { INITIAL_BOOKS, INITIAL_CATEGORIES, DEFAULT_USER } from "./data";
import PhoneContainer from "./components/PhoneContainer";
import SplashScreen from "./components/SplashScreen";
import HomeScreen from "./components/HomeScreen";
import CategoriesScreen from "./components/CategoriesScreen";
import BookDetailsScreen from "./components/BookDetailsScreen";
import ReadingScreen from "./components/ReadingScreen";
import LibraryScreen from "./components/LibraryScreen";
import ProfileScreen from "./components/ProfileScreen";
import { 
  Sparkles, 
  Smartphone, 
  Layers, 
  BookOpen, 
  Info, 
  HelpCircle, 
  Check, 
  RotateCcw,
  Compass,
  Library,
  User,
  Plus
} from "lucide-react";

export default function App() {
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem("bookverse_books");
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("bookverse_user");
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [activeBook, setActiveBook] = useState<Book>(books[0]);
  const [activeScreen, setActiveScreen] = useState<MobileScreen>('splash');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Studio Display State:
  // 'interactive' = normal mobile device explorer
  // 'presentation' = triple mobile screen showroom side-by-side
  const [presentationMode, setPresentationMode] = useState<'interactive' | 'presentation'>('presentation');

  // AI Selector state
  const [aiGenres, setAiGenres] = useState<string[]>(["Sci-Fi"]);
  const [aiMood, setAiMood] = useState("Exciting & Cinematic");
  const [aiPrefs, setAiPrefs] = useState("");
  const [generatingAiSelection, setGeneratingAiSelection] = useState(false);
  const [customAiBooks, setCustomAiBooks] = useState<Book[]>([]);

  // Sync state with LocalStorage for durable refreshing
  useEffect(() => {
    localStorage.setItem("bookverse_books", JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem("bookverse_user", JSON.stringify(user));
  }, [user]);

  // Handle splash completion
  const handleSplashComplete = () => {
    setActiveScreen('home');
  };

  // Change user stats on read action
  const handleUpdateProgress = (bookId: string, progressPercent: number) => {
    setBooks(prevBooks => prevBooks.map(book => {
      if (book.id === bookId) {
        // Triggers incremental minutes read when reader shifts forward
        if (progressPercent > book.progress) {
          setUser(prevUser => ({
            ...prevUser,
            stats: {
              ...prevUser.stats,
              minutesReadToday: prevUser.stats.minutesReadToday + 3,
              minutesReadThisWeek: prevUser.stats.minutesReadThisWeek + 3,
              pagesReadTotal: prevUser.stats.pagesReadTotal + 2,
              booksFinished: progressPercent >= 100 && book.progress < 100 
                ? prevUser.stats.booksFinished + 1 
                : prevUser.stats.booksFinished
            }
          }));
        }
        return { ...book, progress: progressPercent };
      }
      return book;
    }));
  };

  const handleToggleLibrary = (targetBook: Book) => {
    setBooks(prevBooks => prevBooks.map(b => {
      if (b.id === targetBook.id) {
        const nextInLibrary = !b.isInLibrary;
        return { ...b, isInLibrary: nextInLibrary, isFavorite: nextInLibrary ? b.isFavorite : false };
      }
      return b;
    }));
  };

  const handleToggleFavorite = (targetBook: Book) => {
    setBooks(prevBooks => prevBooks.map(b => {
      if (b.id === targetBook.id) {
        return { ...b, isFavorite: !b.isFavorite };
      }
      return b;
    }));
  };

  const handleRemoveFromLibrary = (targetBook: Book) => {
    setBooks(prevBooks => prevBooks.map(b => {
      if (b.id === targetBook.id) {
        return { ...b, isInLibrary: false, isFavorite: false, progress: 0 };
      }
      return b;
    }));
  };

  const handleChangeUserName = (newName: string) => {
    setUser(prev => ({ ...prev, name: newName }));
  };

  const handleResetApp = () => {
    localStorage.removeItem("bookverse_books");
    localStorage.removeItem("bookverse_user");
    setBooks(INITIAL_BOOKS);
    setUser(DEFAULT_USER);
    setActiveBook(INITIAL_BOOKS[0]);
    setActiveScreen('splash');
    setActiveCategory(null);
  };

  // Trigger Dynamic Gemini bookstore recommendations and generate interactive items
  const handleGenerateAISelection = async () => {
    setGeneratingAiSelection(true);
    try {
      const res = await fetch("/api/ai/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          genres: aiGenres,
          mood: aiMood,
          preferences: aiPrefs
        })
      });
      const data = await res.json();
      
      if (data.recommendations && data.recommendations.length > 0) {
        // Map recommendation objects to full Bookstore items
        const newBooks: Book[] = data.recommendations.map((rec: any, index: number) => ({
          id: `ai-book-${Date.now()}-${index}`,
          title: rec.title,
          author: rec.author,
          rating: rec.rating || 4.7,
          description: rec.description,
          genre: rec.tags?.[0] || aiGenres[0] || "Fiction",
          publishYear: 2026,
          pages: 240 + (index * 40),
          progress: 0,
          coverUrl: `https://images.unsplash.com/photo-${index === 0 ? '1589829085413-56de8ae18c73' : index === 1 ? '1629992101753-56d196c8add2' : '1506880018603-83d5b814b5a6'}?q=80&w=400&auto=format&fit=crop`,
          coverColor: "from-teal-850 to-cyan-950",
          isFavorite: false,
          isInLibrary: true, // Auto add to shelf
          isTrending: false,
          isRecommended: true,
          readSampleAvailable: true,
          characters: ["Lead protagonist", "The Advisor"],
          aiSummary: rec.description,
          aiThemes: rec.tags || ["Discovery", "Inspiration"],
          aiQuotes: ["To explore is to unveil the secrets of the cosmos."],
          aiReview: "Generated dynamically via smart Gemini AI Bookstore synthesis."
        }));

        setBooks(prev => [...newBooks, ...prev]);
        setCustomAiBooks(newBooks);
        // Switch view to custom details
        setActiveBook(newBooks[0]);
        setActiveScreen('details');
      }
    } catch (e) {
      console.error("AI Recommendation error, applying fallback:", e);
      // Fallback books
      const fallbackBook: Book = {
        id: `ai-fallback-${Date.now()}`,
        title: `The Cosmic Sands`,
        author: "Vance Vance",
        rating: 4.8,
        description: "An elegant science-fiction epic crafted for your interest.",
        genre: aiGenres[0] || "Fiction",
        publishYear: 2026,
        pages: 350,
        progress: 0,
        coverUrl: "https://images.unsplash.com/photo-1543508282-6319a3e2621d?q=80&w=400&auto=format&fit=crop",
        coverColor: "from-indigo-950 to-purple-950",
        isFavorite: false,
        isInLibrary: true,
        isTrending: false,
        isRecommended: true,
        readSampleAvailable: true,
        characters: ["Astral Pioneer"],
        aiSummary: "Exploring space expansion.",
        aiThemes: ["Pioneering", "AI Mastery"]
      };
      setBooks(prev => [fallbackBook, ...prev]);
      setActiveBook(fallbackBook);
      setActiveScreen('details');
    } finally {
      setGeneratingAiSelection(false);
    }
  };

  const handleSelectBook = (book: Book) => {
    setActiveBook(book);
    setActiveScreen('details');
  };

  const handleStartReading = (book: Book) => {
    setActiveBook(book);
    setActiveScreen('reading');
    // Ensure book is on user library
    if (!book.isInLibrary) {
      setBooks(prevBooks => prevBooks.map(b => {
        if (b.id === book.id) return { ...b, isInLibrary: true };
        return b;
      }));
    }
  };

  // Quick navigation selector dentro de telefone
  const renderFloatingNavbar = () => {
    if (activeScreen === 'splash' || activeScreen === 'reading') return null;

    const navItems = [
      { screen: 'home' as MobileScreen, label: 'Browse', icon: Compass },
      { screen: 'categories' as MobileScreen, label: 'Explore', icon: Layers },
      { screen: 'library' as MobileScreen, label: 'Books', icon: Library },
      { screen: 'profile' as MobileScreen, label: 'Stats', icon: User }
    ];

    return (
      <div className="absolute bottom-3 left-4 right-4 bg-white/94 backdrop-blur-lg rounded-2xl border border-slate-100/70 p-1.5 flex justify-between shadow-lg shadow-slate-100/40 z-40 select-none shrink-0 transition-transform">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.screen;
          return (
            <button
              key={item.screen}
              onClick={() => {
                setActiveScreen(item.screen);
                setActiveCategory(null);
              }}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                isActive 
                  ? "bg-teal-600/90 text-white font-bold scale-[1.02]" 
                  : "text-slate-400 hover:text-slate-600 font-semibold"
              }`}
            >
              <Icon size={14} className={isActive ? "text-white" : "text-slate-400"} />
              <span className="text-[8px] mt-1 tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>
    );
  };

  // Helper inside phone container to dynamically switch layout screens
  const renderPhoneScreen = (screenType: MobileScreen, contextBook: Book) => {
    switch (screenType) {
      case 'splash':
        return <SplashScreen onComplete={handleSplashComplete} />;
      case 'home':
        return (
          <HomeScreen
            books={books}
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            onSelectBook={handleSelectBook}
            onStartReading={handleStartReading}
            onNavigateScreen={(scr) => setActiveScreen(scr)}
          />
        );
      case 'categories':
        return (
          <CategoriesScreen
            books={books}
            categories={categories}
            onSelectBook={handleSelectBook}
            onFilterCategory={(gVal) => {
              setActiveCategory(gVal);
              setActiveScreen('home'); // jump home to filtered view
            }}
          />
        );
      case 'details':
        return (
          <BookDetailsScreen
            book={contextBook}
            onBack={() => setActiveScreen('home')}
            onToggleLibrary={handleToggleLibrary}
            onStartReading={handleStartReading}
            relatedBooks={books.filter(b => b.genre === contextBook.genre && b.id !== contextBook.id)}
          />
        );
      case 'reading':
        return (
          <ReadingScreen
            book={contextBook}
            onBack={() => setActiveScreen('details')}
            onUpdateProgress={handleUpdateProgress}
          />
        );
      case 'library':
        return (
          <LibraryScreen
            books={books}
            onSelectBook={handleSelectBook}
            onStartReading={handleStartReading}
            onRemoveFromLibrary={handleRemoveFromLibrary}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            user={user}
            onChangeName={handleChangeUserName}
            onLogoutSimulated={handleResetApp}
          />
        );
      default:
        return <SplashScreen onComplete={handleSplashComplete} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#E0F2F7] via-[#F8FBFC] to-[#FFFFFF] flex flex-col font-sans relative antialiased text-slate-700">
      
      {/* Studio Header Block - Sleek Interface Style */}
      <header className="w-full max-w-7xl mx-auto pt-6 px-6 md:px-8 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-end shrink-0 z-30 select-none gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <h1 className="text-3xl font-extrabold text-teal-800 tracking-tight font-display">
              BookVerse
            </h1>
          </div>
          <p className="text-slate-500 text-xs font-semibold italic mt-0.5">Premium Bookstore App Concept</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="hidden md:flex gap-2">
            <div className="bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-xs text-[10px] font-bold text-teal-800 border border-teal-100/50 uppercase tracking-wider">
              MOBILE-FIRST
            </div>
            <div className="bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-xs text-[10px] font-bold text-teal-800 border border-teal-100/50 uppercase tracking-wider">
              USER-CENTRIC
            </div>
          </div>

          {/* View Toggle Controller */}
          <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/50">
            <button
              onClick={() => setPresentationMode('presentation')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all outline-none cursor-pointer ${
                presentationMode === 'presentation' 
                  ? "bg-white text-teal-800 shadow-xs" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Layers size={11} />
              <span>Showroom Deck</span>
            </button>
            
            <button
              onClick={() => {
                setPresentationMode('interactive');
                if (activeScreen === 'splash') setActiveScreen('home');
              }}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all outline-none cursor-pointer ${
                presentationMode === 'interactive' 
                  ? "bg-white text-teal-800 shadow-xs" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Smartphone size={11} />
              <span>Interactive Device</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Board Grid Workspace */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 lg:items-center">
        
        {/* Left Side: App Specs and Dynamic AI recommendations generator */}
        <div className="w-full lg:w-[320px] bg-white/70 backdrop-blur-md border border-white/80 rounded-[32px] p-5.5 flex flex-col gap-5 shadow-xl shadow-slate-200/20 shrink-0">
          <div>
            <span className="text-[9px] bg-teal-50 text-teal-800 border border-teal-100 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Specs Panel</span>
            <h2 className="text-[20px] font-bold text-slate-850 font-display tracking-tight mt-1.5 leading-none">About BookVerse</h2>
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold mt-2">
              A premium mobile bookstore UI presentation inspired by boutique e-commerce application design standards.
            </p>
          </div>

          <hr className="border-slate-100/80" />

          {/* AI Generator Panel */}
          <div className="space-y-3 select-none">
            <h3 className="text-[12px] font-extrabold text-slate-800 flex items-center gap-1.5">
              <Sparkles size={13} className="text-teal-500" />
              <span>AI Recommendations Lab</span>
            </h3>
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed leading-normal">
              Select properties below to call the Gemini API on the server. We will append the synthesised books automatically!
            </p>

            {/* Genre Multi Check */}
            <div>
              <span className="text-[9.5px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-1.5">Genres</span>
              <div className="flex flex-wrap gap-1.5">
                {["History", "Sci-Fi", "Mystery", "Self-Help"].map((genre) => {
                  const isSelected = aiGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      onClick={() => {
                        if (isSelected) setAiGenres(prev => prev.filter(g => g !== genre));
                        else setAiGenres(prev => [...prev, genre]);
                      }}
                      className={`px-2 py-1 rounded-lg text-[9px] font-bold transition-all ${
                        isSelected 
                          ? "bg-teal-500 text-white" 
                          : "bg-slate-50 border border-slate-100 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mood Input Select */}
            <div>
              <span className="text-[9.5px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-1.5">Desired Mood</span>
              <select
                value={aiMood}
                onChange={(e) => setAiMood(e.target.value)}
                className="w-full text-[10.5px] font-bold text-slate-700 bg-slate-50 border border-slate-100 p-2 rounded-xl outline-none cursor-pointer focus:ring-1 focus:ring-teal-500"
              >
                <option value="Thoughtful & Intellectual">Thoughtful & Intellectual</option>
                <option value="Exciting & Cinematic">Exciting & Action-packed</option>
                <option value="Soothing & Reflective">Soothing & Heartwarming</option>
                <option value="Mysterious & Analytical">Mysterious & Suspenseful</option>
              </select>
            </div>

            {/* AI Generator button */}
            <button
              onClick={handleGenerateAISelection}
              disabled={generatingAiSelection || aiGenres.length === 0}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-100 text-white disabled:text-slate-400 font-bold text-[10.5px] tracking-wide flex items-center justify-center gap-1.5 shadow-sm shadow-teal-100 active:scale-[0.98] transition-all"
            >
              <Sparkles size={11} className={generatingAiSelection ? "animate-spin" : ""} />
              <span>{generatingAiSelection ? "Synthesizing Book..." : "Add AI Personalized Book"}</span>
            </button>
          </div>

          <hr className="border-slate-100/80" />

          {/* Reset App Stats Data controller */}
          <div className="flex justify-between items-center text-[10.5px]">
            <span className="text-slate-400 font-medium">Need to restart presentation?</span>
            <button
              onClick={handleResetApp}
              className="font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 font-mono uppercase text-[9px]"
            >
              <RotateCcw size={10} />
              <span>Reset State</span>
            </button>
          </div>
        </div>

        {/* Right Area: Interactive Smartphone Viewports */}
        <div className="flex-1 flex justify-center items-center relative min-h-[750px] pointer-events-auto">
          
          {presentationMode === 'interactive' ? (
            // Mode 1: Focus Frame Mockup (Classic explorer mode)
            <PhoneContainer
              title={`${activeScreen.toUpperCase()} VIEW`}
              isFocused={true}
            >
              {renderPhoneScreen(activeScreen, activeBook)}
              {renderFloatingNavbar()}
            </PhoneContainer>
          ) : (
            // Mode 2: Multi-Screen Side-by-Side Presentation Deck
            <div className="flex flex-col md:flex-row gap-5 lg:gap-8 items-center justify-center w-full max-w-[1200px] select-none scale-90 lg:scale-100 transition-transform">
              
              {/* Phone 1: Home Browse layout */}
              <div className="transform md:-rotate-1 hover:rotate-0 transition-transform duration-300">
                <PhoneContainer
                  title="HOME / BROWSE SCREEN"
                  isFocused={activeScreen === 'home'}
                  onFocusClick={() => {
                    setActiveScreen('home');
                    setPresentationMode('interactive');
                  }}
                >
                  {renderPhoneScreen('home', activeBook)}
                  
                  {/* Embedded floating navbar bar preview */}
                  <div className="absolute bottom-3 left-4 right-4 bg-white/94 border border-slate-100 rounded-2xl p-1.5 flex justify-between shadow-xs text-slate-400">
                    <div className="flex-1 py-1 rounded bg-teal-600 text-white text-[8px] font-bold flex flex-col items-center justify-center"><Compass size={12} /><span>Browse</span></div>
                    <div className="flex-1 py-1 rounded text-[8px] font-semibold flex flex-col items-center justify-center"><Layers size={11} /><span>Explore</span></div>
                    <div className="flex-1 py-1 rounded text-[8px] font-semibold flex flex-col items-center justify-center"><Library size={11} /><span>Books</span></div>
                    <div className="flex-1 py-1 rounded text-[8px] font-semibold flex flex-col items-center justify-center"><User size={11} /><span>Stats</span></div>
                  </div>
                </PhoneContainer>
              </div>

              {/* Phone 2: Book Analytics / Character Chat */}
              <div className="transform md:translate-y-4 hover:translate-y-0 transition-transform duration-300">
                <PhoneContainer
                  title="ANALYTICS & CAST CHAT"
                  isFocused={activeScreen === 'details'}
                  onFocusClick={() => {
                    setActiveScreen('details');
                    setPresentationMode('interactive');
                  }}
                >
                  {renderPhoneScreen('details', activeBook)}
                </PhoneContainer>
              </div>

              {/* Phone 3: Clean EPUB Ebook Reader */}
              <div className="transform md:rotate-1 hover:rotate-0 transition-transform duration-300">
                <PhoneContainer
                  title="IMMERSIVE READ VIEWER"
                  isFocused={activeScreen === 'reading'}
                  onFocusClick={() => {
                    setActiveScreen('reading');
                    setPresentationMode('interactive');
                  }}
                >
                  {renderPhoneScreen('reading', activeBook)}
                </PhoneContainer>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}
