import { Book, Category, UserProfile } from "./types";

export const INITIAL_BOOKS: Book[] = [
  {
    id: "book-1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    rating: 4.8,
    description: "The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, set in the roaring twenties. A portrait of the Jazz Age in all its decadence and excess.",
    genre: "Fiction",
    publishYear: 1925,
    pages: 180,
    progress: 35,
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400&auto=format&fit=crop",
    coverColor: "from-blue-900 to-indigo-950",
    isFavorite: true,
    isInLibrary: true,
    isTrending: true,
    isRecommended: false,
    readSampleAvailable: true,
    characters: ["Jay Gatsby", "Nick Carraway", "Daisy Buchanan"],
    aiSummary: "The quintessential novel of the Roaring Twenties, exploring the grandeur and ultimate hollowness of the American Dream. Through Nick Carraway's eyes, we witness Jay Gatsby's obsessive quest to win back his lost love, Daisy Buchanan, amid lavish parties and tragic secrets.",
    aiThemes: ["The Illusion of the American Dream", "Obsession and Lost Time", "Wealth and Class Divide"],
    aiQuotes: [
      "So we beat on, boats against the current, borne back ceaselessly into the past.",
      "Whenever you feel like criticizing any one, just remember that all the people in this world haven't had the advantages that you've had."
    ],
    aiReview: "Fitzgerald's masterpiece remains one of the most poignant dissections of love, nostalgia, and class in American literature. Every single sentence is polished to a dazzling brilliance."
  },
  {
    id: "book-2",
    title: "Sherlock Holmes: A Study in Scarlet",
    author: "Arthur Conan Doyle",
    rating: 4.9,
    description: "The legendary first adventure of Sherlock Holmes and Dr. John Watson, introducing the world's greatest consulting detective as they solve a complex murder in Victorian London.",
    genre: "Mystery",
    publishYear: 1887,
    pages: 120,
    progress: 80,
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop",
    coverColor: "from-rose-950 to-stone-900",
    isFavorite: false,
    isInLibrary: true,
    isTrending: false,
    isRecommended: true,
    readSampleAvailable: true,
    characters: ["Sherlock Holmes", "Dr. John Watson", "Inspector Lestrade"],
    aiSummary: "The historic novel that introduced the consulting detective Sherlock Holmes and his roommate-partner Dr. John Watson. When a corpse is found in an abandoned house with the word 'RACHE' scrawled in blood, Holmes uses his science of deduction to unveil a long-harbored tale of Mormon vengeance.",
    aiThemes: ["The Science of Deduction", "Justice vs. Personal Vengeance", "The Power of Observation"],
    aiQuotes: [
      "There is nothing more deceptive than an obvious fact.",
      "Where there is no imagination there is no horror."
    ],
    aiReview: "Doyle created an immortal figure. 'A Study in Scarlet' is a gripping read that launches the finest detective duo in Western literature, setting the foundational standard for crime fiction."
  },
  {
    id: "book-3",
    title: "Atomic Habits",
    author: "James Clear",
    rating: 4.7,
    description: "An incredibly practical guide on how to transform your life by making tiny 1% daily changes. James Clear reveals how real change comes from the compound effect of hundreds of small decisions.",
    genre: "Self-Help",
    publishYear: 2018,
    pages: 320,
    progress: 0,
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop",
    coverColor: "from-emerald-900 to-teal-950",
    isFavorite: true,
    isInLibrary: false,
    isTrending: true,
    isRecommended: true,
    readSampleAvailable: true,
    characters: ["James Clear"],
    aiSummary: "The definitive guide to behavioral change based on cognitive science. James Clear illustrates that massive transformation is not achieved through massive leaps, but through the cumulative effect of small (1% daily) shifts in system structures and identities.",
    aiThemes: ["Systems Over Goals", "Identity-Based Habits", "The Compound Effect of Habits"],
    aiQuotes: [
      "You do not rise to the level of your goals. You fall to the level of your systems.",
      "Every action you take is a vote for the type of person you wish to become."
    ],
    aiReview: "This is hands-down the most actionable self-improvement book of the decade. Clear translates complex psychological principles into foolproof strategies for immediate execution."
  },
  {
    id: "book-4",
    title: "Dune",
    author: "Frank Herbert",
    rating: 4.9,
    description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, who would become the mysterious man known as Muad'Dib. A masterful blend of adventure, environmentalism, and politics.",
    genre: "Sci-Fi",
    publishYear: 1965,
    pages: 600,
    progress: 0,
    coverUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=400&auto=format&fit=crop",
    coverColor: "from-amber-950 to-orange-950",
    isFavorite: false,
    isInLibrary: false,
    isTrending: true,
    isRecommended: false,
    readSampleAvailable: true,
    characters: ["Paul Atreides", "Duke Leto Atreides", "Baron Harkonnen"],
    aiSummary: "Frank Herbert's standard-setting epic of science fiction. On the dry desert world Arrakis—the only source of the powerful spice melange—young Paul Atreides is thrust into a deadly game of imperial politics, religious prophecy, and environmental survival.",
    aiThemes: ["Ecological Interdependence", "The Danger of Messianism", "Feudal Politics and Monopoly Control"],
    aiQuotes: [
      "I must not fear. Fear is the mind-killer.",
      "The mystery of life isn't a problem to solve, but a reality to experience."
    ],
    aiReview: "Dune is to science fiction what Lord of the Rings is to fantasy. Herbert's worldbuilding is so rich and deep that the sands of Arrakis feel entirely real, hot, and ancient."
  },
  {
    id: "book-5",
    title: "Sapiens: A Brief History",
    author: "Yuval Noah Harari",
    rating: 4.8,
    description: "Harari spans the whole of human history, from the first humans to walk the earth to the radical breakthroughs of the Cognitive, Agricultural, and Scientific Revolutions.",
    genre: "History",
    publishYear: 2011,
    pages: 443,
    progress: 15,
    coverUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=400&auto=format&fit=crop",
    coverColor: "from-amber-900 to-yellow-950",
    isFavorite: false,
    isInLibrary: true,
    isTrending: false,
    isRecommended: true,
    readSampleAvailable: true,
    characters: ["Yuval Noah Harari"],
    aiSummary: "An ambitious examination of humanity's history, spanning from insignificant African apes to the rulers of planet Earth. Harari shows how shared imaginary myths—including money, corporations, and human rights—allowed thousands of strangers to collaborate effectively.",
    aiThemes: ["The Cognitive Revolution and Shared Myths", "The Unification of Humankind", "The Price of Agricultural Progress"],
    aiQuotes: [
      "Money is the most universal and most efficient system of mutual trust ever created.",
      "We did not domesticate wheat. Wheat domesticated us."
    ],
    aiReview: "Harari sweeps through millennia with mind-expanding clarity. This book fundamentally alters how you view human society, state religions, global currencies, and our future trajectories."
  },
  {
    id: "book-6",
    title: "The Alchemist",
    author: "Paulo Coelho",
    rating: 4.6,
    description: "A magical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure, finding riches far more satisfying than he ever imagined.",
    genre: "Fiction",
    publishYear: 1988,
    pages: 163,
    progress: 0,
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop",
    coverColor: "from-amber-700 to-amber-900",
    isFavorite: false,
    isInLibrary: false,
    isTrending: false,
    isRecommended: true,
    readSampleAvailable: true,
    characters: ["Santiago", "The Alchemist", "Melchizedek"],
    aiSummary: "A beautiful allegory centering Santiago, an Andalusian shepherd boy who travels from Spain to Egypt in pursuit of a dream. Guided by curious characters, he learns to listen to his heart and read the spiritual language of the universe.",
    aiThemes: ["Finding Your Personal Legend", "The Language of the World", "The Fear of Failure"],
    aiQuotes: [
      "When you want something, all the universe conspires in helping you to achieve it.",
      "The secret of life, though, is to fall seven times and to get up eight times."
    ],
    aiReview: "Coelho delivers a beautifully uplifting fable. It serves as an elegant moral compass, reminding us that the truest treasure is defined not by gold, but by the personal journey of self-actualization."
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Fiction", iconName: "BookOpen", gradientClass: "bg-gradient-to-tr from-sky-400 to-blue-600", bookCount: 145 },
  { id: "cat-2", name: "Mystery", iconName: "Search", gradientClass: "bg-gradient-to-tr from-purple-400 to-indigo-600", bookCount: 89 },
  { id: "cat-3", name: "Self-Help", iconName: "Compass", gradientClass: "bg-gradient-to-tr from-emerald-400 to-teal-600", bookCount: 120 },
  { id: "cat-4", name: "Sci-Fi", iconName: "Sparkles", gradientClass: "bg-gradient-to-tr from-amber-400 to-orange-600", bookCount: 74 },
  { id: "cat-5", name: "History", iconName: "Clock", gradientClass: "bg-gradient-to-tr from-rose-400 to-red-600", bookCount: 52 },
  { id: "cat-6", name: "Biography", iconName: "User", gradientClass: "bg-gradient-to-tr from-fuchsia-400 to-pink-600", bookCount: 41 }
];

export const DEFAULT_USER: UserProfile = {
  name: "Liam Bookman",
  email: "mrliambook@gmail.com",
  avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop",
  membership: "Elite Reader",
  joinedDate: "October 2025",
  stats: {
    minutesReadToday: 42,
    minutesReadThisWeek: 280,
    booksFinished: 12,
    dailyStreak: 8,
    pagesReadTotal: 3410
  }
};

// Book mock samples content for reading simulated screen
export const BOOK_SAMPLE_CONTENT: { [bookId: string]: string[] } = {
  "book-1": [
    "Chapter 1: In my younger and more vulnerable years my father gave me some advice that I’ve been turning over in my mind ever since.",
    "“Whenever you feel like criticizing any one,” he told me, “just remember that all the people in this world haven’t had the advantages that you’ve had.”",
    "He didn’t say any more, but we’ve always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that.",
    "In consequence, I’m inclined to reserve all judgments, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores."
  ],
  "book-2": [
    "Chapter 1: In the year 1878 I took my degree of Doctor of Medicine of the University of London, and proceeded to Netley to go through the course prescribed for surgeons in the Army.",
    "Having completed my studies there, I was duly attached to the Fifth Northumberland Fusiliers as Assistant Surgeon.",
    "The regiment was stationed in India at the time, and before I could join it, the second Afghan war had broken out.",
    "On landing at Bombay, I found that my corps had already advanced through the passes, and was deep in the enemy's country."
  ],
  "book-3": [
    "Chapter 1: The Surprising Power of Atomic Habits. In 2018, James Clear introduced a groundbreaking concept of habit formation.",
    "An atomic habit is a regular practice or routine that is not only small and easy to do, but also the source of incredible power.",
    "A component of the system of compound growth. Bad habits repeat themselves again and again not because you don't want to change, but because you have the wrong system for change.",
    "You do not rise to the level of your goals. You fall to the level of your systems."
  ],
  "book-4": [
    "Chapter 1: A beginning is the time for taking the most delicate care that the balances are correct.",
    "This every sister of the Bene Gesserit knows. To begin your study of the life of Muad'Dib, then, take care that you first place him in his time...",
    "He was born in the 57th year of the Padishah Emperor, Shaddam IV. And place him most particularly on Arrakis, where the spice is.",
    "The planet of the desert, the dunes. This Arrakis had become the center of the galaxy’s survival."
  ],
  "book-5": [
    "Chapter 1: An Animal of No Significance.",
    "About 13.5 billion years ago, matter, energy, time and space came into being in what is known as the Big Bang.",
    "The story of these fundamental features of our universe is called physics. About 300,000 years after their appearance, matter and energy started to coalesce into complex structures, called atoms.",
    "The story of these atoms, molecules and their interactions is called chemistry. About 3.8 billion years ago, certain molecules combined to form particularly large and intricate structures called organisms."
  ],
  "book-6": [
    "Prologue: The Alchemist picked up a book that someone in the caravan had brought.",
    "The volume was without a cover, but he could identify its author as Oscar Wilde.",
    "As he leafed through the pages, he found a story about Narcissus.",
    "The Alchemist knew the legend of Narcissus, a youth who knelt daily beside a lake to contemplate his own beauty. He was so fascinated by himself that, one morning, he fell into the lake and drowned."
  ]
};
export const DEFAULT_SAMPLE_CONTENT = [
  "No reading sample is available for this selection.",
  "You can purchase the book or choose another item to start reading today.",
  "Check back soon as we continuously add immersive summaries and interactive digital resources."
];
