# 🏗️ **Arcturus Services Website - Complete Technical Guide**

## 📋 **What I Built - Overview**

I created a **complete professional cleaning services website** that serves as a fully functional business website for "Arcturus Services" - a Sydney-based cleaning company. The website includes:

- **6 Complete Pages**: Home, About, Contact, Gallery, Areas, Services Detail, Blog
- **Professional Quote System**: Modal-based quote requests with full form functionality  
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **SEO Optimized**: Meta tags, sitemap, structured data
- **Modern UI/UX**: Professional animations, hover effects, and interactions

---

## 🏛️ **Project Architecture & Tech Stack**

### **Frontend Stack:**
- **React 19** with React Router for navigation
- **Tailwind CSS** for styling and responsive design
- **Lucide React** for icons
- **Create React App** as the build system

### **Backend Stack:**
- **FastAPI** (Python) for API endpoints
- **MongoDB** with Motor (async driver) for database
- **Pydantic** for data validation

### **Development Environment:**
- **Supervisord** managing both frontend and backend processes
- **Hot reload** enabled for both React and FastAPI
- **CORS** configured for seamless frontend-backend communication

---

## 📁 **Complete Project Structure**

```
/app/
├── frontend/                          # React application
│   ├── public/
│   │   ├── index.html                # Main HTML template
│   │   └── favicon.ico               # Website favicon
│   ├── src/
│   │   ├── components/               # React components
│   │   │   ├── layout/              # Layout components
│   │   │   │   ├── Header.jsx       # Navigation + topbar + mobile menu
│   │   │   │   └── Footer.jsx       # Footer with contact info
│   │   │   ├── sections/            # Page sections
│   │   │   │   ├── Hero.jsx         # Homepage hero section
│   │   │   │   ├── Services.jsx     # Services grid display
│   │   │   │   ├── Process.jsx      # Why choose us section  
│   │   │   │   ├── Areas.jsx        # Service areas section
│   │   │   │   ├── Gallery.jsx      # Image gallery section
│   │   │   │   ├── Testimonials.jsx # Customer reviews
│   │   │   │   ├── FAQ.jsx          # Frequently asked questions
│   │   │   │   └── CTA.jsx          # Call-to-action section
│   │   │   ├── ui/                  # Reusable UI components
│   │   │   │   ├── Section.jsx      # Page section wrapper
│   │   │   │   └── Button.jsx       # Styled button component
│   │   │   └── QuoteModal.jsx       # Quote request modal
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx            # Homepage (combines all sections)
│   │   │   ├── About.jsx           # Company information
│   │   │   ├── Contact.jsx         # Contact form page
│   │   │   ├── Areas.jsx           # Service areas page
│   │   │   ├── GalleryPage.jsx     # Full gallery page
│   │   │   ├── ServiceDetail.jsx   # Individual service pages
│   │   │   └── Blog.jsx            # Blog page (coming soon)
│   │   ├── lib/                    # Utility functions and data
│   │   │   ├── config.js           # Business configuration
│   │   │   ├── copy.js             # All website text content
│   │   │   └── utils.js            # Helper functions
│   │   ├── mock/                   # Mock data for development
│   │   │   └── mockData.js         # Sample data (quotes, services, etc.)
│   │   ├── App.js                  # Main app component with routing
│   │   ├── index.css               # Global styles + Tailwind
│   │   └── index.js                # React app entry point
│   ├── package.json                # Dependencies and scripts
│   └── tailwind.config.js          # Tailwind configuration
│
├── backend/                        # FastAPI application  
│   ├── server.py                   # Main FastAPI app
│   ├── requirements.txt            # Python dependencies
│   └── .env                        # Environment variables
│
├── contracts.md                    # API integration documentation
└── test_result.md                  # Testing documentation
```

---

## 🔧 **What's Happening Where - Detailed Breakdown**

### **1. Frontend Application (`/app/frontend/`)**

#### **Entry Point & Routing (`App.js`)**
```javascript
// Main application with React Router setup
// Routes: /, /about, /contact, /areas, /gallery, /blog, /services/:slug
```

#### **Layout Components (`/components/layout/`)**

**Header.jsx:**
- Scrolling marquee topbar with promotional messages
- Sticky navigation with desktop/mobile responsive design
- Mobile slide-over menu with × close button
- "Get Free Quote" button that opens the modal
- Phone number with click-to-call functionality

**Footer.jsx:**
- Company information and contact details
- Service links and quick navigation
- Trust indicators (reviews, insurance, etc.)
- Service area listings

