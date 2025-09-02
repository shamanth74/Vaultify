# 🔐 Vaultify Secure

**Vaultify Secure** is a modern, zero-knowledge password manager built with **Next.js** and **PostgreSQL**, designed to ensure maximum security and user privacy.  
It empowers users to securely generate, store, manage, and monitor their passwords with powerful features like **customizable password generation**, **strength checking**, and **email alerts**.

---

## 🚀 Features

### 🛡️ Zero-Knowledge Architecture
- Passwords are **encrypted and decrypted using a master password**.
- Even the service provider cannot access or view stored passwords.
- Ensures GDPR & privacy compliance.

### 🔑 Password Management
- Add, view, update, and delete stored passwords.
- Securely store account **platform link, username, and password**.
- All data encrypted before storage.

### ⚡ Password Generator
- Generate **strong, customizable passwords**:
  - Choose uppercase, lowercase, numbers, symbols.
  - Directly add generated password to your vault.

### 📊 Password Strength Checker
- Real-time **strength evaluation** for any password.
- Detects weak/strong patterns.
- Breach check to ensure password hasn’t been compromised.

### ⏰ Smart Reminders
- Get **45-day password expiry reminders**.
- Option to **snooze or ignore** reminders if desired.
- Helps enforce regular password updates.

### 📧 Email Alerts
- Receive an **instant email alert** whenever a stored password is viewed.
- Adds a layer of transparency and accountability.

### 🎨 Modern UI
- Built with **ShadCN UI + TailwindCSS**.
- Polished **reddish-purple theme** inspired by macOS/Windows wallpapers.
- Responsive and minimal design for smooth usage.

---

## 🏗️ Tech Stack

- **Frontend:** Next.js (App Router), React, TailwindCSS, ShadCN UI  
- **Backend:** Next.js API Routes  
- **Database:** PostgreSQL (NeonDB for cloud hosting)  
- **Authentication:** NextAuth.js (JWT-based)  
- **Email Service:** Nodemailer + Gmail App Passwords  
- **Hosting:** Vercel  

---

## 📂 Project Structure

vaultify-secure/
│── app/ # Next.js App Router
│ ├── (auth)/ # Login & Signup pages
│ ├── dashboard/ # User dashboard (vault access)
│ ├── api/ # API routes (CRUD, auth, reminders, alerts)
│
│── components/ # Reusable UI components
│── lib/ # Utility functions (encryption, helpers)
│── prisma/ # Database schema (Prisma + PostgreSQL)
│── styles/ # Global styles & theme
│── .env # Environment variables
│── README.md # Documentation


---

## ⚙️ Installation & Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/vaultify-secure.git
   cd vaultify-secure


Install dependencies

npm install


Configure environment variables (.env)

DATABASE_URL="your_neon_db_url"
NEXTAUTH_SECRET="your_secret"
EMAIL_USER="your_gmail"
EMAIL_PASS="your_app_password"


Run database migrations

npx prisma migrate dev


Start development server

npm run dev

🚀 Deployment

Hosted on Vercel

Database on NeonDB (PostgreSQL)

Every push to GitHub auto-deploys to production 🚀

👨‍💻 Author

Shamanth M
5th Semester ISE, VVCE Mysore
Aspiring SWE | Passionate about Security & Full-Stack Development

⭐ Why Vaultify Secure?

Unlike typical password managers, Vaultify Secure prioritizes zero-knowledge principles:

Your master password is the only key to decrypt data.

Email alerts + reminders create real accountability.

A blend of security + usability, making it resume-worthy and interview-impactful.
