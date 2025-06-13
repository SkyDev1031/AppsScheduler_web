import { IMAGES } from "../assets";
export const NavKeys = {
    logout: "logout",
    connect_wallet: 'connect_wallet',
    run_binary_payout: 'run_binary_payout',
    non_referral_signup: 'non_referral_signup',
};

export const UserNavbar = [
    {
        label: "Dashboard",
        link: 'dashboard',
        icon: 'fa-solid fa-chart-line', // Font Awesome icon for Dashboard
    },
    {
        label: "Study Group",
        link: 'study',
        icon: 'fa-solid fa-users', // Font Awesome icon for Study Group
    },
    {
        label: "Categories",
        link: 'categories',
        icon: 'fa-solid fa-tags',
    },
    {
        label: "Notifications",
        link: 'notifications',
        icon: 'fa-solid fa-bell',
    },
    {
        label: "Send to Participants",
        link: 'sendtoparticipants',
        icon: 'fa-solid fa-paper-plane',
    },
    {
        label: "Recommendations",
        link: 'recommendations',
        icon: 'fa-solid fa-lightbulb', // Lightbulb represents ideas or suggestions
    },
    {
        label: "Questionnaires",
        link: 'questionnaires',
        icon: 'fa-solid fa-list-check', // Checklist icon represents forms or questionnaires
    },
    
    
    // {
    //     label: "Packages",
    //     prefix: 'packages',
    //     icon: IMAGES.ic_package,
    //     hide: true,
    //     items: [
    //         { link: '', label: "Packages" },
    //         { link: '/renew-transfer', label: "View Purchased Packages" },
    //         { link: '/transfers', label: "Package Transfers" },
    //     ]
    // },
];

export const AdminNavbar = [
    {
        label: "Dashboard",
        link: 'dashboard',
        icon: 'fa-solid fa-chart-line', // Font Awesome icon for Dashboard
    },
    {
        label: "User Management",
        link: 'users',
        icon: 'fa-solid fa-user-group', // Font Awesome icon for User Management
    },
    {
        label: "Participants",
        link: 'participants',
        icon: 'fa-solid fa-user-check', // Font Awesome icon for Participants
    },
    {
        label: "Report App Usage",
        prefix: 'reportApp',
        icon: 'fa-solid fa-mobile-screen-button', // Font Awesome icon for App Usage Report
    },
    {
        label: "Report Phone Usage",
        prefix: 'reportPhone',
        icon: 'fa-solid fa-phone', // Font Awesome icon for Phone Usage Report
    },
];

export const AdminProfileItem = [
    {
        label: "Profile",
        link: 'profile',
        icon: 'fa-solid fa-user', // Font Awesome icon for Profile
    },
    {
        label: "Settings",
        link: 'settings',
        icon: 'fa-solid fa-cog', // Font Awesome icon for Settings
    },
    {
        label: "Network Settings",
        link: 'network-settings',
        icon: 'fa-solid fa-network-wired', // Font Awesome icon for Network Settings
    },
];