export type Tool = { name: string; src: string };

export type ToolGroup = { title: string; tools: Tool[] };

export type WorkImage = { src: string; alt: string };

export type WorkCategory = {
  title: string;
  description: string;
  images: WorkImage[];
};

export type Service = { title: string; items: string[] };

export type Experience = { role: string; detail: string; items: string[] };

export type NavLink = { name: string; href: string };

/**
 * Single source of truth for personal details. Every section, the footer,
 * the metadata, and the social-share image read from here, so a change
 * to a name, email, or link only needs to be made once.
 */
export const profile = {
  firstName: "John",
  lastName: "Reden",
  fullName: "John Reden Gavieta",
  surname: "Gavieta",
  legalName: "John Reden C. Gavieta",
  role: "Operations & Systems Specialist",
  tagline:
    "Helping businesses streamline operations, optimize systems, and build efficient workflows that drive sustainable growth.",
  summary:
    "Operations & Systems Specialist with 8+ years of experience in operations, project management, technical support, and virtual assistance.",
  email: "jrgavieta.personal@gmail.com",
  emailSubject: "Project inquiry from your portfolio",
  location: "Philippines",
  linkedin: {
    label: "John Reden Gavieta",
    href: "https://www.linkedin.com/in/john-reden-gavieta-8288a9240/",
  },
  onlineJobs: {
    label: "onlinejobs.ph/jobseekers/info/3478596",
    href: "https://www.onlinejobs.ph/jobseekers/info/3478596",
  },
  portrait: "/john-reden-portrait.png",
} as const;

export const mailtoHref = `mailto:${profile.email}?subject=${encodeURIComponent(
  profile.emailSubject,
)}`;

export const navLinks: NavLink[] = [
  { name: "About", href: "#about" },
  { name: "Expertise", href: "#expertise" },
  { name: "Services", href: "#services" },
  { name: "Work", href: "#projects" },
];

export const contactLink: NavLink = { name: "Contact", href: "#contact" };

export const education = {
  years: "2013–2017",
  degree: "Bachelor of Science in Information Technology",
  school: "Binalbagan Catholic College",
};

export const experience: Experience[] = [
  {
    role: "Regional Branch Manager",
    detail: "Led daily branch operations, team coordination, and execution.",
    items: [
      "Led branch operations",
      "Managed teams",
      "Improved workflows",
      "Oversaw projects",
    ],
  },
  {
    role: "Software Project Manager",
    detail:
      "Built database systems, managed delivery timelines, and supported risk management.",
    items: [
      "Database build-IP",
      "Created project timelines",
      "Database disaster risk management",
      "User training",
      "Managed system implementation",
    ],
  },
  {
    role: "Virtual Assistant",
    detail:
      "Managed WordPress websites, maintenance tasks, and content publishing.",
    items: [
      "WordPress management",
      "Website maintenance",
      "AI-assisted content publishing",
      "Technical support",
      "Administrative support",
    ],
  },
];

export const toolGroups: ToolGroup[] = [
  {
    title: "Business systems",
    tools: [
      { name: "SAP Business One", src: "/logo/business-systems/sap-business-one.png" },
      { name: "QuickBooks", src: "/logo/business-systems/quickbooks.png" },
      { name: "Xero", src: "/logo/business-systems/xero.png" },
      { name: "Monday.com", src: "/logo/business-systems/monday-com.png" },
      {
        name: "Microsoft Dynamics 365 Business Central",
        src: "/logo/business-systems/microsoft-dynamics-365-business-central.png",
      },
      { name: "Epicor Kinetic", src: "/logo/business-systems/epicor-kinetic.png" },
      { name: "Odoo", src: "/logo/business-systems/odoo.png" },
      { name: "Microsoft Copilot", src: "/logo/business-systems/microsoft-copilot.png" },
      { name: "GoHighLevel", src: "/logo/business-systems/gohighlevel.png" },
      { name: "Oracle NetSuite", src: "/logo/business-systems/oracle-netsuite.png" },
      { name: "UI.Vision", src: "/logo/business-systems/ui-vision.png" },
    ],
  },
  {
    title: "Productivity",
    tools: [
      { name: "Google Workspace", src: "/logo/productivity/google-workspace.png" },
      { name: "Microsoft Office", src: "/logo/productivity/microsoft-office.png" },
      { name: "Microsoft Excel", src: "/logo/productivity/microsoft-excel.png" },
      { name: "Slack", src: "/logo/productivity/slack.png" },
      { name: "ChatGPT", src: "/logo/productivity/chatgpt.png" },
      { name: "Google Sheets", src: "/logo/productivity/google-sheets.png" },
    ],
  },
  {
    title: "Web app development",
    tools: [
      { name: "FileZilla", src: "/logo/web-development/filezilla.png" },
      { name: "PHP 7", src: "/logo/web-development/php-7.png" },
      { name: "XAMPP", src: "/logo/web-development/xampp.png" },
      { name: "JavaScript", src: "/logo/web-development/javascript.png" },
    ],
  },
  {
    title: "Website",
    tools: [
      { name: "WordPress", src: "/logo/website/wordpress.png" },
      { name: "Elementor", src: "/logo/website/elementor.png" },
      { name: "cPanel", src: "/logo/website/cpanel.png" },
      { name: "Cloudflare", src: "/logo/website/cloudflare.png" },
    ],
  },
  {
    title: "Database & report",
    tools: [
      { name: "SQL", src: "/logo/database-reporting/sql.png" },
      { name: "MySQL", src: "/logo/database-reporting/mysql.png" },
      { name: "SAP Crystal Reports", src: "/logo/database-reporting/sap-crystal-reports.png" },
      { name: "Microsoft Power BI", src: "/logo/database-reporting/microsoft-power-bi.png" },
    ],
  },
];

