export interface Job {
        dateRange: string;
        title: string;
        company: string;
        location?: string;
        employmentType?: string;
        summary?: string;
        details?: string[];
        skills?: string[];
}

export const jobs: Job[] = [
        {
                dateRange: "Sep 2025 - Present",
                title: "Software Engineer Intern",
                company: "Super.com",
                location: "San Francisco, California, United States · Remote",
                employmentType: "Internship",
                summary: "Infrastructure Team 🔧",
                details: [
                        "Supporting the infrastructure team with Kubernetes, AWS, and Datadog tooling to keep services reliable in a remote-first environment.",
                ],
                skills: ["Kubernetes", "Amazon Web Services (AWS)", "Datadog"],
        },
        {
                dateRange: "Jan 2025 - May 2025",
                title: "Fullstack Software Engineering Intern",
                company: "Hamming AI (YC S24)",
                location: "San Francisco, California, United States",
                employmentType: "Internship",
                summary: "Fullstack 🚀 YC S24",
                details: [
                        "Built dynamically generated IVR state machines for AI voice agent testing, directly leading to new customers.",
                        "Investigated and fixed critical Redis concurrency issues, reducing call error rate by 85%.",
                        "Automated frontend and backend tests using GitHub Actions and scheduled jobs to catch regressions in CI/CD.",
                        "Enabled third-party voice agents to integrate with the Hamming platform, unlocking new customers.",
                ],
                skills: ["Next.js", "PostgreSQL", "Temporal", "LiveKit", "tRPC", "Datadog"],
        },
        {
                dateRange: "Oct 2024 - Present",
                title: "Member",
                company: "Cohere Labs",
        },
        {
                dateRange: "Feb 2024 - Oct 2024",
                title: "Autonomous Software Developer",
                company: "WATonomous",
                location: "Waterloo, Ontario, Canada · Hybrid",
                summary: "Machine Learning 🚙",
                details: [
                        "Trained and implemented a graph-based trajectory prediction model using the nuScenes dataset to enhance autonomous navigation.",
                ],
                skills: ["ROS2", "Docker", "PyTorch", "C++", "Python (Programming Language)"],
        },
        {
                dateRange: "May 2024 - Aug 2024",
                title: "Software Engineer Intern - CyLab Biometrics Center",
                company: "Carnegie Mellon University",
                location: "Pittsburgh, Pennsylvania, United States · On-site",
                employmentType: "Internship",
                summary: "Robotics + Computer Vision 🤖",
                details: [
                        "Built a fully autonomous delivery robot with a two-person team to run grocery routes across the CMU campus.",
                        "Engineered a ROS2 stack combining sensor fusion (EKF), AMCL/SLAM localization, Hybrid A* motion planning, and MPPI control for centimeter-level navigation.",
                        "Integrated Jetson Orin Nano, LiDAR, RTK GPS, depth camera, IMU, and Arduino hardware for precise navigation.",
                        "Developed an AI checkout system with OpenCV to classify 250K+ Walmart products and prevent retail theft.",
                ],
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
        },
        {
                dateRange: "May 2023 - Jun 2023",
                title: "Data Science Intern",
                company: "MBR Technology",
                summary: "Machine Learning 🧠",
                details: [
                        "Trained neural networks for image classification on public datasets like FashionMNIST and ImageNet.",
                        "Applied transfer learning to a CNN with 7.7 million parameters to reach 96% accuracy.",
                ],
                skills: [
                        "Pandas",
                        "Jupyter Notebook",
                        "NumPy",
                        "PyTorch",
                        "Python (Programming Language)",
                        "Git",
                ],
        },
        {
                dateRange: "Jun 2022 - Aug 2022",
                title: "Software Engineer Intern",
                company: "Palturai",
                location: "Paoli, Pennsylvania, United States · Hybrid",
                summary: "Fullstack 🔗",
                details: [
                        "Developed an interactive knowledge graph visualization tool and a custom language for tailored filtering and presentation (RDF-Viewer).",
                        "Scraped SEC filings to extract relational data that served as realistic datasets for RDF-Viewer.",
                ],
                skills: ["Docker", "JavaFX", "Web Scraping", "Knowledge Graphs", "Apache Jena", "Java (Programming Language)"],
        },
        {
                dateRange: "Jun 2021 - Aug 2021",
                title: "Software Engineer Intern",
                company: "Palturai",
                location: "Paoli, Pennsylvania",
                summary: "Backend ⚙️",
                details: [
                        "Designed a Java SDK to abstract interaction with a fraud detection knowledge graph containing over 210 million relationships.",
                ],
                skills: ["Java (Programming Language)", "REST APIs"],
        },
];
