// 友情链接数据配置
// 用于管理友情链接页面的数据

export interface FriendItem {
	id: number;
	title: string;
	imgurl: string;
	desc: string;
	siteurl: string;
	tags: string[];
}

// 友情链接数据
export const friendsData: FriendItem[] = [
	{
		id: 1,
		title: "Compiler Explorer",
		imgurl: "https://favicon.im/godbolt.org",
		desc: "在线编译器",
		siteurl: "https://godbolt.org",
		tags: ["开发"],
	},
	{
		id: 2,
		title: "cppreference",
		imgurl: "https://favicon.im/cppreference.com",
		desc: "高质量 ISO C++ 文档。",
		siteurl: "https://cppreference.com",
		tags: ["开发", "C++"],
	},
	{
		id: 3,
		title: "CTF Wiki",
		imgurl: "https://favicon.im/ctf-wiki.org",
		desc: "全面的 CTF 竞赛 Wiki。",
		siteurl: "https://ctf-wiki.org",
		tags: ["Wiki", "CTF", "竞赛"],
	},
	{
		id: 4,
		title: "OI Wiki",
		imgurl: "https://favicon.im/oi-wiki.org",
		desc: "全面的算法竞赛 Wiki。",
		siteurl: "https://oi-wiki.org",
		tags: ["Wiki", "OI", "竞赛"],
	},
	{
		id: 5,
		title: "星梦之地",
		imgurl: "https://favicon.im/hoshino.fan",
		desc: "一个普通的小鸟游星野同人作品发布与转载站。",
		siteurl: "https://hoshino.fan",
		tags: ["蔚蓝档案", "小鸟游星野", "同人"],
	},
	{
		id: 6,
		title: "星影の博客",
		imgurl: "https://favicon.im/xingying.us.kg",
		desc: "一切奇迹の始发点。",
		siteurl: "https://xingying.us.kg",
		tags: ["技术", "桌面应用"],
	},
	{
		id: 7,
		title: "Peter267",
		imgurl: "https://favicon.im/peter267.github.io",
		desc: "无限进步。",
		siteurl: "https://peter267.github.io",
		tags: ["技术", "生活"],
	},
	{
		id: 8,
		title: "严千屹",
		imgurl: "https://favicon.im/blog.qianyios.top",
		desc: "一个简简单单的云计算运维博客。",
		siteurl: "https://blog.qianyios.top",
		tags: ["技术", "云计算"],
	},
	{
		id: 9,
		title: "wallleap",
		imgurl: "https://favicon.im/myblog.wallleap.cn",
		desc: "Luwang's blog。",
		siteurl: "https://myblog.wallleap.cn",
		tags: ["技术"],
	},
];

// 获取所有友情链接数据
export function getFriendsList(): FriendItem[] {
	return friendsData;
}

// 获取随机排序的友情链接数据
export function getShuffledFriendsList(): FriendItem[] {
	const shuffled = [...friendsData];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
