"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"

export type Status = "published" | "draft"

export interface NewsItem {
  id: string
  title: string
  titleAr: string
  excerpt: string
  category: string
  date: string
  image: string
  status: Status
}

export interface PhotoItem {
  id: string
  title: string
  album: string
  image: string
  date: string
}

export interface VideoItem {
  id: string
  title: string
  category: string
  url: string
  thumbnail: string
  date: string
  status: Status
}

export interface MassScheduleRow {
  id: string
  day: string
  times: string[]
  note: string
}

export interface SpecialMassItem {
  id: string
  title: string
  date: string
  description: string
  location: string
}

export interface ChurchItem {
  id: string
  name: string
  nameAr: string
  location: string
  type: string
  patronSaint: string
  patronSaintAr: string
  description: string
  massSchedule: string
  image: string
  featured: boolean
}

/** A single editable field on a content-only page. */
export interface ContentBlock {
  id: string
  label: string
  value: string
  multiline: boolean
}

/** Content for a single, non-collection page (Home, About, Contact, etc.). */
export interface PageContent {
  key: string
  name: string
  heroTitle: string
  heroTitleAr: string
  heroSubtitle: string
  blocks: ContentBlock[]
}

export const massLocations = ["Ehden", "Zgharta"]
export const churchTypes = ["church", "monastery", "chapel"]

export const newsCategories = [
  "Parish News",
  "Church News",
  "Events",
  "Announcements",
]

export const photoAlbums = [
  "Churches",
  "Landscapes",
  "Events",
  "Celebrations",
  "Heritage",
]

export const videoCategories = [
  "Liturgy",
  "Documentary",
  "Community",
  "Broadcast",
]

const seedNews: NewsItem[] = [
  {
    id: "n1",
    title: "Easter Celebrations Begin This Sunday",
    titleAr: "احتفالات عيد الفصح تبدأ هذا الأحد",
    excerpt:
      "Join us for the holy celebrations of Easter week with special masses and processions throughout Ehden and Zgharta.",
    category: "Parish News",
    date: "2026-04-07",
    image: "/images/mar-mama-church.jpg",
    status: "published",
  },
  {
    id: "n2",
    title: "New Youth Ministry Program Launches",
    titleAr: "إطلاق برنامج جديد لخدمة الشباب",
    excerpt:
      "The parish introduces a comprehensive program for young parishioners focusing on faith formation and leadership.",
    category: "Announcements",
    date: "2026-04-05",
    image: "/images/ehden-landscape.jpg",
    status: "published",
  },
  {
    id: "n3",
    title: "Restoration of Historic Church Completed",
    titleAr: "اكتمال ترميم الكنيسة التاريخية",
    excerpt:
      "After two years of careful restoration work, the historic church of Saint George has been fully restored.",
    category: "Church News",
    date: "2026-04-03",
    image: "/images/st-george-cathedral.jpg",
    status: "draft",
  },
]

const seedPhotos: PhotoItem[] = [
  {
    id: "p1",
    title: "Ehden Mountain Landscape",
    album: "Landscapes",
    image: "/images/ehden-landscape.jpg",
    date: "2026-03-30",
  },
  {
    id: "p2",
    title: "Mar Mama Church",
    album: "Churches",
    image: "/images/mar-mama-church.jpg",
    date: "2026-03-28",
  },
  {
    id: "p3",
    title: "Mountain Sunset",
    album: "Landscapes",
    image: "/images/mountain-sunset.jpg",
    date: "2026-03-25",
  },
  {
    id: "p4",
    title: "Our Lady of Zgharta",
    album: "Churches",
    image: "/images/our-lady-zgharta.jpg",
    date: "2026-03-20",
  },
]

const seedVideos: VideoItem[] = [
  {
    id: "v1",
    title: "Sunday Holy Mass - Live Broadcast",
    category: "Liturgy",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "/images/mar-sarkis-monastery.jpg",
    date: "2026-04-06",
    status: "published",
  },
  {
    id: "v2",
    title: "Heritage of Ehden Documentary",
    category: "Documentary",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "/images/mountain-sunset.jpg",
    date: "2026-03-15",
    status: "published",
  },
]

