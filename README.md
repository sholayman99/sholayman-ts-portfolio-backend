# Rest Api for Portfolio

This is a web application for managing my freelance web development services, clients, and social media links. It allows for storing information about the services I offer, clients who have availed of my services, and social media profiles, all within a MongoDB database using Mongoose and Node.js for the backend.

## Features

- **Service Management**: Add, update, delete, and view the services I offer.
- **Client Management**: Add and manage details of clients who have hired me for various services.
- **Social Media Links**: Manage links to various social media platforms with options to store additional options for social media.
- **Notifications**: Handle real-time notifications about new client requests and other activities.
- **User Authentication**: Authentication system for secure access to client data and services.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer for handling email notifications
- **Environment Management**: dotenv for environment variables
- **Version Control**: Git, GitHub

## Getting Started

### Prerequisites

- **Node.js** (v16 or later)
- **MongoDB** (either local or cloud)
- **npm** (Node Package Manager)

### Installation

1. Clone this repository:
- git clone https://github.com/yourusername/freelance-portfolio.git
- cd freelance-portfolio
- npm install
- npm run dev

# Ignore the .env file
- .env
- PORT=8000
- DB_URI=mongodb://YourDatabaseHost:27017/your-database-name   # MongoDB connection string
- ADMIN_EMAIL=your_email@example.com
- ADMIN_USERNAME=your_admin_username
- ADMIN_FULLNAME="Your Full Name"
- ADMIN_PASSWORD="YourSecurePassword"
- JWT_REFRESH_SECRET=YourRefreshSecretKey
- JWT_SECRET=YourSecretKeyForJWT
- GMAIL_USER=your_email@gmail.com          # Gmail for sending emails (if applicable)
- GMAIL_PASS=your_email_password           # Use Gmail App Password if 2FA is enabled


