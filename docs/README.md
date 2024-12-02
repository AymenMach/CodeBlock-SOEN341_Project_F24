# CodeBlock-SOEN341_Project_F24
Fall 2024 Web Development Project - Concordia University

## Team Name: CodeBlock

### Team Members:
- **(40250403), Aymen Machrouhi, AymenMach:** Front-End Development
- **(40006107), Christopher Puran, ChristopherPuran:** Back-End Development
- **(40242307), Nihal Islam, ImNotNihal:** Back-End Development
- **(40221602), Yazdan Syed, Yazdan0112:** 
- **(40227586), Carlos Guevara, carlos21guevara:** 

### Lab Session:
Avi Jitendra Lad | LAB FT-X (16:15 - 17:55)

---

## **Project Overview**

This project is a web-based peer assessment system built using:
- **Front-End:** React.js, HTML, CSS
- **Back-End:** Node.js, Express
- **Database:** MongoDB
- **Version Control:** GitHub

### **Features**
- Role-based login system (Student/Instructor).
- CSV upload to manage student/instructor data.
- Peer evaluation with multi-dimensional feedback.
- Instructor dashboard for managing and viewing group assessments.

---

## **Project Setup Guide**

### **1. Prerequisites**
Ensure the following are installed:
- **Node.js** (14 or higher)
- **MongoDB** (local/cloud instance, e.g., MongoDB Atlas)
- **Git**

### **2. Clone the Repository**
Clone the repository using the following command:
```bash
git clone https://github.com/your-repo/CodeBlock-SOEN341_Project_F24.git
```

### **3. Install Dependencies**
Navigate to the project folder and install the required dependencies:
- **bash**
- **Copy code**
- **npm install**

### **4. Set Up Environment Variables**
Create a .env file in the project root.
Add the following variables:
- **env**
- **Copy code**
- **MONGO_URI=your-mongo-connection-string**
- **PORT=5000**
Ensure MongoDB is running on the specified connection.

### **5. Add CSV Data**
Place the following CSV files in the data folder:
- **roster.csv:** Contains student information with headers:
    - username, password, name, role, studentId
- **instructor.csv:** Contains instructor information with headers:
    - username, password, name, role

## **6. Import Data**
Run the server script to parse and import data into MongoDB:
- **bash**
- **Copy code**
- **node server.js**

## **7. Start the Server**
Start the project with:
- **bash**
- **Copy code**
- **npm start**
By default, the app will run on http://localhost:5000.
