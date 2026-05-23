import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Star, Heart, Bookmark, Sparkles, MessageCircle, Info, BookOpen, ShoppingBag, Send } from "lucide-react";
import { Book, ChatMessage } from "../types";

interface BookDetailsScreenProps {
  book: Book;
  onBack: () => void;
  onToggleLibrary: (book: Book) => void;
  onStartReading: (book: Book) => void;
  relatedBooks: Book[];
}

export default function BookDetailsScreen({
  book,
  onBack,
  onToggleLibrary,
  onStartReading,
  relatedBooks,
}: BookDetailsScreenProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'ai' | 'chat'>('about');
  
  // AI summary states
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [aiSummaryData, setAiSummaryData] = useState<{
    summary?: string;
    themes?: string[];
    keyQuotes?: string[];
    quickReview?: string;
  } | null>(null);

  // Character chat states
  const [selectedCharacter, setSelectedCharacter] = useState(book.characters?.[0] || "Author");
  const [userChatMsg, setUserChatMsg] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Buy now simulation modal
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  // Scroll chat history down
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Load static or dynamic AI Summary
  const handleLoadAISummary = async () => {
    if (aiSummaryData) return; // already loaded
    
    // Check if the book already has hardcoded AI data
    if (book.aiSummary) {
      setAiSummaryData({
        summary: book.aiSummary,
        themes: book.aiThemes,
        keyQuotes: book.aiQuotes,
        quickReview: book.aiReview
      });
      return;
    }

    setLoadingSummary(true);
    try {
      const res = await fetch("/api/ai/book-summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: book.title, author: book.author })
      });
      const data = await res.json();
      setAiSummaryData({
        summary: data.summary,
        themes: data.themes,
        keyQuotes: data.keyQuotes,
        quickReview: data.quickReview
      });
    } catch (e) {
      console.error("AI summarizer error, using fallback:", e);
      setAiSummaryData({
        summary: `${book.title} is an extraordinary composition by ${book.author} which engages reader emotions deeply.`,
        themes: ["Empowerment", "Transformation", "Modern Connections"],
        keyQuotes: ["The true secret lies within the pages of self-commitment."],
        quickReview: "We highly recommend picking up this item. It expands intellectual curiosity greatly."
      });
    } finally {
      setLoadingSummary(false);
    }
  };

  // Chat with character trigger
  const handleSendChatMessage = async () => {
    if (!userChatMsg.trim() || chatLoading) return;
    
    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: 'user',
      senderName: 'You',
      text: userChatMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    setUserChatMsg("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/ai/chat-companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookTitle: book.title,
          characterName: selectedCharacter,
          userMessage: userMsg.text,
          chatHistory: chatHistory.slice(-4) // send recent dialogue context
        })
      });
      const data = await res.json();
      
      const charMsg: ChatMessage = {
        id: `chat-char-${Date.now()}`,
        sender: 'character',
        senderName: selectedCharacter,
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatHistory(prev => [...prev, charMsg]);
    } catch (e) {
      console.error("Character companion issue, using fallback:", e);
      setChatHistory(prev => [...prev, {
        id: `chat-err-${Date.now()}`,
        sender: 'character',
        senderName: selectedCharacter,
        text: `Forgive me, my thoughts drift back to ${book.title}. We shall converse of these endeavors anew soon.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSimulateBuy = () => {
    setShowPurchaseModal(true);
    setTimeout(() => {
      setPurchaseSuccess(true);
    }, 1500);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden relative select-none animate-fadeIn">
      
      {/* Scrollable Main Area */}
      <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
        
        {/* Transparent header container */}
        <div className="relative w-full h-[260px] flex items-center justify-center py-4 bg-gradient-to-b from-slate-100 to-transparent">
          {/* Header Bar */}
          <div className="absolute top-3 left-0 right-0 px-4 flex justify-between items-center z-20">
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center text-slate-700 shadow-sm border border-slate-100/50 hover:bg-white"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={() => onToggleLibrary(book)}
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm border border-slate-100/50 backdrop-blur-md transition-colors ${
                book.isInLibrary 
                  ? "bg-rose-50 border-rose-100 text-rose-500" 
                  : "bg-white/85 text-slate-500 hover:bg-white"
              }`}
            >
              <Heart size={16} className={book.isInLibrary ? "fill-rose-500 text-rose-500" : ""} />
            </button>
          </div>

          {/* Book cover visual with dynamic binding borders & heavy shadows */}
          <div className="relative w-[130px] h-[185px] z-10 mt-4 rounded-2xl overflow-hidden shadow-2xl transition-transform hover:scale-102 duration-300">
            <img
              src={book.coverUrl}
              alt={book.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {/* Bound pages shadow */}
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-r from-black/25 via-black/5 to-transparent"></div>
          </div>
        </div>

        {/* Title, Author & Basic Rating Specs */}
        <div className="px-5 text-center mb-5 mt-2">
          <h1 className="text-[16px] font-extrabold text-slate-800 leading-tight block truncate px-2">{book.title}</h1>
          <p className="text-[10.5px] font-semibold text-slate-400 mt-1">{book.author}</p>
          
          <div className="flex justify-center items-center gap-3 mt-3">
            <div className="flex items-center gap-0.5 bg-amber-50 rounded-lg px-2 py-0.5 text-[9.5px] font-bold text-amber-600">
              <Star size={10} className="fill-amber-500 text-amber-500" />
              <span>{book.rating.toFixed(1)}</span>
            </div>
            <div className="text-[9.5px] font-semibold text-slate-400 border-l border-slate-200 pl-3">
              Year {book.publishYear}
            </div>
            <div className="text-[9.5px] font-semibold text-slate-400 border-l border-slate-200 pl-3">
              {book.pages} Pages
            </div>
          </div>
        </div>

        {/* Action Quick Tabs */}
        <div className="flex px-4 border-b border-slate-100/80 mb-4 text-slate-800">
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 flex justify-center items-center gap-1.5 pb-2.5 text-[10.5px] font-bold tracking-wide border-b-2 transition-colors ${
              activeTab === 'about' ? "border-teal-600 text-teal-600" : "border-transparent text-slate-400"
            }`}
          >
            <Info size={12} />
            <span>Overview</span>
          </button>
          
          <button
            onClick={() => {
              setActiveTab('ai');
              handleLoadAISummary();
            }}
            className={`flex-1 flex justify-center items-center gap-1.5 pb-2.5 text-[10.5px] font-bold tracking-wide border-b-2 transition-colors ${
              activeTab === 'ai' ? "border-teal-600 text-teal-600" : "border-transparent text-slate-400"
            }`}
          >
            <Sparkles size={12} className={activeTab === 'ai' ? "text-teal-500 animate-pulse" : "text-slate-400"} />
            <span>AI Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 flex justify-center items-center gap-1.5 pb-2.5 text-[10.5px] font-bold tracking-wide border-b-2 transition-colors ${
              activeTab === 'chat' ? "border-teal-600 text-teal-600" : "border-transparent text-slate-400"
            }`}
          >
            <MessageCircle size={12} />
            <span>Cast Chat</span>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'about' && (
          <div className="px-5 space-y-5 animate-fadeIn">
            <div>
              <h3 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">Book Teaser</h3>
              <p className="text-[11px] font-medium leading-relaxed text-slate-600">{book.description}</p>
            </div>

            {/* Related items slider */}
            <div>
              <h3 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2.5">Related Literature</h3>
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                {relatedBooks.map(b => (
                  <div
                    key={b.id}
                    onClick={() => onStartReading(b)}
                    className="w-[85px] shrink-0 bg-slate-50 border border-slate-100/50 p-1.5 rounded-xl cursor-pointer hover:shadow hover:bg-slate-100/40 text-left"
                  >
                    <img
                      src={b.coverUrl}
                      alt={b.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-22 object-cover rounded-lg shadow-sm"
                    />
                    <h5 className="text-[9px] font-bold text-slate-800 line-clamp-1 mt-1.5 leading-tight">{b.title}</h5>
                    <p className="text-[8px] text-slate-400 truncate mt-0.2">{b.author}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="px-5 space-y-4 animate-fadeIn">
            {loadingSummary ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Sparkles className="text-teal-500 animate-spin mb-2.5" size={20} />
                <span className="text-[10px] font-mono text-slate-400">Consulting BookVerse AI Companion...</span>
              </div>
            ) : aiSummaryData ? (
              <>
                <div className="bg-gradient-to-br from-sky-50 to-teal-50/40 border border-teal-100/60 rounded-2xl p-4 shadow-xs">
                  <h4 className="text-[10px] font-mono uppercase tracking-wide text-teal-800 font-bold mb-1.5 flex items-center gap-1">
                    <Sparkles size={11} />
                    <span>AI Editorial Analysis</span>
                  </h4>
                  <p className="text-[11px] leading-relaxed text-slate-700 font-medium italic">
                    "{aiSummaryData.summary}"
                  </p>
                </div>

                {/* Key Themes list as pill buttons */}
                <div>
                  <h3 className="text-[10.5px] font-mono uppercase tracking-wider text-slate-400 mb-2">Major Thematic Structures</h3>
                  <div className="flex flex-col gap-1.5">
                    {aiSummaryData.themes?.map((t, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-[10px] font-bold text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Quotes extracted */}
                {aiSummaryData.keyQuotes && aiSummaryData.keyQuotes.length > 0 && (
                  <div>
                    <h3 className="text-[10.5px] font-mono uppercase tracking-wider text-slate-400 mb-2">Notable Highlight Quotes</h3>
                    <div className="space-y-2">
                      {aiSummaryData.keyQuotes.map((q, idx) => (
                        <div key={idx} className="border-l-2 border-sky-400 pl-3.5 py-0.5 text-[10.5px] text-slate-600 font-medium italic leading-relaxed">
                          "{q}"
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Static critic review */}
                {aiSummaryData.quickReview && (
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                    <span className="text-[9px] font-mono text-slate-400 block mb-1 uppercase font-bold">Critic Assessment</span>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{aiSummaryData.quickReview}</p>
                  </div>
                )}
              </>
            ) : null}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="px-4 flex flex-col h-[320px] animate-fadeIn text-slate-800">
            {/* Cast selector */}
            <div className="flex items-center justify-between mb-3 shrink-0">
              <span className="text-[9px] font-mono text-slate-400 uppercase">Consult with Cast:</span>
              <div className="flex gap-1">
                {(book.characters || ["Author"]).map((char) => (
                  <button
                    key={char}
                    onClick={() => {
                      setSelectedCharacter(char);
                      setChatHistory([]); // Clear past history on flip
                    }}
                    className={`px-2 py-1 rounded-lg text-[8.5px] font-bold transition-all ${
                      selectedCharacter === char 
                        ? "bg-teal-600 text-white shadow-sm" 
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Chat Feed */}
            <div className="flex-1 overflow-y-auto border border-slate-100 rounded-2xl p-2.5 space-y-3 bg-slate-50/50 scrollbar-hide text-[10px]">
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-4 text-center text-slate-400">
                  <MessageCircle size={22} className="text-slate-300 animate-pulse mb-1.5" />
                  <p className="font-semibold text-[9.5px]">Begin conversing with {selectedCharacter}!</p>
                  <p className="text-[8.5px] mt-0.5">Explore their motivations, thoughts, or events in the narrative.</p>
                </div>
              ) : (
                chatHistory.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col max-w-[85%] ${
                      m.sender === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                    }`}
                  >
                    <span className="text-[7.5px] text-slate-400 font-mono mb-0.5">{m.senderName}</span>
                    <div className={`p-2 rounded-2xl leading-relaxed font-semibold transition-all ${
                      m.sender === 'user'
                        ? "bg-teal-600 text-white rounded-tr-none"
                        : "bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-xs"
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))
              )}

              {chatLoading && (
                <div className="flex items-center gap-1.5 text-slate-400 pl-1">
                  <span className="text-[8px] font-mono">{selectedCharacter} is crafting a reply...</span>
                </div>
              )}
              <div ref={chatEndRef}></div>
            </div>

            {/* Chat Input form */}
            <div className="mt-2 flex gap-1.5 shrink-0 select-none">
              <input
                type="text"
                placeholder={`Type message to ${selectedCharacter}...`}
                value={userChatMsg}
                onChange={(e) => setUserChatMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                className="flex-1 border border-slate-100 rounded-xl px-3 py-2 text-[10px] outline-none font-semibold text-slate-700 focus:ring-1 focus:ring-teal-500 bg-white"
              />
              <button
                onClick={handleSendChatMessage}
                disabled={chatLoading}
                className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center active:scale-95 transition-transform"
              >
                <Send size={12} className="fill-current" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button Bar inside the frame */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 flex gap-3 z-30 select-none shrink-0">
        
        {/* Buy Now button */}
        <button
          onClick={handleSimulateBuy}
          className="flex-1 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] tracking-wide flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
        >
          <ShoppingBag size={13} />
          <span>Buy Now</span>
        </button>

        {/* Read Sample button */}
        {book.readSampleAvailable && (
          <button
            onClick={() => onStartReading(book)}
            className="flex-1 py-3 rounded-2xl border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold text-[11px] tracking-wide flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
          >
            <BookOpen size={13} />
            <span>Read Sample</span>
          </button>
        )}
      </div>

      {/* Purchase simulation slide-over popup */}
      {showPurchaseModal && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex items-end justify-center z-50 animate-fadeIn">
          <div className="w-full bg-white rounded-t-[32px] p-6 text-center animate-slideUp">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4"></div>
            
            {!purchaseSuccess ? (
              <div className="py-6 space-y-3">
                <ShoppingBag size={34} className="text-teal-500 mx-auto animate-bounce" />
                <h4 className="text-[13px] font-extrabold text-slate-800">Verifying Purchase Details</h4>
                <p className="text-[10.5px] text-slate-400 font-medium">Securing bookstore transaction with BookVerse Pay...</p>
              </div>
            ) : (
              <div className="py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="text-[14px] font-extrabold text-slate-800">Purchase Confirmed!</h4>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">"${book.title}" is now added to your account library.</p>
                </div>
                <button
                  onClick={() => {
                    setShowPurchaseModal(false);
                    setPurchaseSuccess(false);
                    // Automatically add to library
                    if (!book.isInLibrary) {
                      onToggleLibrary(book);
                    }
                  }}
                  className="w-full py-2.5 bg-teal-600 text-white text-[11px] font-bold rounded-xl active:scale-95 transition-transform"
                >
                  Start Reading Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
