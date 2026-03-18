# **App Name**: ServiGo One

## Core Features:

- Dashboard Analytics Overview: Display key HR performance indicators (KPIs) and data trends using soft-UI styled cards and interactive charts as specified in the design system.
- Data Filtering & Interactivity: Enable users to filter analytics data by date ranges, departments, and other criteria with neumorphic-styled buttons and tags for dynamic insights.
- Detailed Report View: Present in-depth HR reports and data tables within visually appealing, radius-bound cards, reflecting the design system's typography and data label guidelines.
- AI Insight Generation Tool: Automatically analyze displayed metrics and generate natural language summaries of key observations, anomalies, or future trend predictions to aid HR decision-making.
- Secure User Authentication: Implement a login/logout system to ensure authorized access to sensitive HR analytics data.
- Responsive Layout & Navigation: Ensure the dashboard adheres to the 12-column-responsive grid system, providing a seamless user experience across various devices with a compact header.
- Data Import Capability: Allow administrators to securely upload HR datasets, potentially via CSV, to populate or update the analytics database.

## Style Guidelines:

- Primary color: A sophisticated, deep muted bluish-grey (#3D454D) that establishes a professional and clear tone, ideal for 'HR Analytics' branding elements and strong textual contrasts.
- Background color: A very light, near-white cool grey (#F6F7F8) providing a subtle, expansive canvas for the Soft UI and Neumorphism Light aesthetic.
- Accent color: A vibrant cyan-blue (#1395A3) to highlight critical data points, interactive elements, and draw attention to insights, aligning with the design system's contemporary feel.
- Brand-specific colors: A vibrant magenta (#E91E63, for --primary-magenta) and a complementary deep cyan (#0097A7, for --primary-cyan) are integrated from the provided design system to serve as high-impact accents for status indicators, active states, and brand recognition within the overall soft aesthetic. The main application background will be --bg-main: #F0F2F5. For Neumorphic 'double shadows' and a tactile relief effect, the '--card-shadow-light' is set to a subtle, soft white at rgba(255, 255, 255, 0.7) for highlights, and '--card-shadow-dark' uses a gentle, derived dark grey at rgba(228, 230, 232, 0.6) for depth.
- The primary font stack 'Segoe UI, Roboto, Helvetica, Arial, sans-serif' will be used universally for legibility and a modern, platform-native aesthetic in alignment with the design system. Specific hierarchical styles will be applied for KPIs ('28px', 'bold'), card titles ('14px', '600', 'uppercase'), data labels ('12px', 'normal'), and filter tags ('11px', 'bold'). Note: currently only Google Fonts are supported.
- Minimalist Line Art icons will be employed to maintain a clean, uncluttered interface that enhances data clarity. Tooltips will feature soft rounded corners as specified in the design system for a cohesive user experience.
- The application leverages a robust 12-column-responsive grid system, an 8px spacing unit, and a compact_high header density for consistent layout and adaptability across all devices. A visual hierarchy ensures a logical flow from global filters and a row of high-level KPI donut charts to the main body containing mixed-width cards, and left-aligned quick-action/status panels, reflecting the 'Modern HR Analytics Soft-UI' design.
- Subtle transition animations on hover and active states for interactive elements (like buttons and cards) will provide a soft-press or gentle elevation effect, enhancing tactile feedback consistent with the Neumorphism Light visual style.