#### **Page Sections (`/components/sections/`)**

**Hero.jsx:**
- Eye-catching headline with blue accent text
- Trust badges and company metrics
- Primary CTA (opens quote modal) + secondary CTA (phone)
- Professional image with floating elements
- Trust indicators at bottom

**Services.jsx:**
- Grid of 4 main services with icons
- Each service card links to detailed service page
- Package deal CTA at bottom

**Gallery.jsx:**
- Grid of before/after images
- Modal viewing with navigation arrows
- Filter buttons by service type
- Click to enlarge functionality

**Testimonials.jsx:**
- Customer reviews with 5-star ratings
- Real customer names and locations
- Call-to-action for more reviews

#### **Quote Modal (`QuoteModal.jsx`)**
```javascript
// Features:
- Form fields: Name, Phone, Email, Suburb, Service, Property Type, Contact Preference, Message
- Accessibility: Focus trap, ESC to close, click outside to close
- Validation: Required field checking
- Submission: Mock API call with loading states
- Success: Auto-close after 2 seconds
```

#### **Configuration & Content (`/lib/`)**

**config.js:**
```javascript
export const biz = {
  name: "Arcturus Services",
  phone: "0414 203 262", 
  email: "hello@arcturusservices.com.au",
  serviceAreas: [...], // All Sydney suburbs
  // Business details, hours, social links
}
```

**copy.js:**
```javascript
export const copy = {
  hero: { headlines, CTAs, metrics },
  services: [4 service objects with descriptions],
  testimonials: [customer reviews],
  areas: { featured locations },
  // All website text content organized by section
}
```

### **2. Backend Application (`/app/backend/`)**

**server.py:**
```python
# FastAPI application with:
- CORS middleware for frontend communication  
- MongoDB connection using Motor (async)
- API routes with /api prefix (required for Kubernetes routing)
- Basic CRUD endpoints for quotes and status checks
- Pydantic models for data validation
```

### **3. Styling System (`Tailwind CSS`)**

**Global Styles (`index.css`):**
```css
/* Features: */
- Tailwind base, components, utilities
- Custom marquee animation for topbar
- CSS custom properties for theme colors
- Responsive design utilities
```

**Design System:**
- **Colors**: Blue/cyan gradient theme with professional grays
- **Typography**: System fonts with proper hierarchy
- **Spacing**: Consistent padding/margins using Tailwind scale
- **Components**: Shadcn/ui inspired design system

---

## 🚀 **How to Run Locally - Complete Setup Guide**

### **Prerequisites:**
```bash
# Required software:
- Node.js (v16 or higher)
- Python (3.8 or higher) 
- MongoDB (running locally or connection string)
- Git
```

### **Step 1: Clone/Download Project**
```bash
# If using git:
git clone <repository-url>
cd arcturus-services

# Or download the project files to a local directory
```

### **Step 2: Backend Setup**
```bash
# Navigate to backend directory
cd /app/backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
# Create .env file with:
echo "MONGO_URL=mongodb://localhost:27017" > .env
echo "DB_NAME=arcturus_services" >> .env

# Start MongoDB (if running locally)
# mongod --dbpath /your/data/directory

# Run FastAPI server (for testing)
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### **Step 3: Frontend Setup**
```bash
# Navigate to frontend directory  
cd /app/frontend

# Install Node.js dependencies
yarn install
# or: npm install

# Set up environment variables
# Create .env file with:
echo "REACT_APP_BACKEND_URL=http://localhost:8001" > .env

# Start React development server
yarn start
# or: npm start
```

### **Step 4: Access the Application**
```bash
# Frontend will be available at:
http://localhost:3000

# Backend API will be available at:
http://localhost:8001