const seedMassSchedule: MassScheduleRow[] = [
  { id: "ms1", day: "Sunday", times: ["8:00 AM", "10:30 AM", "6:00 PM"], note: "Main parish liturgy" },
  { id: "ms2", day: "Monday - Friday", times: ["7:00 AM"], note: "Morning weekday mass" },
  { id: "ms3", day: "Saturday", times: ["7:00 AM", "6:00 PM"], note: "Evening vigil mass" },
  { id: "ms4", day: "Holy Days", times: ["9:00 AM", "6:00 PM"], note: "Feast and obligation days" },
]

const seedSpecialMasses: SpecialMassItem[] = [
  {
    id: "s1",
    title: "Easter Triduum",
    date: "April 17-20, 2026",
    description: "Holy Thursday, Good Friday, and Easter Vigil services",
    location: "All Churches",
  },
  {
    id: "s2",
    title: "Feast of Mar Mama",
    date: "August 2, 2026",
    description: "Special celebration at Mar Mama Church",
    location: "Mar Mama Church, Ehden",
  },
  {
    id: "s3",
    title: "Assumption of Mary",
    date: "August 15, 2026",
    description: "Celebration of the Assumption of the Virgin Mary",
    location: "Our Lady of Zgharta",
  },
]

const seedChurches: ChurchItem[] = [
  {
    id: "c1",
    name: "Mar Mama Church",
    nameAr: "كنيسة مار ماما",
    location: "Ehden",
    type: "church",
    patronSaint: "St. Mama",
    patronSaintAr: "القديس ماما",
    description:
      "One of the oldest churches in Ehden, dating back to 749 AD. Features Greek and Syriac inscriptions and is of great historical significance.",
    massSchedule: "Sunday: 8:00 AM, 10:30 AM | Weekdays: 7:00 AM",
    image: "/images/mar-mama-church.jpg",
    featured: true,
  },
  {
    id: "c2",
    name: "St. George Cathedral",
    nameAr: "كاتدرائية مار جرجس",
    location: "Zgharta",
    type: "church",
    patronSaint: "St. George",
    patronSaintAr: "القديس جرجس",
    description:
      "The main cathedral of Zgharta, serving as the spiritual center of the town. Features stunning religious artwork and architecture.",
    massSchedule: "Sunday: 9:00 AM, 11:00 AM | Weekdays: 6:30 AM",
    image: "/images/st-george-cathedral.jpg",
    featured: true,
  },
  {
    id: "c3",
    name: "Our Lady of Zgharta",
    nameAr: "سيدة زغرتا",
    location: "Zgharta",
    type: "church",
    patronSaint: "Virgin Mary",
    patronSaintAr: "العذراء مريم",
    description:
      "A beautiful church dedicated to the Virgin Mary, featuring traditional Maronite architecture and sacred iconography.",
    massSchedule: "Sunday: 10:00 AM | Saturday: 6:00 PM",
    image: "/images/our-lady-zgharta.jpg",
    featured: false,
  },
  {
    id: "c4",
    name: "Mar Sarkis Monastery",
    nameAr: "دير مار سركيس",
    location: "Ehden",
    type: "monastery",
    patronSaint: "St. Sergius & St. Bacchus",
    patronSaintAr: "القديس سركيس وباخوس",
    description:
      "An ancient monastery dating to the 8th century, perched on mountains above Ehden with panoramic views of the valley.",
    massSchedule: "Sunday: 8:00 AM | Daily: 6:00 AM",
    image: "/images/mar-sarkis-monastery.jpg",
    featured: true,
  },
  {
    id: "c5",
    name: "Saydet el Hosn",
    nameAr: "سيدة الحصن",
    location: "Ehden",
    type: "church",
    patronSaint: "Virgin Mary",
    patronSaintAr: "العذراء مريم",
    description:
      "A historic pilgrimage site with a modern church and iconic white Virgin Mary statue offering panoramic mountain views.",
    massSchedule: "Sunday: 9:30 AM | Weekdays: 7:30 AM",
    image: "/images/saydet-el-hosn.jpg",
    featured: false,
  },
  {
    id: "c6",
    name: "Mar Doumit Chapel",
    nameAr: "كنيسة مار ضومط",
    location: "Ehden",
    type: "chapel",
    patronSaint: "St. Doumit",
    patronSaintAr: "القديس ضومط",
    description:
      "A small historic chapel in the heart of old Ehden, representing the rich religious heritage of the region.",
    massSchedule: "Feast days only",
    image: "/images/mar-mama-church.jpg",
    featured: false,
  },
]