const businessSystemsCount = toolGroups[0].tools.length;
const toolCount = toolGroups.reduce((total, group) => total + group.tools.length, 0);

export const highlights = [
  { value: "8+", label: "years of experience" },
  { value: String(businessSystemsCount), label: "business systems" },
  { value: String(toolCount), label: "tools & platforms" },
];

export const services: Service[] = [
  {
    title: "Operations support",
    items: [
      "Process Coordination",
      "Documentation",
      "Reporting",
      "Data Management",
    ],
  },
  {
    title: "Technical support",
    items: [
      "WordPress",
      "Website troubleshooting",
      "DNS & Cloudflare",
      "cPanel",
    ],
  },
  {
    title: "Administrative support",
    items: [
      "Email Management",
      "Calendar Management",
      "Research",
      "File Organization",
    ],
  },
  {
    title: "Project management",
    items: [
      "Task Coordination",
      "Client Communication",
      "Progress Tracking",
      "SOP Implementation",
    ],
  },
];

export const workCategories: WorkCategory[] = [
  {
    title: "Web Applications & Website",
    description:
      "Custom web applications and WordPress websites built with PHP, MySQL, JavaScript, and Elementor.",
    images: [
      {
        src: "/sample-works/web-app/web-app-01.png",
        alt: "Product listing page of a custom dealership web application showing vehicle models and key features",
      },
      {
        src: "/sample-works/web-app/web-app-02.png",
        alt: "Pipeline details board in a custom web application with Inquiry, Buying, and On Process columns",
      },
      {
        src: "/sample-works/web-app/web-app-03.png",
        alt: "WordPress website home page for a holistic organizer business with a call-to-action banner",
      },
    ],
  },
  {
    title: "GoHighLevel",
    description:
      "CRM pipelines, email templates, and automation workflows configured inside GoHighLevel.",
    images: [
      {
        src: "/sample-works/gohighlevel/gohighlevel-01.png",
        alt: "GoHighLevel email template editor with a prospect follow-up campaign",
      },
      {
        src: "/sample-works/gohighlevel/gohighlevel-02.png",
        alt: "GoHighLevel workflow builder showing prospect pipeline automations",
      },
    ],
  },
  {
    title: "Automation with Power Automate & UI.Vision",
    description:
      "Browser and desktop automations that remove repetitive manual steps from daily operations.",
    images: [
      {
        src: "/sample-works/automation/automation-01.png",
        alt: "UI.Vision macro editor with XPath commands and execution logs",
      },
      {
        src: "/sample-works/automation/automation-02.png",
        alt: "Power Automate Desktop flow that launches Chrome and loops through web page actions",
      },
      {
        src: "/sample-works/automation/automation-03.png",
        alt: "Power Automate Desktop flow built from recorded browser actions",
      },
    ],
  },
];

export const whyItems = [
  "8+ years of experience",
  "Reliable and proactive",
  "Operations-focused mindset",
  "Excellent communicator",
  "Strong technical background",
  "Able to work independently",
  "Detail-oriented",
  "Fast learner",
];
