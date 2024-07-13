import {
	DiscordLogo,
	GithubLogo,
	LinkedinLogo,
	TwitterLogo,
	WhatsappLogo,
} from "@phosphor-icons/react"

export const SocialLinks = [
	{ href: "https://x.com/communitypro47", icon: TwitterLogo },
	{ href: "https://www.linkedin.com/company/communitypro/", icon: LinkedinLogo },
	{ href: "https://discord.gg/kn5sG8hqqc", icon: DiscordLogo },
	{ href: "https://github.com/Communitypro", icon: GithubLogo },
	{ href: "https://chat.whatsapp.com/BMFVTksMg269GdgsviJzLm", icon: WhatsappLogo },
]

export const FooterLinks = [
	{
		label: "teams",
		links: [
			{ href: "/teams/front-end", name: "frontend team" },
			{ href: "/teams/back-end", name: "backend team" },
			{ href: "/teams/design", name: "design team" },
		],
	},
	{
		label: "quick links",
		links: [
			{ href: "/about", name: "about" },
			{ href: "/projects", name: "projects" },
			{ href: "/testimonials", name: "testimonials" },
			{ href: "/blog", name: "blog" },
		],
	},
	{
		label: "resources",
		links: [
			{ href: "/faqs", name: "FAQs" },
			{ href: "/privacy", name: "privacy policy" },
			{ href: "/terms", name: "terms & conditions" },
		],
	},
]
