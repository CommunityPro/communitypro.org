interface RouteConfig {
  name: string;
  href: string;
  disabled?: boolean;
  target?: string;
}

interface SectionConfig {
  name: string;
  routes: RouteConfig[];
}

export const HEADER_ROUTES: RouteConfig[] = [
  { href: "/", name: "Discover" },
  { href: "/learn", name: "Learn" },
  { href: "/events", name: "Events" },
  { href: "/sponsors", name: "Sponsors" },
];

export const FOOTER_ROUTES: SectionConfig[] = [
  {
    name: "Community",
    routes: [
      { href: "/about", name: "About" },
      { href: "/events", name: "Events" },
      { href: "/top-contributors", name: "Top Contributors" },
      { href: "/sponsors", name: "Sponsors" },
      { href: "/contact", name: "Contact" },
      { href: "/faq", name: "FAQ" },
    ],
  },
  {
    name: "Resources",
    routes: [
      { href: "/blog", name: "Blog" },
      { href: "/learn", name: "Learn" },
      { href: "/community", name: "Community" },
      { href: "/e-library", name: "e-Library" },
    ],
  },
  {
    name: "Social",
    routes: [
      { href: "https://github.com/communitypro", name: "GitHub", target: "_blank" },
      { href: "https://x.com/communitypro47", name: "Twitter", target: "_blank" },
      { href: "https://chat.whatsapp.com/BMFVTksMg269GdgsviJzLm", name: "WhatsApp", target: "_blank" },
      { href: "https://linkedin.com/", name: "LinkedIn", target: "_blank" },
      { href: "https://are.na", name: "Are.na", target: "_blank" },
    ],
  },
];
