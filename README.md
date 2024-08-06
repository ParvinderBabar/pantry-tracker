# [Project 2 | AI Pantry Tracker App]
# Project Overview
I developed a Pantry Tracker app using Next.js with Material UI components. This project involved several key tasks, including setting up the project, implementing a Firebase backend for data storage, creating CRUD functionalities, adding search and filter features, and designing a presentable frontend.

# Features Implemented
# CRUD Functionality:

## Add, Delete, and Update Pantry Items:
Users can add new items to their pantry, update existing items, and delete items they no longer need.
## Search and Filter:
Users can search for pantry items by location (e.g., fridge, top shelf, bottom shelf, cleaning supplies).
## User Authentication: 
Implemented sign-up and login functionality using Firebase Authentication to ensure each user has their own pantry items.
## Expiry Products Notification: 
The app highlights products that are expiring within a month, helping users to use them before they go bad.
# AI Recipe Generator: 
Using Groq, I created a random recipe generator based on the contents of the pantry.
Frontend Design:

# Walkthrough:
A walkthrough feature explains the app's functionalities to new users before they sign up or log in.
# TailwindCSS 
The app uses Tailwindcss for a polished and responsive user interface.
# Navigation: 
A user-friendly navigation system to browse between different sections of the app.
Backend Implementation:

## Firebase Integration:
I used Firebase for real-time data operations, storage, and authentication.
# Indexed Storage and Database: 
Implemented indexed storage to enhance data retrieval efficiency.
Deployment:

CI/CD and Vercel: The app is deployed on Vercel with CI/CD pipelines ensuring smooth updates and deployments.
Challenges Faced
# Routing and User Provider:
Initially, I faced challenges with setting up routing and the user provider, which I overcame by learning and implementing best practices in Next.js.
## First-time Firebase Use: 
This was my first time using Firebase. I learned how to install it, set up indexed storage, and use the database and state listener for user IDs.
Camera Uploads and GCP Vertex AI: I attempted to implement image uploads using the mobile or browser camera and classify images using GCP Vertex AI. However, due to time constraints, I had to drop this feature.
Error Handling: Dealing with various errors, especially while integrating Firebase and implementing CRUD operations, was challenging but provided valuable learning experiences.
Lessons Learned
Firebase: Gained hands-on experience in setting up and using Firebase for authentication, storage, and real-time database operations.
Next.js and Material UI: Enhanced my skills in using Next.js for project structuring and Material UI for creating responsive and attractive user interfaces.
CI/CD Pipelines: Learned to set up and use CI/CD pipelines for efficient project deployment and updates.
Deployed Application
You can check out the deployed application here.

# Bonus Features (Partially Implemented)
Image Uploads: Tried implementing image uploads using Firebase Storage but faced errors.
Recipe Suggestion Feature: Created a random recipe generator using Groq based on pantry contents.
# Conclusion
Working on this project has been a great learning experience. It has strengthened my skills in Next.js, Firebase, and Material UI, and taught me the importance of time management and error handling in real-world projects. I'm looking forward to applying these skills in future projects and continuing to improve my coding abilities.
