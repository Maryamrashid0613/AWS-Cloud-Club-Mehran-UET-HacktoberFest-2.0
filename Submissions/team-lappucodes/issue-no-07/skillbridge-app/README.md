🎓 SkillBridge LMS

SkillBridge is a modern, responsive Learning Management System (LMS) dashboard built with React and Tailwind CSS.
It provides three different role-based views — Student, Instructor, and Admin — each with custom analytics, stats, and data visualization for interactive course management.

🚀 Features
👩‍🎓 Student Dashboard

Displays enrolled courses with:

Instructor info

Course progress tracking

Rating, reviews, and difficulty badges

Dynamic progress bar visualization

Stats overview for:

Total Enrolled Courses

Completed Courses

In-Progress Courses

Certificates Earned

👨‍🏫 Instructor Dashboard

Manage and monitor personal courses:

Enrollment numbers

Revenue tracking

Ratings and reviews

Edit, view, and delete course actions

Stats overview for:

Total Courses

Students Enrolled

Total Earnings

Average Rating

“Create New Course” action button

🧑‍💼 Admin Dashboard

Platform-wide insights:

Total Users

Active Courses

Pending Approvals

Platform Revenue

Manage pending course approvals (Approve/Reject)

Platform analytics showing growth trends:

New Enrollments

Active Users

Course Completions

Monthly Revenue

🛠️ Tech Stack
Technology	Purpose
React	Component-based UI
Tailwind CSS	Utility-first styling
Lucide-React	Clean, lightweight icons
JavaScript (ES6)	App logic and interactivity
🧩 Folder Structure
SkillBridge/
│
├── src/
│   ├── components/
│   │   └── SkillBridge.jsx       # Main component
│   ├── assets/                   # (optional) images or logos
│   ├── App.jsx                   # Root app file
│   ├── index.js                  # React entry point
│   └── styles/                   # Tailwind or custom CSS
│
├── public/
│   └── index.html
│
├── package.json
├── tailwind.config.js
└── README.md

⚙️ Installation & Setup

Clone the repository

git clone https://github.com/yourusername/skillbridge-lms.git


Navigate to the project directory

cd skillbridge-lms


Install dependencies

npm install


Start the development server

npm run dev


This will start your app at http://localhost:5173/ (or whichever port your setup uses).

🎨 UI Highlights

Elegant glassmorphism interface with soft gradients and blurs

Role toggle switch (Student / Instructor / Admin)

Gradient-based stat cards and progress visualizations

Fully responsive layout optimized for desktop and mobile

Consistent dark mode aesthetic with vibrant accent colors

🧠 Design Decisions

Role-Based Rendering: Controlled by a useState hook (activeRole), dynamically loads the relevant dashboard.

Reusable Components: Stats cards, difficulty badges, and tables use reusable patterns to maintain consistency.

Dummy Data Setup: All data is currently hardcoded using React state arrays, easily replaceable with API calls later.

🔮 Future Enhancements

🔗 Connect with a real backend (Node.js / Firebase)

📊 Add charts for analytics (Recharts / Chart.js)

💬 Include discussion forums & notifications

🧾 Course creation form for instructors

🔒 Authentication & user roles system

💡 Inspiration

Built for educational platforms aiming to modernize learning, teaching, and management through intuitive design and efficient dashboards.

🧑‍💻 Author

Developed by LappuCodes Team

“Empowering learners worldwide through smart design and clean code.”

🪪 License

This project is open-source under the MIT License.
You are free to use, modify, and distribute it with proper attribution.