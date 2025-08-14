# HelpHive 🐝

HelpHive is a micro-local volunteer-swap platform built with the MERN stack (MongoDB, Express.js, React, Node.js). It enables individuals in local communities to exchange help and services with one another through a simple, trust-based system.

---

## ​ Table of Contents

- [Features](#🛠️-features)
- [Tech Stack](#⚙️-tech-stack)
- [📁 Project Structure](#project-structure)
- [📦 Installation](#installation)
- [📸 Screenshots](#screenshots)
- [🤝 Contributing](#contributing)
- [🧑‍💻 Authors](#authors)

---

## ​​ Features

- 🤝 Volunteer request and offer system  
- 📍 Location-based task discovery  
- 💬 Messaging and interaction tools  
- 🧾 User reputation and rating system  
- 📦 Modular, scalable MVC-style backend  
- 💡 Clean, minimal, **green-themed** UI design  

---

## ​​ Tech Stack

### Frontend

- React.js  
- React Router  
- CSS  

### Backend

- Node.js  
- Express.js  
- MongoDB (Mongoose ODM)  
- JWT Authentication  

---

## ​ Project Structure

.
├── client/ # React frontend (View)

├── server/ # Node.js backend (Model + Controller)

├── .env # Environment variables

└── README.md # Project overview and instructions


---

## ​ Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/helphive.git
   cd helphive
Install Dependencies

bash
Copy
Edit

# Server dependencies
cd server

npm install

# Client dependencies
cd ../client

npm install

Configure Environment Variables

Create a .env file inside the server/ folder containing:

env
Copy
Edit
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
Start the Application

bash
Copy
Edit
npm run start

This uses concurrently to launch both the client (frontend) and server (backend).

Screenshots



Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss your proposed update.

Authors
Mohammad Nazmul Hoque: https://github.com/NazmulHoque1010

Imtiaz Mashafee Samin: https://github.com/exoxeph

Ahmed Rafat: https://github.com/ahmedrafatcse

Nakshatra Roy: https://github.com/nakshatra-roy

📄 MIT License © 2025 HelpHive
