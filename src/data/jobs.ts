export interface Job {
  dateRange: string;
  title: string;
  company: string;
  description?: string;
  details?: string[];
  employmentType?: string;
  location?: string;
  team?: string;
  skills?: string[];
}

export const jobs: Job[] = [
  {
    dateRange: "Sep 2025 - Present",
    title: "Software Engineer Intern",
    company: "Super.com",
    employmentType: "Internship",
    location: "San Francisco, California, United States · Remote",
    team: "Infrastructure Team 🔧",
    skills: ["Kubernetes", "Amazon Web Services (AWS)", "Datadog"],
  },
  {
    dateRange: "Dec 2024 - Apr 2025",
    title: "Software Engineer Intern",
    company: "Hamming AI (YC S24)",
    employmentType: "Internship",
    location: "San Francisco, California, United States",
    team: "Fullstack 🚀 YC S24",
    skills: ["Next.js", "PostgreSQL", "Temporal", "LiveKit", "tRPC", "Datadog"],
    details: [
      "Built dynamically generated IVR state machines for AI voice agent testing, directly leading to new customers.",
      "Investigated and fixed critical Redis concurrency issues, reducing call error rate by 85%.",
      "Automated frontend and backend tests using GitHub Actions and scheduled jobs to catch regressions in CI/CD.",
      "Enabled third-party voice agents to integrate with the Hamming platform, unlocking new customers.",
    ],
  },
  {
    dateRange: "Oct 2024 - Present",
    title: "Member - Cohere Labs",
    company: "Cohere",
    employmentType: "Fellowship",
  },
  {
    dateRange: "Feb 2024 - Oct 2024",
    title: "Autonomous Software Developer",
    company: "WATonomous",
    employmentType: "Part-time",
    location: "Waterloo, Ontario, Canada · Hybrid",
    team: "Machine Learning 🚙",
    skills: ["ROS2", "Docker", "PyTorch", "C++", "Python"],
    details: [
      "Trained a graph-based trajectory prediction model leveraging the nuScenes dataset.",
      "Implemented the predictor in the autonomy stack to enhance the vehicle's autonomous navigation.",
    ],
  },
  {
    dateRange: "May 2024 - Aug 2024",
    title: "Software Engineer Intern - CyLab Biometrics Center",
    company: "Carnegie Mellon University",
    employmentType: "Internship",
    location: "Pittsburgh, Pennsylvania, United States · On-site",
    team: "Robotics + Computer Vision 🤖",
    skills: [
      "ROS2",
      "OpenCV",
      "Docker",
      "JavaScript",
      "React.js",
      "Flask",
      "Express.js",
      "C++",
      "Python",
    ],
    details: [
      "Built a fully autonomous robot from the ground up with a two-person team to deliver groceries across the CMU campus.",
      "Engineered a ROS2 software stack integrating sensor fusion (EKF), AMCL/SLAM for localization, Hybrid A* for motion planning, and MPPI for control to achieve real-time, centimeter-level navigation.",
      "Integrated Jetson Orin Nano, LiDAR, RTK GPS, depth camera, IMU, and Arduino hardware for precise navigation.",
      "Built an AI checkout system using OpenCV to classify 250K+ Walmart products and prevent retail theft.",
    ],
  },
  {
    dateRange: "May 2023 - Jun 2023",
    title: "Data Science Intern",
    company: "MBR Technology",
    employmentType: "Internship",
    team: "Machine Learning 🧠",
    skills: ["Pandas", "Jupyter Notebook", "NumPy", "PyTorch", "Python", "Git"],
    details: [
      "Trained neural networks for image classification on public datasets like FashionMNIST and ImageNet.",
      "Applied transfer learning to reach 96% accuracy with a 7.7 million parameter CNN.",
    ],
  },
  {
    dateRange: "Jun 2022 - Aug 2022",
    title: "Software Engineer Intern",
    company: "Palturai",
    employmentType: "Internship",
    location: "Paoli, Pennsylvania, United States · Hybrid",
    team: "Fullstack 🔗",
    skills: ["Docker", "JavaFX", "Web Scraping", "Knowledge Graphs", "Apache Jena", "Java"],
    details: [
      "Developed an interactive knowledge graph visualization tool and custom language for tailored filtering, aesthetic control, and enhanced data display (RDF-Viewer).",
      "Scraped SEC filings and extracted relational data to serve as test cases for RDF-Viewer.",
    ],
  },
  {
    dateRange: "Jun 2021 - Aug 2021",
    title: "Software Engineer Intern",
    company: "Palturai",
    employmentType: "Internship",
    location: "Paoli, Pennsylvania, United States",
    team: "Backend ⚙️",
    skills: ["Java", "REST APIs"],
    details: [
      "Designed a Java SDK to abstract interaction with a fraud detection graph database handling 210M+ relationships.",
    ],
  },
];