const block = (id: string, label: string, value: string, multiline = true): ContentBlock => ({
  id,
  label,
  value,
  multiline,
})

const seedPages: Record<string, PageContent> = {
  home: {
    key: "home",
    name: "Home",
    heroTitle: "Ehden-Zgharta Maronite Parish",
    heroTitleAr: "رعية إهدن - زغرتا المارونية",
    heroSubtitle:
      "A community of faith rooted in the mountains of North Lebanon, welcoming all to worship and fellowship.",
    blocks: [
      block("welcome", "Welcome Message", "Welcome to the Ehden-Zgharta Maronite Parish. Whether you are a lifelong parishioner or visiting for the first time, we are delighted to have you join our community of faith."),
      block("mission", "Mission Statement", "Our mission is to nurture faith, preserve our Maronite heritage, and serve the people of Ehden and Zgharta through worship, education, and charity."),
      block("cta", "Call to Action", "Join us this Sunday for the Holy Mass and become part of our parish family."),
    ],
  },
  about: {
    key: "about",
    name: "About - The Parish",
    heroTitle: "About Our Parish",
    heroTitleAr: "عن رعيتنا",
    heroSubtitle: "Discover the story, mission, and people of the Ehden-Zgharta Maronite Parish.",
    blocks: [
      block("intro", "Introduction", "The Ehden-Zgharta Maronite Parish has served the faithful of North Lebanon for generations, standing as a beacon of faith and tradition."),
      block("community", "Our Community", "Our parish unites the towns of Ehden and Zgharta, two communities bound by faith, family, and a shared Maronite identity."),
      block("values", "Our Values", "Faith, heritage, service, and fellowship guide everything we do as a parish community."),
    ],
  },
  "about-history": {
    key: "about-history",
    name: "About - History",
    heroTitle: "Our History",
    heroTitleAr: "تاريخنا",
    heroSubtitle: "Centuries of faith, heritage, and devotion in the mountains of North Lebanon.",
    blocks: [
      block("origins", "Origins", "The roots of our parish stretch back over a thousand years, with churches such as Mar Mama dating to 749 AD."),
      block("heritage", "Maronite Heritage", "Ehden and Zgharta have long been strongholds of the Maronite Church, preserving liturgy and tradition through the centuries."),
      block("modern", "The Parish Today", "Today the parish continues its mission across numerous churches, monasteries, and chapels throughout the region."),
    ],
  },
  "about-vicar": {
    key: "about-vicar",
    name: "About - The Vicar",
    heroTitle: "The Vicar",
    heroTitleAr: "النائب الرعوي",
    heroSubtitle: "Meet the shepherd guiding our parish community.",
    blocks: [
      block("name", "Name & Title", "Reverend Father [Name], Parish Vicar", false),
      block("bio", "Biography", "Father [Name] has devoted his life to the service of the Maronite Church and the faithful of Ehden and Zgharta."),
      block("message", "Pastoral Message", "I welcome you with open arms to our parish. May the Lord bless you and your families."),
    ],
  },
  "about-patriarch": {
    key: "about-patriarch",
    name: "Blessed Patriarch Douaihy",
    heroTitle: "Blessed Patriarch Estephan Douaihy",
    heroTitleAr: "الطوباوي البطريرك إسطفان الدويهي",
    heroSubtitle: "Honoring the great son of Ehden, scholar and shepherd of the Maronite Church.",
    blocks: [
      block("life", "Life", "Born in Ehden in 1630, Estephan Douaihy became Maronite Patriarch and is celebrated as one of the greatest scholars of the Church."),
      block("legacy", "Legacy", "His writings on liturgy, history, and theology remain foundational to the Maronite tradition. He was beatified by the Church."),
      block("feast", "Feast Day", "The parish honors Blessed Patriarch Douaihy with special celebrations each year.", false),
    ],
  },
  yanabi3: {
    key: "yanabi3",
    name: "Yanabi3",
    heroTitle: "Yanabi3",
    heroTitleAr: "ينابيع",
    heroSubtitle: "Springs of faith - reflections, teachings, and spiritual nourishment for our community.",
    blocks: [
      block("about", "About Yanabi3", "Yanabi3 (Springs) is our parish space for spiritual reflection, teaching, and the sharing of faith."),
      block("content", "Featured Reflection", "Drink from the springs of living water that the Lord offers to all who seek Him."),
    ],
  },
  services: {
    key: "services",
    name: "Services - Intro",
    heroTitle: "Services",
    heroTitleAr: "خدمات الرعية",
    heroSubtitle:
      "Request certificates and documents from the parish. Fill out the appropriate form and we will process your request.",
    blocks: [
      block("help", "Help Note", "Need help with a service not listed here? Contact the parish office and our team will assist you."),
    ],
  },
  "services-first-sacrifice": {
    key: "services-first-sacrifice",
    name: "First Sacrifice",
    heroTitle: "The First Sacrifice",
    heroTitleAr: "القربانة الأولى",
    heroSubtitle: "Request a certificate or registration for the First Holy Communion sacrament.",
    blocks: [
      block("desc", "Description", "Use this form to request a certificate or registration for the First Holy Communion (First Sacrifice) sacrament."),
      block("requirements", "Requirements", "Please provide the full name, date, and the church where the sacrament was received."),
    ],
  },
  "services-marriage-certificate": {
    key: "services-marriage-certificate",
    name: "Marriage Certificate",
    heroTitle: "Marriage Certificate",
    heroTitleAr: "شهادة زواج",
    heroSubtitle: "Request a marriage certificate from parish records.",
    blocks: [
      block("desc", "Description", "Use this form to request an official marriage certificate from the parish records."),
      block("requirements", "Requirements", "Please provide the names of both spouses and the date and church of the marriage."),
    ],
  },
  "services-confirmation-certificate": {
    key: "services-confirmation-certificate",
    name: "Confirmation Certificate",
    heroTitle: "Certificate of Accreditation and Confirmation",
    heroTitleAr: "شهادة تثبيت",
    heroSubtitle: "Request a certificate for the Sacrament of Confirmation.",
    blocks: [
      block("desc", "Description", "Use this form to request a certificate for the Sacrament of Confirmation."),
      block("requirements", "Requirements", "Please provide the full name, date, and church where the sacrament was received."),
    ],
  },
  "services-death-certificate": {
    key: "services-death-certificate",
    name: "Death Certificate",
    heroTitle: "Death Certificate",
    heroTitleAr: "شهادة وفاة",
    heroSubtitle: "Request a death certificate from parish records.",
    blocks: [
      block("desc", "Description", "Use this form to request a death certificate from the parish records."),
      block("requirements", "Requirements", "Please provide the full name of the deceased and the date and place of passing."),
    ],
  },
  "media-zgharta-channel": {
    key: "media-zgharta-channel",
    name: "Zgharta Channel",
    heroTitle: "Zgharta Channel",
    heroTitleAr: "قناة زغرتا",
    heroSubtitle: "Watch live broadcasts of masses, celebrations, and parish events.",
    blocks: [
      block("about", "About the Channel", "Zgharta Channel broadcasts the Holy Mass and parish events live to the community and the diaspora."),
      block("stream", "Stream URL", "https://www.youtube.com/@zghartachannel", false),
      block("schedule", "Broadcast Schedule", "Sunday Mass airs live at 10:30 AM. Special celebrations are broadcast as scheduled."),
    ],
  },
  "media-radio-ehden": {
    key: "media-radio-ehden",
    name: "Radio Ehden",
    heroTitle: "Radio Ehden",
    heroTitleAr: "إذاعة إهدن",
    heroSubtitle: "Listen to spiritual programs, hymns, and parish news.",
    blocks: [
      block("about", "About the Station", "Radio Ehden brings spiritual programs, sacred music, and parish news to listeners across the region."),
      block("stream", "Stream URL", "https://radioehden.example/stream", false),
      block("programs", "Featured Programs", "Daily prayer, Maronite hymns, and weekly reflections from the parish."),
    ],
  },
  contact: {
    key: "contact",
    name: "Contact",
    heroTitle: "Contact Us",
    heroTitleAr: "اتصل بنا",
    heroSubtitle: "Reach the parish office for any questions, requests, or assistance.",
    blocks: [
      block("address", "Address", "Ehden-Zgharta, North Governorate, Lebanon", false),
      block("phone", "Phone", "+961 6 000 000", false),
      block("email", "Email", "office@ehden-zgharta-parish.org", false),
      block("hours", "Office Hours", "Monday - Friday: 9:00 AM - 4:00 PM"),
      block("note", "Note", "For urgent pastoral needs outside office hours, please contact the parish vicar directly."),
    ],
  },
}

