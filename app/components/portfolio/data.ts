export type Tool = { name: string; src: string };

export type ToolGroup = { title: string; tools: Tool[] };

export type WorkCategory = { title: string; images: string[] };

export const highlights = [
  { value: "8+", label: "years of experience" },
  { value: "24/7", label: "support mindset" },
  { value: "100%", label: "detail focused" },
];

export const toolGroups: ToolGroup[] = [
  {
    title: "Business systems",
    tools: [
      { name: "SAP Business One", src: "/logo/business systems/sap-business-one.png" },
      { name: "QuickBooks", src: "/logo/business systems/quickbooks.png" },
      { name: "Monday.com", src: "/logo/business systems/monday-com.png" },
      { name: "Microsoft Dynamics 365 Business Central", src: "/logo/business systems/microsoft-dynamics-365-business-central.png" },
      { name: "Epicor Kinetic", src: "/logo/business systems/epicor-kinetic.png" },
      { name: "Odoo", src: "/logo/business systems/odoo.png" },
      { name: "Microsoft Copilot", src: "/logo/business systems/microsoft-copilot.png" },
      { name: "GoHighLevel", src: "/logo/business systems/gohighlevel.png" },
      { name: "Oracle NetSuite", src: "/logo/business systems/oracle-netsuite.png" },
      { name: "UI.Vision", src: "/logo/business systems/ui-vision.png" },
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
      { name: "FileZilla", src: "/logo/web dev/filezilla.png" },
      { name: "PHP 7", src: "/logo/web dev/php-7.png" },
      { name: "XAMPP", src: "/logo/web dev/xampp.png" },
      { name: "JavaScript", src: "/logo/web dev/javascript.png" },
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
      { name: "SQL", src: "/logo/database apps/sql.png" },
      { name: "MySQL", src: "/logo/database apps/mysql.png" },
      { name: "SAP Crystal Reports", src: "/logo/database apps/sap-crystal-reports.png" },
      { name: "Microsoft Power BI", src: "/logo/database apps/microsoft-power-bi.png" },
    ],
  },
];

export const services = [
  [
    "Operations support",
    "Process Coordination",
    "Documentation",
    "Reporting",
    "Data Management",
  ],
  [
    "Technical support",
    "WordPress",
    "Website troubleshooting",
    "DNS & Cloudflare",
    "cPanel",
  ],
  [
    "Administrative support",
    "Email Management",
    "Calendar Management",
    "Research",
    "File Organization",
  ],
  [
    "Project management",
    "Task Coordination",
    "Client Communication",
    "Progress Tracking",
    "SOP Implementation",
  ],
];

export const workCategories: WorkCategory[] = [
  {
    title: "Web Applications & Website",
    images: [
      "/sample-works/web-app/Rectangle 48.png",
      "/sample-works/web-app/Rectangle 49.png",
      "/sample-works/web-app/Rectangle 50.png",
      "/sample-works/web-app/Rectangle 51.png",
    ],
  },
  {
    title: "Go High Level",
    images: [
      "/sample-works/gohighlevel/Rectangle 52.png",
      "/sample-works/gohighlevel/Rectangle 53.png",
    ],
  },
  {
    title: "Automation with Power Automate & UI.Vision",
    images: [
      "/sample-works/powerautomate-uivision/Rectangle 54.png",
      "/sample-works/powerautomate-uivision/Rectangle 63.png",
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