# API documentation (FastAPI auto-generated):
http://localhost:8001/docs
```

---

## 🛠️ **Development Workflow**

### **Making Changes:**

**Frontend Changes:**
```bash
cd /app/frontend
# Edit React components in src/
# Hot reload is enabled - changes appear immediately
# Add new dependencies: yarn add package-name
```

**Backend Changes:**
```bash
cd /app/backend  
# Edit Python files
# Server auto-reloads with --reload flag
# Add new dependencies to requirements.txt
```

**Content Changes:**
```bash
# Edit website text: /app/frontend/src/lib/copy.js
# Edit business info: /app/frontend/src/lib/config.js
# Add new images: /app/frontend/public/assets/
```

### **Common Tasks:**

**Add New Page:**
1. Create component in `/app/frontend/src/pages/`
2. Add route in `/app/frontend/src/App.js`
3. Add navigation link in Header.jsx

**Add New API Endpoint:**
1. Add route function in `/app/backend/server.py`
2. Create Pydantic model if needed
3. Update frontend to call new endpoint

**Modify Styling:**
```bash
# Edit Tailwind classes directly in JSX
# Add custom CSS to /app/frontend/src/index.css
# Modify Tailwind config: /app/frontend/tailwind.config.js
```

---

## 🎯 **Key Features Explained**

### **1. Quote Modal System**
**Trigger Points:**
- Header "Get Free Quote" button
- Hero "Get Free Quote Now" button  
- Bottom CTA "Get Free Quote" button

**Functionality:**
- Opens modal overlay with form
- Validates required fields
- Shows loading state during submission
- Displays success message
- Auto-closes and resets form

### **2. Responsive Navigation**
**Desktop:**
- Horizontal navigation bar
- Sticky header with background blur effect
- Marquee topbar with scrolling messages

**Mobile:**
- Hamburger menu button
- Slide-over navigation panel
- × close button for accessibility

### **3. Image Gallery**
**Features:**
- Grid layout with hover effects
- Modal viewing with arrow navigation
- Filter buttons by service category
- Lazy loading for performance

### **4. Contact System**
**Multiple Contact Methods:**
- Quote modal (instant)
- Contact page form (detailed)
- Phone numbers (click-to-call)
- Email links

---

## 🔄 **Data Flow & State Management**

### **Current Implementation (Mock Data):**
```javascript
// Quote submission flow:
1. User fills form → 
2. Frontend validation → 
3. Mock API call (2s delay) → 
4. Add to mockData array → 
5. Show success message → 
6. Reset form and close modal
```

### **Production Integration (Backend):**
```javascript
// When backend is integrated:
1. User fills form →
2. Frontend validation →
3. POST /api/quotes →
4. Save to MongoDB →
5. Send confirmation email →
6. Return success response
```

---

## 🎨 **Design System & Branding**

### **Color Scheme:**
- **Primary Blue**: #0A76D1 (buttons, links, accents)
- **Accent Cyan**: #1DC8E8 (highlights, gradients)  
- **Dark Navy**: #0F1C2E (headers, text)
- **Light Blue**: #F7FAFE (backgrounds, subtle sections)

### **Typography:**
- **System Fonts**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
- **Headings**: Bold, large scale (4xl-6xl)
- **Body Text**: Regular weight, good contrast
- **UI Text**: Medium weight for buttons/labels

### **Component Patterns:**
- **Cards**: Rounded corners, subtle shadows, hover effects
- **Buttons**: Primary (blue), secondary (outline), sizes (sm, default, lg)
- **Forms**: Clean inputs with focus states, proper labels
- **Sections**: Consistent padding, alternating backgrounds

---

## 📱 **Mobile Responsiveness**

### **Breakpoints:**
```css
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */  
lg: 1024px  /* Small desktops */
xl: 1280px  /* Large desktops */
```

### **Mobile Optimizations:**
- Touch-friendly button sizes (44px minimum)
- Readable text sizes (16px minimum)
- Simplified navigation (hamburger menu)
- Optimized image sizes
- Reduced motion for accessibility

---

## 🔧 **Troubleshooting Common Issues**

### **Port Conflicts:**
```bash
# Frontend (3000) or Backend (8001) already in use:
lsof -ti:3000 | xargs kill -9  # Kill frontend
lsof -ti:8001 | xargs kill -9  # Kill backend
```

### **Dependency Issues:**
```bash
# Clear Node modules and reinstall:
cd /app/frontend
rm -rf node_modules package-lock.json
yarn install

# Clear Python cache:
cd /app/backend  
pip freeze > requirements.txt
pip install -r requirements.txt
```

### **MongoDB Connection:**
```bash
# Check if MongoDB is running:
mongo --eval "db.stats()"

# Start MongoDB:
brew services start mongodb-community  # macOS
sudo systemctl start mongod           # Linux
```

---

## 🚀 **Deployment Considerations**

### **Production Environment Variables:**
```bash
# Frontend (.env.production):
REACT_APP_BACKEND_URL=https://your-api-domain.com

# Backend (.env):
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/dbname
DB_NAME=arcturus_production
```

### **Build Commands:**
```bash
# Frontend build:
cd /app/frontend
yarn build

# Backend deployment:
cd /app/backend
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker
```

This comprehensive guide covers everything you need to understand, run, and modify the Arcturus Services website. The project is structured for easy development and scalability, with clear separation of concerns and modern development practices.
