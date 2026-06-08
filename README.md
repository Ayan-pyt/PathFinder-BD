"# PathFinder BD - Study Abroad Platform" 
# PathFinder BD 🎓

> **Your all-in-one study abroad hub for Bangladeshi students.**
> Research countries, match universities, manage documents, track deadlines, and prepare for IELTS — all from one centralized dashboard. No agency. No middleman. No hidden fees.

---

## 📖 What is PathFinder BD?

PathFinder BD is a **B2C information and profile management platform** built specifically for Bangladeshi students who want to study abroad but are tired of paying student agencies BDT 1–3 Lakhs for information they could access themselves.

The platform covers the complete study abroad journey:

- 🔍 **Research** — Compare countries, understand visa rules, calculate real living costs in BDT
- 🎓 **University Selection** — Filter 33+ verified universities by CGPA, IELTS score, field of study, and budget
- 📝 **Document Preparation** — AI-powered SOP generator, document checklists, LOR templates, gap letter builder
- 🛂 **Visa Guidance** — Country-specific visa checklists with exact BDT amounts, embassy contacts, bank balance requirements
- 📅 **Deadline Tracking** — Intake calendar, scholarship deadline countdowns, personalized to-do list per journey stage
- 🤖 **AI Tools** — Country recommendation quiz, SOP visa criteria checker, visa Q&A chatbot
- 📚 **IELTS Preparation** — Score predictor, curated free resources, verified coaching centres in Dhaka & Chattogram with map
- 💬 **Community Q&A** — Ask questions, share timelines, read success stories from BD students who made it

---

## 🗺️ V1 Countries Covered

| Country | Universities | Visa Guide | Cost Data |
|---------|-------------|------------|-----------|
| 🇦🇺 Australia | ✅ | ✅ | ✅ |
| 🇳🇿 New Zealand | ✅ | ✅ | ✅ |
| 🇮🇪 Ireland | ✅ | ✅ | ✅ |
| 🇫🇮 Finland | ✅ | ✅ | ✅ |

> All data is manually verified from official government immigration portals. Each data point carries a `Last Verified` date and a source URL.

---

## ✨ Feature Overview

### 🏠 Landing Page (Public — No Login Required)
- Live cost calculator with real-time BDT conversion via ExchangeRate API
- Latest news and updates posted by admin
- BD student success stories pulled from community posts
- Platform overview and feature showcase

### 📊 Dashboard (Authenticated Users)
- Interactive journey pipeline tracker — 5 stages (Researching → Shortlisting → Preparing Docs → Visa Stage → Accepted)
- Click any stage to move your tracker, saved to your profile
- Personalized to-do list that updates based on your current stage
- Intake calendar showing upcoming deadlines for shortlisted universities
- Scholarship deadline countdown timers
- Shortlisted countries quick access
- Admin-only News & Updates posting widget

### 🌐 Country Explorer
- 4 verified destinations with factor scores (PR ease, education quality, living cost, language barrier, etc.)
- Side-by-side comparison matrix across 10 factors
- Pros & cons specifically for Bangladeshi applicants
- BDT cost toggle for tuition and living estimates
- Data transparency badge with last-verified date and official source link

### 🎓 University Matcher
- 50+ universities across AU, NZ, IE, FI
- Filter by country, field of study, CGPA, IELTS score, scholarship availability
- BDT cost conversion toggle
- Bookmark universities to your shortlist
- Each card links to the official university application portal (no internal submit)
- Full detail modal with programs, deadlines, scholarships, and "How to Apply" button

### 🤖 AI Features (Powered by Groq — llama-3.3-70b-versatile)
- **AI Country Quiz** — 3-step quiz, returns top 3 country matches with reasoning and match scores
- **SOP Generator** — Fills a form, AI drafts a full personalised Statement of Purpose
- **SOP Visa Checker** — Pastes existing SOP, AI checks it against visa requirements
- **Visa Q&A Chatbot** — Answers BD-specific visa questions with accurate numbers (bank balances, work hours, IELTS scores)

### 📋 Document Management
- Dynamic document checklist per stage
- LOR (Letter of Recommendation) template generator
- Gap explanation letter template
- File upload and storage via Cloudinary
- Progress tracker with completion percentage

### 🏦 Scholarship Database
- 8+ verified scholarships for BD students (Commonwealth, DAAD, Erasmus, MEXT, AAS, Chevening, Fulbright, Finnish Government)
- Real deadlines, eligibility criteria, and official application links

