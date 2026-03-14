// Timeline data configuration file
// Used to manage data for the timeline page

export interface TimelineItem {
	id: string;
	title: string;
	description: string;
	type: "education" | "work" | "project" | "achievement";
	startDate: string;
	endDate?: string; // If empty, it means current
	location?: string;
	organization?: string;
	position?: string;
	skills?: string[];
	achievements?: string[];
	links?: {
		name: string;
		url: string;
		type: "website" | "certificate" | "project" | "other";
	}[];
	icon?: string; // Iconify icon name
	color?: string;
	featured?: boolean;
}

export const timelineData: TimelineItem[] = [
	{
		id: "refactor-blog",
		title: "重构博客",
		description: "尝试将原来的博客迁移到 Astro 上。",
		type: "project",
		startDate: "2026-02-28",
		skills: ["Astro", "TypeScript"],
		achievements: ["初步了解现代 Web 开发。"],
		icon: "material-symbols:code",
		color: "#7C3AED",
		featured: true,
	},
	{
		id: "create-blog",
		title: "建立博客",
		description: "使用 Gmeek 搭建了自己的第一个博客。",
		type: "project",
		startDate: "2024-06-20",
		endDate: "2026-02-28",
		skills: ["HTML", "CSS", "JavaScript"],
		achievements: [
			"了解了 Web 开发的基本概念。",
			"渐渐养成了分享研究成果的习惯。",
		],
		icon: "material-symbols:code",
		color: "#7C3AED",
		featured: true,
	},
	{
		id: "scltk",
		title: "开始开发 SCLTK",
		description:
			"针对同学痛点，开始使用 C++ 开发 Student Computer Lab Toolkit。",
		type: "project",
		startDate: "2023-12-23",
		endDate: "2023-12-15",
		skills: ["C++", "Windows API"],
		achievements: [
			"了解了各种开源协议。",
			"熟悉了 GitHub 的使用。",
			"开始养成开源精神。",
		],
		icon: "material-symbols:code",
		color: "#7C3AED",
		featured: true,
	},
	{
		id: "start-learning-cpp",
		title: "开始学习 C++",
		description: "经过一个月的学习，大致掌握了 C 语言，开始学习 C++。",
		type: "education",
		startDate: "2023-06-25",
		endDate: "2023-07-21",
		skills: ["C++", "面向对象编程"],
		achievements: [
			"编写了简单的 CLI 实用工具。",
			"了解了面向对象编程的基本思想。",
			"开始对 C++ 产生浓厚兴趣。",
		],
		icon: "material-symbols:code",
		color: "#7C3AED",
	},
	{
		id: "first-programming-experience",
		title: "第一次的编程体验",
		description: "第一次在父母的老旧电脑上学习 C 语言。",
		type: "education",
		startDate: "2023-05-10",
		endDate: "2023-06-25",
		skills: ["C", "基本编程概念"],
		achievements: [
			'完成 "Hello World" 程序。',
			"了解了 C 语言基本思想。",
			"开始对编程产生兴趣。",
		],
		icon: "material-symbols:code",
		color: "#7C3AED",
	},
];

// Get timeline statistics
export const getTimelineStats = () => {
	const total = timelineData.length;
	const byType = {
		education: timelineData.filter((item) => item.type === "education")
			.length,
		work: timelineData.filter((item) => item.type === "work").length,
		project: timelineData.filter((item) => item.type === "project").length,
		achievement: timelineData.filter((item) => item.type === "achievement")
			.length,
	};

	return { total, byType };
};

// Get timeline items by type
export const getTimelineByType = (type?: string) => {
	if (!type || type === "all") {
		return timelineData.sort(
			(a, b) =>
				new Date(b.startDate).getTime() -
				new Date(a.startDate).getTime(),
		);
	}
	return timelineData
		.filter((item) => item.type === type)
		.sort(
			(a, b) =>
				new Date(b.startDate).getTime() -
				new Date(a.startDate).getTime(),
		);
};

// Get featured timeline items
export const getFeaturedTimeline = () => {
	return timelineData
		.filter((item) => item.featured)
		.sort(
			(a, b) =>
				new Date(b.startDate).getTime() -
				new Date(a.startDate).getTime(),
		);
};

// Get current ongoing items
export const getCurrentItems = () => {
	return timelineData.filter((item) => !item.endDate);
};

// Calculate total work experience
export const getTotalWorkExperience = () => {
	const workItems = timelineData.filter((item) => item.type === "work");
	let totalMonths = 0;

	workItems.forEach((item) => {
		const startDate = new Date(item.startDate);
		const endDate = item.endDate ? new Date(item.endDate) : new Date();
		const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
		const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
		totalMonths += diffMonths;
	});

	return {
		years: Math.floor(totalMonths / 12),
		months: totalMonths % 12,
	};
};
