# Demo Video Recording Plan - Swift Payment System

## 📋 Overview
Each team member records 2-3 minutes showcasing their specific contribution. These will be stitched together for a comprehensive demo.

---

## 🎯 **JAMES: MongoDB Setup, API & Backend Implementation**
**Duration: 2-3 minutes**

### **Quick Demo Flow:**
1. **Backend Startup (30 seconds)**
   - Show `cd backend && npm start`
   - Highlight server running on port 8443
   - Show MongoDB Atlas connection

2. **API Testing (1 minute)**
   - **Login API**: Show `POST /api/auth/login` with Postman
   - **Payment API**: Show `POST /api/payments/submit` with encrypted data
   - **Transactions API**: Show `GET /api/payments/my-applications`

3. **MongoDB Atlas (1 minute)**
   - Show hartsCluster dashboard
   - **Users Collection**: Highlight encrypted fields (full_name, IDNumber)
   - **Payment Collection**: Show encrypted payment data
   - **Explain**: AES-192-CBC field-level encryption

---

## 🛡️ **WEYLIN: Security Practices & Protections**
**Duration: 2-3 minutes**

### **Quick Demo Flow:**
1. **Input Validation (1 minute)**
   - **Frontend**: Try invalid payment data (non-numeric amount)
   - **Backend**: Send malformed API request via Postman
   - **Show**: Both client and server validation working

2. **Authentication Security (1 minute)**
   - **JWT Tokens**: Show token in browser dev tools
   - **Protected Routes**: Try accessing transactions without login
   - **Code Review**: Show `backend/check-auth.js` middleware

3. **Security Packages (30 seconds)**
   - **bcrypt**: Password hashing
   - **helmet**: Security headers
   - **crypto**: AES-192-CBC encryption
   - **express-validator**: Input sanitization

---

## 🎨 **KEVIN: User Interface & User Experience**
**Duration: 2-3 minutes**

### **Quick Demo Flow:**
1. **Application Startup (30 seconds)**
   - Show `cd frontend && npm start`
   - Display app running on localhost:3001
   - Show clean, professional UI

2. **User Journey (1.5 minutes)**
   - **Login**: Show login page and successful authentication
   - **Home Page**: Display welcome message and navigation
   - **Payment Form**: Show payment submission with validation
   - **Transactions**: Display transaction history page

3. **Logout & Responsive (30 seconds)**
   - **Logout Modal**: Show confirmation popup and redirect
   - **Mobile View**: Quick resize to show responsive design

---

## 🔄 **EMIL: DevSecOps with CircleCI**
**Duration: 2-3 minutes**

### **Quick Demo Flow:**
1. **CircleCI Dashboard (1 minute)**
   - Navigate to CircleCI project
   - Show successful pipeline run
   - Highlight "Success" status

2. **Pipeline Jobs (1 minute)**
   - **Security Scans**: npm audit, SAST, secrets detection
   - **Quality Checks**: Backend/frontend builds, tests
   - **Code Quality**: ESLint results

3. **Configuration & Value (30 seconds)**
   - Show `.circleci/config.yml` file
   - Explain automated security monitoring
   - Highlight DevSecOps benefits

---

## 🎬 **Recording Guidelines**

### **Technical Requirements:**
- **Recording Tool**: Use OBS Studio (as required by Task 2.5/3.7)
- **Resolution**: 1920x1080 minimum
- **Audio**: Clear microphone, no background noise
- **Duration**: Keep each section within time limits

### **Content Guidelines:**
- **Speak Clearly**: Explain technical concepts in simple terms
- **Show, Don't Just Tell**: Demonstrate functionality visually
- **Highlight Key Features**: Emphasize security and quality aspects
- **Professional Presentation**: Maintain professional tone

### **Stitching Instructions:**
1. **Introduction**: Brief project overview (30 seconds)
2. **James**: MongoDB & Backend (2-3 minutes)
3. **Weylin**: Security Implementation (2-3 minutes)
4. **Kevin**: User Interface (2-3 minutes)
5. **Emil**: DevSecOps Pipeline (2-3 minutes)
6. **Conclusion**: Project summary and achievements (1 minute)

### **Total Video Length: 10-15 minutes**

---

## 📝 **Key Points to Emphasize**

### **Security Focus:**
- Field-level encryption (AES-192-CBC)
- JWT authentication
- Input validation and sanitization
- Automated security scanning

### **Quality Assurance:**
- Automated testing
- Code quality enforcement
- Continuous integration
- DevSecOps pipeline

### **User Experience:**
- Clean, professional UI
- Responsive design
- Role-based access control
- Intuitive navigation

### **Technical Excellence:**
- Modern tech stack
- Secure database implementation
- RESTful API design
- Comprehensive documentation

---

**Good luck with your recordings! This comprehensive demo will showcase all aspects of your Swift Payment System project.**