### 🗺️ IELTS & TOEFL Centres
- Verified centres in Dhaka and Chattogram
- Interactive Leaflet map with user location detection
- "Get Directions" button opens Google Maps with current location to selected centre
- Real addresses, phone numbers, fees, and registration links

### 📚 IELTS Prep Hub
- Curated free resources organised by skill (Reading, Writing, Listening, Speaking)
- Links to British Council free practice tests and IELTS.org official materials
- AI band score predictor — input mock scores, get predicted band and improvement advice

### 💬 Community Hub
- Post questions, share timelines, write success stories
- Category filter (Question, Timeline, Scholarship, Tips, Visa)
- Upvote posts, add comments
- BD student success stories from community posts appear on the landing page

### 🗒️ Personal Workspace
- Rich text notepad with auto-save every 5 seconds
- Formatting toolbar (bold, italic, bullet list, numbered list, headings, checkboxes)
- Task manager with due dates, sorted by upcoming deadlines
- 4 built-in templates (University Research, SOP Brainstorming, Weekly Study Plan, Visa Doc Checklist)
- Export notes as PDF or TXT
- Offline support — saves to localStorage, syncs when back online
- Save status indicator (Editing → Saving → All changes saved)

### 💰 Cost Calculator
- Available publicly on landing page — no account needed
- Select country + city + lifestyle level (Budget / Moderate / Comfortable)
- Monthly BDT breakdown: rent, food, transport, health insurance, tuition estimate
- Live exchange rates via ExchangeRate API with fallback rates
- Annual total in BDT Lakhs

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI framework |
| TypeScript | 6 | Type safety |
| Vite | 8 | Build tool |
| Tailwind CSS | 4 | Styling |
| Framer Motion | 12 | Animations |
| React Query | 5 | Server state management |
| Zustand | 5 | Client state management |
| React Router | 7 | Routing |
| React Hook Form + Zod | latest | Form handling and validation |
| Leaflet + React Leaflet | 1.9 / 5 | Interactive maps |
| Lucide React | latest | Icons |
| date-fns | 4 | Date formatting |
| Axios | 1 | HTTP client |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | Runtime |
| Express | 4 | Web framework |
| MongoDB + Mongoose | 8 | Database and ODM |
| JWT + bcryptjs | latest | Authentication |
| Multer | 2 | File upload handling |
| Cloudinary | 2 | File storage |
| dotenv | 16 | Environment config |
| nodemon | 3 | Development server |

### AI & APIs
| Service | Usage |
|---------|-------|
| Groq API (llama-3.3-70b-versatile) | SOP generator, SOP checker, country quiz, chatbot |
| ExchangeRate API (free tier) | Live BDT conversion in cost calculator |
| OpenStreetMap + Leaflet | Maps for IELTS centre finder |

### Deployment
| Service | Purpose |
|---------|---------|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| MongoDB Atlas | Cloud database |
| Cloudinary | Document/file storage |

---

## 📁 Project Structure



pathfinder-bd/
├── backend/
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   └── cloudinary.js            # Cloudinary config
│   ├── controllers/                 # Route handlers
│   │   ├── authController.js
│   │   ├── universityController.js
│   │   ├── countryController.js
│   │   ├── communityController.js
│   │   ├── newsController.js
│   │   ├── sopController.js
│   │   ├── chatbotController.js
│   │   ├── aiRecommendController.js
│   │   ├── visaController.js
│   │   ├── documentController.js
│   │   ├── dashboardController.js
│   │   ├── ieltsController.js
│   │   └── preferenceController.js
│   ├── middleware/
│   │   ├── authMiddleware.js         # JWT protect + adminOnly
│   │   ├── errorHandler.js
│   │   └── uploadMiddleware.js       # Multer config
│   ├── models/                       # Mongoose schemas
│   │   ├── User.js
│   │   ├── UserPreference.js
│   │   ├── Country.js
│   │   ├── University.js
│   │   ├── Document.js
│   │   ├── CommunityPost.js
│   │   ├── NewsPost.js
│   │   ├── VisaRequirement.js
│   │   └── SOPTemplate.js
│   ├── routes/                       # Express routers
│   ├── seeders/
│   │   ├── seedCountries.js          # 4 verified countries
│   │   └── seedUniversities.js       # 33+ verified universities
│   ├── services/
│   │   └── aiService.js              # Groq API wrapper
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── scoringEngine.js
│   │   └── validators.js
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   │   └── student-illustration.png
│   │   ├── components/
│   │   │   ├── Common/              # Button, Card, Modal, ChatbotWidget
│   │   │   └── Layout/              # Navbar, Footer
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx
│   │   │   ├── Dashboard/
│   │   │   ├── auth/                # Login, Register
│   │   │   ├── countries/           # Explorer, Detail, Compare
│   │   │   ├── UniversitySelection/
│   │   │   ├── profile/             # Setup wizard, View
│   │   │   ├── scholarships/
│   │   │   ├── ielts/               # Centres (map), Prep Hub
│   │   │   ├── visa/
│   │   │   ├── community/
│   │   │   ├── journey/             # Offer Letters, Application History
│   │   │   ├── tools/               # Cost Calculator
│   │   │   ├── workspace/           # Personal Workspace
│   │   │   ├── ai/                  # AI Country Quiz
│   │   │   ├── admin/               # News management
│   │   │   └── DocumentPreparation/
│   │   ├── services/api/             # Axios API clients
│   │   ├── store/                    # Zustand stores
│   │   └── types/                    # TypeScript interfaces
│   └── index.html
│
└── DATA/                             # Verified research datasets (Excel)
├── Country_Dataset_2026.xlsx
└── UNI_Data_Populated_V1.xlsx



