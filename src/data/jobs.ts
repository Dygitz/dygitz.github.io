export interface Job {
  dateRange: string;
  title: string;
  company: string;
  card?: {
    date: string;
    title?: string;
    compactTitle: string;
    company?: string;
    compactCompany?: string;
  };
  description?: string | string[];
  location?: string;
  tagline?: string;
  skills?: string[];
}

export const jobs: Job[] = [
  {
    dateRange: "May 2026 - Aug 2026 · 4 mos",
    title: "Software Engineer Intern (Post Trade)",
    company: "BitGo",
    card: {
      date: "May–Aug 2026",
      title: "Software Engineer Intern",
      compactTitle: "Engineering Intern",
    },
    location: "New York, New York, United States",
    skills: ["Go", "AWS RDS/DMS", "Grafana", "Kafka", "TypeScript"],
    description: [
      "Migrated 5M+ rows on a 24/7 live trading platform, replacing cross-database writes with atomic transactions.",
      "Automated token onboarding through a centralized asset registry, eliminating manual configuration.",
      "Eliminated Kafka consumer-group rebalance loops with Kubernetes health probes and improved on-call alerts.",
    ],
  },
  {
    dateRange: "Sep 2025 - Dec 2025 · 4 mos",
    title: "Software Engineer Intern",
    company: "Super.com",
    card: { date: "Sep–Dec 2025", compactTitle: "Engineering Intern" },
    location: "Remote",
    tagline: "Infrastructure + DevOps 🔧",
    skills: ["Kubernetes", "Amazon Web Services (AWS)", "Datadog"],
    description: [
      "Deployed GDPR-compliant service on AWS (ElastiCache/RDS/EC2), enabling EU market expansion.",
      "Built AI coding agent responsible for shipping 37 production PRs, along with Datadog usage dashboard.",
      "Built AI-powered CI bot to triage and diagnose E2E test failures, cutting production debug and deploy time.",
    ],
  },
  {
    dateRange: "Dec 2024 - Apr 2025 · 5 mos",
    title: "Fullstack Software Engineering Intern",
    company: "Hamming AI (YC S24)",
    card: {
      date: "Dec ’24–Apr ’25",
      title: "Fullstack Engineering Intern",
      compactTitle: "Fullstack Intern",
      company: "Hamming AI",
    },
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
    dateRange: "Feb 2024 - Oct 2024 · 9 mos",
    title: "Autonomous Software Developer",
    company: "WATonomous",
    card: { date: "Feb–Oct 2024", compactTitle: "Autonomy Dev." },
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
    card: {
      date: "May–Aug 2024",
      title: "Software Eng. Intern",
      compactTitle: "Engineering Intern",
      company: "Carnegie Mellon\nCyLab Biometrics",
      compactCompany: "CMU · CyLab",
    },
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
    card: { date: "May–Jun 2023", compactTitle: "Data Science Intern" },
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
    card: { date: "Jun–Aug 2022", compactTitle: "Engineering Intern" },
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
    card: { date: "Jun–Aug 2021", compactTitle: "Engineering Intern" },
    location: "Paoli, Pennsylvania",
    tagline: "Backend ⚙️",
    skills: ["Java (Programming Language)", "REST APIs"],
    description: [
      "Designed a Java SDK to abstract interactions with a fraud-detection knowledge graph containing over 210 million relationships.",
    ],
  },
];