interface AdminStore {
  news: NewsItem[]
  photos: PhotoItem[]
  videos: VideoItem[]
  massSchedule: MassScheduleRow[]
  specialMasses: SpecialMassItem[]
  churches: ChurchItem[]
  pages: Record<string, PageContent>
  addNews: (item: Omit<NewsItem, "id">) => void
  updateNews: (id: string, item: Omit<NewsItem, "id">) => void
  deleteNews: (id: string) => void
  addPhoto: (item: Omit<PhotoItem, "id">) => void
  updatePhoto: (id: string, item: Omit<PhotoItem, "id">) => void
  deletePhoto: (id: string) => void
  addVideo: (item: Omit<VideoItem, "id">) => void
  updateVideo: (id: string, item: Omit<VideoItem, "id">) => void
  deleteVideo: (id: string) => void
  addMassRow: (item: Omit<MassScheduleRow, "id">) => void
  updateMassRow: (id: string, item: Omit<MassScheduleRow, "id">) => void
  deleteMassRow: (id: string) => void
  addSpecialMass: (item: Omit<SpecialMassItem, "id">) => void
  updateSpecialMass: (id: string, item: Omit<SpecialMassItem, "id">) => void
  deleteSpecialMass: (id: string) => void
  addChurch: (item: Omit<ChurchItem, "id">) => void
  updateChurch: (id: string, item: Omit<ChurchItem, "id">) => void
  deleteChurch: (id: string) => void
  updatePage: (key: string, item: PageContent) => void
}