---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Groq API key (free at console.groq.com)
- Cloudinary account (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/pathfinder-bd.git
cd pathfinder-bd
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
NODE_ENV=development
JWT_SECRET=your_strong_jwt_secret_here
JWT_EXPIRES_IN=30d
GROQ_API_KEY=your_groq_api_key
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Seed the database

```bash
# Seed countries (AU, NZ, IE, FI)
npm run seed

# Seed universities (33+ across all 4 countries)
npm run seedUni
```

### 4. Set yourself as admin

Run this in your MongoDB Atlas query editor or Compass:
```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

### 5. Frontend setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

### 6. Run the application

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🌐 Deployment

### Backend → Render

1. Push your code to GitHub (make sure `.env` is in `.gitignore`)
2. Create a new Web Service on Render, connect your repo
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add all environment variables from your `.env` file
6. Set `CLIENT_URL` to your Vercel frontend URL

### Frontend → Vercel

1. Import your GitHub repo into Vercel
2. Set framework preset to **Vite**
3. Add environment variable: `VITE_API_URL` = your Render backend URL
4. Deploy

---

## 📊 Data Sources

All country, university, visa, and scholarship data is manually verified from official sources:

| Data Type | Source |
|-----------|--------|
| Australia immigration | immi.homeaffairs.gov.au |
| New Zealand immigration | immigration.govt.nz |
| Ireland immigration | irishimmigration.ie |
| Finland immigration | migri.fi |
| University data | Official university admissions pages |
| Scholarship data | Official scholarship programme websites |
| IELTS centres | britishcouncil.org.bd, idp.com/bangladesh |
| Exchange rates | api.exchangerate-api.com (live) |

> **Disclaimer:** Information on this platform is sourced from official government and university portals and updated periodically. Always verify directly with the respective institution before making decisions. PathFinder BD is an information resource, not an accredited education agent.

---

## 🔒 Environment Variables Reference

### Backend

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | Yes | Server port (default 5000) |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Strong random string for JWT signing |
| `JWT_EXPIRES_IN` | Yes | Token expiry e.g. `30d` |
| `GROQ_API_KEY` | Yes | From console.groq.com |
| `CLIENT_URL` | Yes | Frontend URL for CORS (no trailing space) |
| `CLOUDINARY_CLOUD_NAME` | Yes | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | Yes | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | Yes | From Cloudinary dashboard |
| `NODE_ENV` | Yes | `development` or `production` |

### Frontend

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Backend API base URL |

---

## 🤝 Contributing

This project was built as a solo project to help Bangladeshi students navigate the study abroad process independently. Contributions, issues, and suggestions are welcome.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Ayan Sarkar**
- GitHub: [@Ayan-pyt] (https://github.com/Ayan-pyt)
- Built with the goal of making study abroad accessible to every Bangladeshi student — not just those who can afford an agency.

---

## 🙏 Acknowledgements

- [Groq](https://groq.com) for blazing fast LLM inference
- [ExchangeRate API](https://www.exchangerate-api.com) for free currency conversion
- [OpenStreetMap](https://www.openstreetmap.org) & [Leaflet](https://leafletjs.com) for free mapping
- [British Council Bangladesh](https://www.britishcouncil.org.bd) & [IDP Bangladesh](https://www.idp.com/bangladesh) for IELTS centre data
- All official government immigration portals for verified visa data

---

<p align="center">Made with ❤️ for Bangladeshi students dreaming of studying abroad</p>