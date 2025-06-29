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
        prefix: 'dashboard',
        link: 'dashboard',
        icon: 'fa-solid fa-chart-line',
    },
    {
        label: "Study Group",
        prefix: 'study',
        link: 'study',
        icon: 'fa-solid fa-users',
    },
    {
        label: "Recommendations",
        prefix: 'recommendations',
        link: 'recommendations',
        icon: 'fa-solid fa-lightbulb',
    },
    {
        label: "Dynamic Rules",
        prefix: 'rules',
        link: 'rules',
        icon: 'fa-solid fa-sliders',
    },
    {
        label: "Questionnaires",
        prefix: 'questionnaires',
        link: 'questionnaires',
        icon: 'fa-solid fa-list-check',    
    },    
    {
        label: "Categories",
        prefix: 'categories',
        link: 'categories',
        icon: 'fa-solid fa-tags',
    },
    {
        label: "Notifications",
        prefix: 'notifications',
        link: 'notifications',
        icon: 'fa-solid fa-bell',
    },
    {
        label: "Send to Participants",
        prefix: 'sendtoparticipants',
        link: 'sendtoparticipants',
        icon: 'fa-solid fa-paper-plane',
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