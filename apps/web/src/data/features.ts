export interface Feature {
    icon: string;
    title: string;
    description: string;
}

export const managementFeatures: Feature[] = [
    {
        icon: 'LayoutDashboard',
        title: 'Smart Dashboard',
        description: 'See your whole rental business at a glance. Real-time analytics on inventory, bookings, revenue, and team performance.',
    },
    {
        icon: 'Box',
        title: 'Inventory Control',
        description: 'Track every item with QR or barcode scanning. Set stock thresholds, receive low-inventory alerts, and manage variants effortlessly.',
    },
    {
        icon: 'Calendar',
        title: 'Booking Calendar',
        description: 'Drag-and-drop scheduling with conflict detection. Manage pickups, drop-offs, and maintenance blocks in one view.',
    },
    {
        icon: 'ClipboardList',
        title: 'Digital Contracts',
        description: 'Generate rental agreements with e-signature support. Store signed contracts securely and access them instantly from any device.',
    },
    {
        icon: 'Users',
        title: 'Client Management',
        description: 'Maintain a rich customer database with rental history, preferences, and communication logs. Send automated reminders and follow-ups.',
    },
    {
        icon: 'TrendingUp',
        title: 'Revenue Analytics',
        description: 'Understand profitability per item, category, and client. Forecast demand and optimize pricing with data-driven insights.',
    },
    {
        icon: 'MapPin',
        title: 'Multi-Location',
        description: 'Manage inventory across multiple warehouses, stores, or yards. Transfer stock between locations with full audit trails.',
    },
    {
        icon: 'Shield',
        title: 'Role-Based Access',
        description: 'Define custom permissions for staff, managers, and admins. Control who can view, edit, or approve rental operations.',
    },
    {
        icon: 'QrCode',
        title: 'QR & Barcode',
        description: 'Generate printable QR codes for every item. Scan to check in/out, view history, and update status in seconds.',
    },
    {
        icon: 'Link2',
        title: 'Integrations',
        description: 'Connect with payment gateways, accounting software, and your website. Open API for custom integrations.',
    },
];