const AdminDataContext = createContext<AdminStore | null>(null)

const uid = () => Math.random().toString(36).slice(2, 10)

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [news, setNews] = useState<NewsItem[]>(seedNews)
  const [photos, setPhotos] = useState<PhotoItem[]>(seedPhotos)
  const [videos, setVideos] = useState<VideoItem[]>(seedVideos)
  const [massSchedule, setMassSchedule] =
    useState<MassScheduleRow[]>(seedMassSchedule)
  const [specialMasses, setSpecialMasses] =
    useState<SpecialMassItem[]>(seedSpecialMasses)
  const [churches, setChurches] = useState<ChurchItem[]>(seedChurches)
  const [pages, setPages] = useState<Record<string, PageContent>>(seedPages)

  const addNews = useCallback(
    (item: Omit<NewsItem, "id">) =>
      setNews((prev) => [{ ...item, id: uid() }, ...prev]),
    [],
  )
  const updateNews = useCallback(
    (id: string, item: Omit<NewsItem, "id">) =>
      setNews((prev) => prev.map((n) => (n.id === id ? { ...item, id } : n))),
    [],
  )
  const deleteNews = useCallback(
    (id: string) => setNews((prev) => prev.filter((n) => n.id !== id)),
    [],
  )

  const addPhoto = useCallback(
    (item: Omit<PhotoItem, "id">) =>
      setPhotos((prev) => [{ ...item, id: uid() }, ...prev]),
    [],
  )
  const updatePhoto = useCallback(
    (id: string, item: Omit<PhotoItem, "id">) =>
      setPhotos((prev) => prev.map((p) => (p.id === id ? { ...item, id } : p))),
    [],
  )
  const deletePhoto = useCallback(
    (id: string) => setPhotos((prev) => prev.filter((p) => p.id !== id)),
    [],
  )

  const addVideo = useCallback(
    (item: Omit<VideoItem, "id">) =>
      setVideos((prev) => [{ ...item, id: uid() }, ...prev]),
    [],
  )
  const updateVideo = useCallback(
    (id: string, item: Omit<VideoItem, "id">) =>
      setVideos((prev) => prev.map((v) => (v.id === id ? { ...item, id } : v))),
    [],
  )
  const deleteVideo = useCallback(
    (id: string) => setVideos((prev) => prev.filter((v) => v.id !== id)),
    [],
  )

  const addMassRow = useCallback(
    (item: Omit<MassScheduleRow, "id">) =>
      setMassSchedule((prev) => [...prev, { ...item, id: uid() }]),
    [],
  )
  const updateMassRow = useCallback(
    (id: string, item: Omit<MassScheduleRow, "id">) =>
      setMassSchedule((prev) =>
        prev.map((m) => (m.id === id ? { ...item, id } : m)),
      ),
    [],
  )
  const deleteMassRow = useCallback(
    (id: string) => setMassSchedule((prev) => prev.filter((m) => m.id !== id)),
    [],
  )

  const addSpecialMass = useCallback(
    (item: Omit<SpecialMassItem, "id">) =>
      setSpecialMasses((prev) => [{ ...item, id: uid() }, ...prev]),
    [],
  )
  const updateSpecialMass = useCallback(
    (id: string, item: Omit<SpecialMassItem, "id">) =>
      setSpecialMasses((prev) =>
        prev.map((s) => (s.id === id ? { ...item, id } : s)),
      ),
    [],
  )
  const deleteSpecialMass = useCallback(
    (id: string) =>
      setSpecialMasses((prev) => prev.filter((s) => s.id !== id)),
    [],
  )

  const addChurch = useCallback(
    (item: Omit<ChurchItem, "id">) =>
      setChurches((prev) => [{ ...item, id: uid() }, ...prev]),
    [],
  )
  const updateChurch = useCallback(
    (id: string, item: Omit<ChurchItem, "id">) =>
      setChurches((prev) =>
        prev.map((c) => (c.id === id ? { ...item, id } : c)),
      ),
    [],
  )
  const deleteChurch = useCallback(
    (id: string) => setChurches((prev) => prev.filter((c) => c.id !== id)),
    [],
  )

  const updatePage = useCallback(
    (key: string, item: PageContent) =>
      setPages((prev) => ({ ...prev, [key]: item })),
    [],
  )

  return (
    <AdminDataContext.Provider
      value={{
        news,
        photos,
        videos,
        massSchedule,
        specialMasses,
        churches,
        pages,
        addNews,
        updateNews,
        deleteNews,
        addPhoto,
        updatePhoto,
        deletePhoto,
        addVideo,
        updateVideo,
        deleteVideo,
        addMassRow,
        updateMassRow,
        deleteMassRow,
        addSpecialMass,
        updateSpecialMass,
        deleteSpecialMass,
        addChurch,
        updateChurch,
        deleteChurch,
        updatePage,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  )
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext)
  if (!ctx) {
    throw new Error("useAdminData must be used within an AdminDataProvider")
  }
  return ctx
}
