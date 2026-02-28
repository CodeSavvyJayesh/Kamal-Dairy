# 🥛 Kamal Dairy — Premium Dairy E-Commerce Platform

> A full-stack, production-ready dairy e-commerce platform built with modern web technologies, secure authentication, role-based access control, and a beautiful responsive UI.

---

## 🌟 Project Vision

Kamal Dairy is designed to deliver a **premium online dairy shopping experience**.

Customers can browse and shop high-quality dairy products from trusted brands like:

- 🥛 Amul  
- 🐄 Mother Dairy  
- 🧀 Milk Mist  
- 🧈 Heritage  
- 🧊 And more...

The platform focuses on:

✔ Clean Architecture  
✔ Secure Authentication (JWT)  
✔ Role-Based Authorization  
✔ Modern UI/UX  
✔ Fully Responsive Design  
✔ Scalable Backend Structure  

---

# 🏗️ Architecture Overview

This project follows a clean layered architecture:

Frontend (React + Vite)  
↓  
REST APIs (Spring Boot)  
↓  
Service Layer (Business Logic)  
↓  
Repository Layer (Spring Data JPA)  
↓  
MySQL Database  

Security Layer:

JWT Authentication  
↓  
JWT Validation Filter  
↓  
Role-Based Authorization (USER / ADMIN)  
↓  
Global Exception Handling (RFC 7807 Standard)

---

# 🚀 Tech Stack

## 🎨 Frontend

- ⚛ React.js (Vite)
- 🎨 CSS (Custom styling)
- 🎞 Swiper.js (Hero + Brand sliders)
- 📦 React Icons
- 🌐 Fetch API
- 🔐 JWT Token Storage

---

## 🔐 Backend

- ☕ Spring Boot 3 (3.5.9)
- 🔐 Spring Security
- 🗄 Spring Data JPA
- 🐬 MySQL
- 🔑 JWT (JSON Web Token)
- 🛡 BCrypt Password Encryption
- 📦 Global Exception Handling (RFC 7807)

---

## 🛠 Tools

- VS Code
- IntelliJ IDEA
- Postman
- Git & GitHub
- Maven
- Vite Development Server

---

# ✨ Frontend Features

## 🎯 1. Premium Hero Banner Slider

- Auto-scrolling
- Center-focused zoom animation
- Background blur transitions
- Smooth animation effects
- Inspirational overlay text

---

## 🧀 2. Smart Category System

12 Dairy Categories:

- Milk
- Paneer
- Butter
- Ghee
- Ice Cream
- Buttermilk
- Yoghurt
- Cheese
- Lassi
- Powdered Milk
- Shrikhand
- Chaas

✔ Clean grid layout  
✔ Dynamic category-based listing  
✔ Fully responsive  

---

## 🛍 3. Modern Product Cards

- Hover glow effects
- Image zoom on hover
- Add to Cart button
- Know More button
- Smooth shadow transitions
- Clean typography

---

## 🏷 4. Trusted Brands Slider

- Infinite autoplay
- Grayscale → Color hover effect
- Smooth transitions
- Mobile responsive

---

## 📦 5. Subscription Section

- Clean UI design
- Basic subscription system
- Ready for backend integration

---

## 📞 6. Contact Page

- Location
- Phone
- WhatsApp
- Working Hours
- Professional layout
- Premium color theme

---

## 📱 Fully Responsive Design

Works beautifully on:

📱 Mobile  
💻 Laptop  
🖥 Desktop  
📺 Large screens  

---

# 🔐 Backend Features

## 👤 Authentication System

✔ User Signup  
✔ Secure Login  
✔ BCrypt password encryption  
✔ JWT Token generation  
✔ JWT validation filter  

---

## 🛡 Role-Based Authorization

Two roles implemented:

### 👤 USER
- Browse products
- Place orders
- View personal orders

### 👑 ADMIN
- Add products
- Update products
- Delete products
- Full stock management access

Role is embedded inside JWT and validated via Spring Security.

---

## ⚙ Security Implementation

- Custom JWT Utility
- OncePerRequestFilter for token validation
- SecurityFilterChain configuration
- Method-level security using @PreAuthorize
- Stateless authentication (no session storage)

---

## 🚨 Global Exception Handling

Implemented using:

- @RestControllerAdvice
- Custom business exceptions
- RFC 7807 ProblemDetail standard


🧩 Upcoming Features
🔐 OTP Email Verification
🛒 Complete Cart System
🔔 Notification System
💳 Payment Gateway Integration
📦 Order Tracking
⭐ Product Reviews
📊 Admin Analytics Dashboard
📦 Advanced Stock Management

📈 Learning Outcomes
Through this project, I implemented:
JWT-based authentication
Role-based authorization
Spring Security configuration
Global exception handling (RFC 7807)
Clean layered architecture
Secure password encryption
RESTful API best practices
Professional frontend UI/UX design

🤝 Contribution
This project is part of my:
💼 Internship 
🚀 Placement Preparation
Suggestions and improvements are always welcome.

📬 Contact
📧 Email: jayeshdhamal03@gmail.com
📱 Phone: 9970469894
