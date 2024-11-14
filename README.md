# CodeBlock-SOEN341_Project_F24
Fall 2024 Web Development Project SOEN341 FL-X
Team name : CodeBlock

Description: Creation of a login system for students/instructors from Concordia University

Team Members:
Aymen Machrouhi (40250403)   Responsible for the Front-End part of the project/
Christopher Puran (40006107) Responsible for the Back-End part of the project/ 
Nihal Islam (40242307)       Responsible for the Back-End part of the project/
Yazdan Syed (40221602)       Responsible for the Front-End part of the project/
Carlos Guevara (40227586)    Responsible for the Back-End part of the project/
Mohamed Oubagha (40248333)   Responsible for the Front-End part of the project/

Lab Session: Avi Jitendra Lad | LAB FT-X - (16:15 - 17:55)

# Project Setup Guide

This guide will walk you through setting up and running the project locally.

## Prerequisites

Before you start, ensure you have the following installed on your local machine:

- **Node.js** (version 14 or higher)
- **MongoDB** (local or cloud instance, like MongoDB Atlas)
- **Git** (if cloning the repository from GitHub)

## 1. Clone the Repository
## 2. Install Dependencies 
Navigate to the project directory and install the required dependencies using npm:
npm install

## 3. Set up Environment Variables
Create a .env file in the root directory of the project.
Include the MongoDB URI which is your MongoDB connection string.
Include the port the server will run on. The default is 5000.
ex: MONGO_URI = ...
    PORT = 5000

## 4. CSV Data
Place the .csv files in the data folder.
The file relating to students must be called roster.csv.
For roster.csv:
    username
    password
    name
    role
    studentId
    
The file relating to the instructor must be called instructor.csv.
For instructor.csv:
    username
    password
    name
    role

## 5. Parse and store the data from the CSV files
To import the data into MongoDB use the following command:
node server.js

## 6. Run the project
To start the server use the following command:
npm start



