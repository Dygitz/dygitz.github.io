export interface Job {
  dateRange: string;
  title: string;
  company: string;
  description?: string | string[];
  location?: string;
  tagline?: string;
  skills?: string[];
}

export const jobs: Job[] = [
  {
    dateRange: "Sep 2025 - Present · 1 mo",
    title: "Software Engineer Intern",
    company: "Super.com",
    location: "San Francisco, California, United States",
    tagline: "Infrastructure Team 🔧",
    skills: ["Kubernetes", "Amazon Web Services (AWS)", "Datadog"],
    description: [
      "Deployed GDPR-compliant service on AWS (ElastiCache/RDS/EC2), enabling EU market expansion.",
      "Built AI coding agent responsible for shipping 33 production PRs, along with Datadog usage dashboard.",
      "Built AI-powered CI bot to triage and diagnose E2E test failures, cutting debug and deploy time.",
    ],
  },
  {
    dateRange: "Dec 2024 - Apr 2025 · 5 mos",
    title: "Fullstack Software Engineering Intern",
    company: "Hamming AI (YC S24)",
    location: "San Francisco, California, United States",
    tagline: "Fullstack 🚀 YC S24",
    skills: ["Next.js", "PostgreSQL", "Temporal", "LiveKit", "tRPC", "Datadog"],
    description: [
      "Built dynamically generated IVR state machines for AI voice agent testing, directly leading to new customers.",
      "Investigated and fixed critical Redis concurrency issues, reducing call error rate by 85%.",
      "Automated frontend and backend tests using GitHub Actions and scheduled jobs to catch regressions in CI/CD.",
      "Enabled third-party voice agents to integrate with the Hamming platform, unlocking new customers.",
    ],
  },
  {
    dateRange: "Oct 2024 - Present · 1 yr",
    title: "Member",
    company: "Cohere For AI",
    location: "Remote",
    tagline: "Cohere Labs",
  },
  {
    dateRange: "Feb 2024 - Oct 2024 · 9 mos",
    title: "Autonomous Software Developer",
    company: "WATonomous",
    location: "Waterloo, Ontario, Canada · Hybrid",
    tagline: "Machine Learning 🚙",
    skills: ["ROS2", "Docker", "PyTorch", "C++", "Python (Programming Language)"],
    description: [
      "Trained and deployed a graph-based trajectory prediction model leveraging the nuScenes dataset to improve the autonomous driving stack.",
    ],
  },
  {
    dateRange: "May 2024 - Aug 2024 · 4 mos",
    title: "Software Engineering Intern",
    company: "Carnegie Mellon University CyLab Biometrics Center",
    location: "Pittsburgh, Pennsylvania, United States · On-site",
    tagline: "Robotics + Computer Vision 🤖",
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
    description: [
      "Built a fully autonomous robot from the ground up in a team of two to deliver groceries across campus.",
      "Engineered a ROS2 stack integrating sensor fusion (EKF), AMCL/SLAM localization, Hybrid A* motion planning, and MPPI control for centimeter-level navigation.",
      "Integrated Jetson Orin Nano, LiDAR, RTK GPS, depth cameras, IMU, and Arduino subsystems.",
      "Created an OpenCV-powered AI checkout system to classify over 250K Walmart products and prevent retail theft.",
    ],
  },
  {
    dateRange: "May 2023 - Jun 2023 · 2 mos",
    title: "Data Science Intern",
    company: "MBR Technology",
    location: "Remote",
    tagline: "Machine Learning 🧠",
    skills: ["Pandas", "Jupyter Notebook", "NumPy", "PyTorch", "Python (Programming Language)", "Git"],
    description: [
      "Trained convolutional neural networks for image classification on FashionMNIST and ImageNet, achieving 96% accuracy with a 7.7M-parameter transfer learning pipeline.",
    ],
  },
  {
    dateRange: "Jun 2022 - Aug 2022 · 3 mos",
    title: "Software Engineer Intern",
    company: "Palturai",
    location: "Paoli, Pennsylvania, United States · Hybrid",
    tagline: "Fullstack 🔗",
    skills: [
      "Docker",
      "JavaFX",
      "Web Scraping",
      "Knowledge Graphs",
      "Apache Jena",
      "Java (Programming Language)",
    ],
    description: [
      "Developed an interactive knowledge graph visualization tool and a custom query language for filtering, styling, and enhancing RDF data displays.",
      "Scraped SEC filings to generate realistic data for demonstrations of the platform.",
    ],
  },
  {
    dateRange: "Jun 2021 - Aug 2021 · 3 mos",
    title: "Software Engineer Intern",
    company: "Palturai",
    location: "Paoli, Pennsylvania",
    tagline: "Backend ⚙️",
    skills: ["Java (Programming Language)", "REST APIs"],
    description: [
      "Designed a Java SDK to abstract interactions with a fraud-detection knowledge graph containing over 210 million relationships.",
    ],
  },
];
