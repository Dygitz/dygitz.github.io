export interface Job {
  dateRange: string;
  tenure?: string;
  title: string;
  company: string;
  summary?: string;
  location?: string;
  employmentType?: string;
  skills?: string[];
  highlights?: string[];
  description?: string;
}

export const jobs: Job[] = [
  {
    dateRange: "Sep 2025 - Present",
    tenure: "Sep 2025 to Present · 1 mo",
    title: "Software Engineer Intern",
    company: "Super.com",
    summary: "Infrastructure Team 🔧",
    employmentType: "Internship",
    location: "San Francisco, California, United States · Remote",
    skills: ["Kubernetes", "Amazon Web Services (AWS)", "Datadog"],
  },
  {
    dateRange: "Dec 2024 - Apr 2025",
    tenure: "Dec 2024 to Apr 2025 · 5 mos",
    title: "Software Engineer Intern",
    company: "Hamming AI (YC S24)",
    summary: "Fullstack 🚀 YC S24",
    employmentType: "Internship",
    location: "San Francisco, California, United States",
    skills: ["Next.js", "PostgreSQL", "Temporal", "LiveKit", "tRPC", "Datadog"],
    highlights: [
      "Built dynamically generated IVR state machines for AI voice agent testing, unlocking new customer deployments.",
      "Investigated and resolved critical Redis concurrency issues, reducing call error rates by 85%.",
      "Automated frontend and backend test suites with GitHub Actions and scheduled jobs to catch regressions early.",
      "Enabled third-party voice agents to integrate with the Hamming platform, opening new revenue channels.",
    ],
  },
  {
    dateRange: "Oct 2024 - Present",
    tenure: "Oct 2024 to Present · 1 yr",
    title: "Member · Cohere Labs",
    company: "Cohere",
    summary: "Cohere Labs",
  },
  {
    dateRange: "Feb 2024 - Oct 2024",
    tenure: "Feb 2024 to Oct 2024 · 9 mos",
    title: "Autonomous Software Developer",
    company: "WATonomous",
    summary: "Machine Learning 🚙",
    employmentType: "Part-time",
    location: "Waterloo, Ontario, Canada · Hybrid",
    skills: ["ROS2", "Docker", "PyTorch", "C++", "Python (Programming Language)"],
    highlights: [
      "Trained and deployed a graph-based trajectory prediction model with the nuScenes dataset to improve autonomous navigation.",
    ],
  },
  {
    dateRange: "May 2024 - Aug 2024",
    tenure: "May 2024 to Aug 2024 · 4 mos",
    title: "Software Engineer Intern · CyLab Biometrics Center",
    company: "Carnegie Mellon University",
    summary: "Robotics + Computer Vision 🤖",
    employmentType: "Internship",
    location: "Pittsburgh, Pennsylvania, United States · On-site",
    skills: [
      "ROS2",
      "OpenCV",
      "Docker",
      "JavaScript",
      "React.js",
      "Flask",
      "Express.js",
      "C++",
      "Python (Programming Language)",
    ],
    highlights: [
      "Built a fully autonomous robot in a two-person team to deliver groceries across campus with centimeter-level accuracy.",
      "Engineered a ROS2 stack integrating sensor fusion (EKF), AMCL/SLAM localization, Hybrid A* planning, and MPPI control.",
      "Integrated Jetson Orin Nano, LiDAR, RTK GPS, depth camera, IMU, and Arduino hardware for precise navigation.",
      "Developed an AI checkout system with OpenCV to classify more than 250K Walmart products and deter retail theft.",
    ],
  },
  {
    dateRange: "May 2023 - Jun 2023",
    tenure: "May 2023 to Jun 2023 · 2 mos",
    title: "Data Science Intern",
    company: "MBR Technology",
    summary: "Machine Learning 🧠",
    employmentType: "Internship",
    skills: ["Pandas", "Jupyter Notebook", "NumPy", "PyTorch", "Python (Programming Language)", "Git"],
    highlights: [
      "Trained neural networks for image classification on FashionMNIST and ImageNet datasets.",
      "Fine-tuned convolutional models with transfer learning, reaching 96% accuracy using 7.7 million parameters.",
    ],
  },
  {
    dateRange: "Jun 2022 - Aug 2022",
    tenure: "Jun 2022 to Aug 2022 · 3 mos",
    title: "Software Engineer Intern",
    company: "Palturai",
    summary: "Fullstack 🔗",
    employmentType: "Part-time",
    location: "Paoli, Pennsylvania, United States · Hybrid",
    skills: ["Docker", "JavaFX", "Web Scraping", "Knowledge Graphs", "Apache Jena", "Java (Programming Language)"],
    highlights: [
      "Developed an interactive knowledge graph visualization tool with a custom language for filtering and presentation.",
      "Scraped SEC filings and extracted relational data to build comprehensive test scenarios for the RDF-Viewer.",
    ],
  },
  {
    dateRange: "Jun 2021 - Aug 2021",
    tenure: "Jun 2021 to Aug 2021 · 3 mos",
    title: "Software Engineer Intern",
    company: "Palturai",
    summary: "Backend ⚙️",
    employmentType: "Internship",
    location: "Paoli, Pennsylvania, United States",
    skills: ["Java (Programming Language)", "REST APIs"],
    highlights: [
      "Designed a Java SDK to abstract fraud-detection graph database interactions across 210M+ relationships.",
    ],
  },
];
