export interface Job {
	dateRange: string;
	title: string;
	company: string;
	description: string;
}

export const jobs: Job[] = [
	{
		dateRange: "Sep 2025 - Dec 2025",
		title: "Software Engineering Intern, Infrastructure",
		company: "Super.com",
		description: "",
	},
	{
		dateRange: "Jan 2025 - May 2025",
		title: "Fullstack Software Engineering Intern",
		company: "Hamming AI (YC S24)",
		description: "Built dynamically generated IVR state machines for AI voice agent testing, directly leading to new customers. Investigated and fixed critical Redis concurrency issues, reducing call error rate by 85%. Automated frontend and backend tests using GitHub Actions and scheduled jobs to catch regressions in CI/CD. Enabled third-party voice agents to integrate with the Hamming platform, unlocking new customers.",
	},
	{
		dateRange: "Oct 2024 - Current",
		title: "Member",
		company: "Cohere For AI",
		description: "",
	},
	{
		dateRange: "Feb 2024 - Oct 2024",
		title: "Autonomous Software Developer",
		company: "WATonomous",
		description:
			"Trained and implemented a graph-based trajectory prediction model, leveraging the nuScenes dataset, to enhance our vehicle's autonomous navigation",
	},
	{
		dateRange: "May 2024 - Aug 2024",
		title: "Software Engineering Intern",
		company: "Carnegie Mellon University CyLab Biometrics Center",
		description:
			"Built a fully autonomous robot from ground up in a team of two to deliver groceries across the CMU campus. Engineered a ROS2 software stack integrating sensor fusion (EKF), AMCL/SLAM for localization, Hybrid A* for motion planning, and MPPI for control, achieving real-time, centimeter-level accurate navigation. Integrated Jetson Orin Nano, Lidar, RTK GPS, Depth Camera, IMU, and Arduino for precise navigation. Built AI checkout system using OpenCV to prevent retail theft by classifying 250K+ Walmart products",
	},
	{
		dateRange: "May 2023 - Jun 2023",
		title: "Data Science Intern",
		company: "MBR Technology",
		description:
			"Trained neural networks for image classification on public datasets like FashionMNIST and ImageNet. Trained CNN with transfer learning, achieving 96% accuracy using 7.7 million parameters",
	},
	{
		dateRange: "Jun 2022 - Aug 2022",
		title: "Software Engineer Intern",
		company: "Palturai",
		description:
			"Developed an interactive knowledge graph visualization tool and a custom language for tailored filtering, aesthetic control, and enhanced data display (RDF-Viewer). Scraped SEC filings, extracting relational data to serve as test cases for RDF-Viewer",
	},
	{
		dateRange: "Jun 2021 - Aug 2021",
		title: "Software Engineer Intern",
		company: "Palturai",
		description:
			"Designed Java SDK to abstract interaction with fraud detection graph database, handling 210M+ relationships",
	},
];