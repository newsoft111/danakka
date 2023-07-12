interface MenuItemsProps {
    id: number;
    novidade ?: any;
    label: string;
    icon ?: string;
    link ?: string;
    badge?:string;
    badgecolor?:string;
    subItems ?: any;
    isHeader ?: boolean
}

const menuItems: Array<MenuItemsProps> = [
    {
        id: 1,
        label: "Dashboards",
        isHeader : true
    },
    {
        id: 2,
        label: "Sales",
        icon: "monitor",
        link: "/sales",
        badge:"5+",
        badgecolor:"badge-soft-secondary"
    },
    {
        id: 139,
        label: "Analytics",
        icon: "pie-chart",
        link: "#"
    },
    {
        id: 3,
        label: "Applications",
        isHeader : true
    },
    {
        id: 4,
        label: "Calendar",
        icon: "calendar",
        link: "#"
    },
    {
        id: 5,
        label: "Chat",
        icon: "message-square",
        link: "#",
        badge:"Hot",
        badgecolor:"badge-soft-danger"
    },
    {
        id: 7,
        label: "File Manager",
        icon: "folder",
        link: "/#"
    },
    {
        id: 8,
        novidade: false,
        label: "Email",
        icon: "mail",
        link: "/#",
        subItems: [
            {
                id: 9,
                label: "Inbox",
                link: "#",
                parentId: 8
            },
            {
                id: 10,
                label: "Read Email",
                link: "#",
                parentId: 8
            }
        ]
    },
    {
        id: 11,
        novidade: false,
        label: "Contacts",
        icon: "book",
        link: "/#",
        subItems: [
            {
                id: 12,
                label: "User Grid",
                link: "#",
                parentId: 11
            },
            {
                id: 13,
                label: "User List",
                link: "#",
                parentId: 11
            },
            {
                id: 140,
                label: "User Settings",
                link: "#",
                parentId: 11
            }
        ]
    },
    {
        id: 14,
        label: "Gallery",
        icon: "image",
        link: "#"
    },
    {
        id: 15,
        novidade: false,
        label: "Projects",
        icon: "briefcase",
        link: "/#",
        subItems: [
            {
                id: 16,
                label: "Projects Grid",
                link: "#",
                parentId: 15
            },
            {
                id: 17,
                label: "Projects List",
                link: "#",
                parentId: 15
            },
            {
                id: 18,
                label: "Project Overview",
                link: "#",
                parentId: 15
            },
            {
                id: 19,
                label: "Create New",
                link: "#",
                parentId: 15
            }
        ]
    },
    {
        id: 21,
        label: "Pages",
        isHeader : true
    },
    {
        id: 22,
        novidade: false,
        label: "Authentication",
        icon: "user",
        link: "/#",
        badge:"9",
        badgecolor:"bg-info",
        subItems: [
            {
                id: 23,
                label: "Sign In",
                link: "/#",
                parentId: 22,
                subItems: [
                    {
                        id: 24,
                        label: "Basic",
                        link: "#",
                        parentId: 23
                    },
                    {
                        id: 26,
                        label: "Cover",
                        link: "#",
                        parentId: 23
                    }
                ]
            },
            {
                id: 27,
                label: "Sign Up",
                link: "/#",
                parentId: 22,
                subItems: [
                    {
                        id: 28,
                        label: "Basic",
                        link: "#",
                        parentId: 22
                    },
                    {
                        id: 29,
                        label: "Cover",
                        link: "#",
                        parentId: 22
                    }
                ]
            },
            {
                id: 30,
                label: "Sign Out",
                link: "/#",
                parentId: 22,
                subItems: [
                    {
                        id: 31,
                        label: "Basic",
                        link: "#",
                        parentId: 30
                    },
                    {
                        id: 32,
                        label: "Cover",
                        link: "#",
                        parentId: 30
                    }
                ]
            },
            {
                id: 33,
                label: "Lock Screen",
                link: "/#",
                parentId: 22,
                subItems: [
                    {
                        id: 34,
                        label: "Basic",
                        link: "#",
                        parentId: 33
                    },
                    {
                        id: 35,
                        label: "Cover",
                        link: "#",
                        parentId: 33
                    }
                ]
            },
            {
                id: 36,
                label: "Forgot Password",
                link: "/#",
                parentId: 22,
                subItems: [
                    {
                        id: 37,
                        label: "Basic",
                        link: "#",
                        parentId: 36
                    },
                    {
                        id: 38,
                        label: "Cover",
                        link: "#",
                        parentId: 36
                    }
                ]
            },
            {
                id: 39,
                label: "Reset Password",
                link: "/#",
                parentId: 22,
                subItems: [
                    {
                        id: 40,
                        label: "Basic",
                        link: "#",
                        parentId: 39
                    },
                    {
                        id: 41,
                        label: "Cover",
                        link: "#",
                        parentId: 39
                    }
                ]
            },
            {
                id: 42,
                label: "Email Verification",
                link: "/#",
                parentId: 22,
                subItems: [
                    {
                        id: 43,
                        label: "Basic",
                        link: "#",
                        parentId: 42
                    },
                    {
                        id: 44,
                        label: "Cover",
                        link: "#",
                        parentId: 42
                    }
                ]
            },
            {
                id: 45,
                label: "2-step Verification",
                link: "/#",
                parentId: 22,
                subItems: [
                    {
                        id: 46,
                        label: "Basic",
                        link: "#",
                        parentId: 45
                    },
                    {
                        id: 47,
                        label: "Cover",
                        link: "#",
                        parentId: 45
                    }
                ]
            },
            {
                id: 48,
                label: "Thank you",
                link: "/#",
                parentId: 22,
                subItems: [
                    {
                        id: 49,
                        label: "Basic",
                        link: "#",
                        parentId: 48
                    },
                    {
                        id: 50,
                        label: "Cover",
                        link: "#",
                        parentId: 48
                    }
                ]
            },
        ]
    },
    {
        id: 51,
        novidade: false,
        label: "Error Pages",
        icon: "alert-circle",
        link: "/#",
        subItems: [
            {
                id: 52,
                label: "404 Basic",
                link: "#",
                parentId: 51
            },
            {
                id: 53,
                label: "404 Cover",
                link: "#",
                parentId: 51
            },
            {
                id: 54,
                label: "500 Basic",
                link: "#",
                parentId: 51
            },
            {
                id: 55,
                label: "500 Cover",
                link: "#",
                parentId: 51
            },
        ]
    },
    {
        id: 56,
        novidade: false,
        label: "Utility",
        icon: "file-text",
        link: "/#",
        subItems: [
            {
                id: 57,
                label: "Starter Page",
                link: "#",
                parentId: 56
            },
            {
                id: 58,
                label: "Profile",
                link: "#",
                parentId: 56
            },
            {
                id: 59,
                label: "Maintenance",
                link: "#",
                parentId: 56
            },
            {
                id: 60,
                label: "Coming Soon",
                link: "#",
                parentId: 56
            },
            {
                id: 61,
                label: "FAQs",
                link: "#",
                parentId: 56
            },
        ]
    },
    {
        id: 62,
        novidade: false,
        label: "Pricing",
        icon: "tag",
        link: "/#",
        subItems: [
            {
                id: 63,
                label: "Basic",
                link: "#",
                parentId: 62
            },
            {
                id: 64,
                label: "Table",
                link: "#",
                parentId: 62
            },
        ]
    },
    {
        id: 65,
        novidade: false,
        label: "Invoices",
        icon: "file",
        link: "/#",
        subItems: [
            {
                id: 66,
                label: "Invoice List",
                link: "#",
                parentId: 65
            },
            {
                id: 67,
                label: "Invoice Detail",
                link: "#",
                parentId: 65
            },
        ]
    },
    {
        id: 68,
        novidade: false,
        label: "Timeline",
        icon: "award",
        link: "/#",
        subItems: [
            {
                id: 69,
                label: "Center View",
                link: "#",
                parentId: 68
            },
            {
                id: 70,
                label: "Left View",
                link: "#",
                parentId: 68
            },
            {
                id: 71,
                label: "Horizontal View",
                link: "#",
                parentId: 68
            },
        ]
    },
    {
        id: 72,
        label: "Components",
        isHeader : true
    },
    {
        id: 73,
        novidade: false,
        label: "UI Elements",
        icon: "package",
        link: "/#",
        subItems: [
            {
                id: 74,
                label: "Alerts",
                link: "#",
                parentId: 73
            },
            {
                id: 75,
                label: "Buttons",
                link: "#",
                parentId: 73
            },
            {
                id: 76,
                label: "Cards",
                link: "#",
                parentId: 73
            },
            {
                id: 77,
                label: "Carousel",
                link: "#",
                parentId: 73
            },
            {
                id: 78,
                label: "Dropdowns",
                link: "#",
                parentId: 73
            },
            {
                id: 79,
                label: "Grid",
                link: "#",
                parentId: 73
            },
            {
                id: 80,
                label: "Images",
                link: "#",
                parentId: 73
            },
            {
                id: 81,
                label: "Modals",
                link: "#",
                parentId: 73
            },
            {
                id: 150,
                label: "Placeholders",
                link: "#",
                parentId: 73
            },
            {
                id: 83,
                label: "Progress Bars",
                link: "#",
                parentId: 73
            },
            {
                id: 84,
                label: "Tabs & Accordions",
                link: "#",
                parentId: 73
            },
            {
                id: 85,
                label: "Typography",
                link: "#",
                parentId: 73
            },
            {
                id: 86,
                label: "Video",
                link: "#",
                parentId: 73
            },
            {
                id: 87,
                label: "General",
                link: "#",
                parentId: 73
            },
            {
                id: 88,
                label: "Colors",
                link: "#",
                parentId: 73
            },
            {
                id: 89,
                label: "Utilities",
                link: "#",
                parentId: 73
            },
        ]
    },
    {
        id: 90,
        novidade: false,
        label: "Extended UI",
        icon: "cpu",
        link: "/#",
        subItems: [
            {
                id: 91,
                label: "Lightbox",
                link: "#",
                parentId: 90
            },
            {
                id: 92,
                label: "Range Slider",
                link: "#",
                parentId: 90
            },
            {
                id: 94,
                label: "Rating",
                link: "#",
                parentId: 90
            },
            {
                id: 95,
                label: "Notifications",
                link: "#",
                parentId: 90
            },
            {
                id: 96,
                label: "Swiper Slider",
                link: "#",
                parentId: 90
            },
        ]
    },
    {
        id: 97,
        label: "Widgets",
        icon: "grid",
        link: "#",
    },
    {
        id: 98,
        novidade: false,
        label: "Forms",
        icon: "edit-3",
        link: "/#",
        subItems: [
            {
                id: 99,
                label: "Basic Elements",
                link: "#",
                parentId: 98
            },
            {
                id: 100,
                label: "Validation",
                link: "#",
                parentId: 98
            },
            {
                id: 101,
                label: "Advanced Plugins",
                link: "#",
                parentId: 98
            },
            {
                id: 102,
                label: "Editors",
                link: "#",
                parentId: 98
            },
            {
                id: 103,
                label: "File Upload",
                link: "#",
                parentId: 98
            },
            {
                id: 104,
                label: "Wizard",
                link: "#",
                parentId: 98
            },
            {
                id: 105,
                label: "Mask",
                link: "#",
                parentId: 98
            },
        ]
    },
    {
        id: 106,
        novidade: false,
        label: "Tables",
        icon: "database",
        link: "/#",
        subItems: [
            {
                id: 107,
                label: "Bootstrap Basic",
                link: "#",
                parentId: 106
            },
            {
                id: 108,
                label: "Advance Tables",
                link: "#",
                parentId: 106
            },
        ]
    },
    {
        id: 107,
        novidade: false,
        label: "Apex Charts",
        icon: "bar-chart-2",
        link: "/#",
        subItems: [
            {
                id: 108,
                label: "Line",
                link: "#",
                parentId: 107
            },
            {
                id: 109,
                label: "Area",
                link: "#",
                parentId: 107
            },
            {
                id: 110,
                label: "Column",
                link: "#",
                parentId: 107
            },
            {
                id: 111,
                label: "Bar",
                link: "#",
                parentId: 107
            },
            {
                id: 112,
                label: "Mixed",
                link: "#",
                parentId: 107
            },
            {
                id: 113,
                label: "Timeline",
                link: "#",
                parentId: 107
            },
            {
                id: 114,
                label: "Candlestick",
                link: "#",
                parentId: 107
            },
            {
                id: 115,
                label: "Boxplot",
                link: "#",
                parentId: 107
            },
            {
                id: 116,
                label: "Bubble",
                link: "#",
                parentId: 107
            },
            {
                id: 117,
                label: "Scatter",
                link: "#",
                parentId: 107
            },
            {
                id: 118,
                label: "Heatmap",
                link: "#",
                parentId: 107
            },
            {
                id: 119,
                label: "Treemap",
                link: "#",
                parentId: 107
            },
            {
                id: 120,
                label: "Pie",
                link: "#",
                parentId: 107
            },
            {
                id: 121,
                label: "Radialbar",
                link: "#",
                parentId: 107
            },
            {
                id: 122,
                label: "Radar",
                link: "#",
                parentId: 107
            },
            {
                id: 123,
                label: "Polararea",
                link: "#",
                parentId: 107
            },

        ]
    },
    {
        id: 124,
        novidade: false,
        label: "Icons",
        icon: "archive",
        link: "/#",
        subItems: [
            {
                id: 125,
                label: "Unicons",
                link: "#",
                parentId: 124
            },
            {
                id: 126,
                label: "Feather icons",
                link: "#",
                parentId: 124
            },
            {
                id: 127,
                label: "Boxicons",
                link: "#",
                parentId: 124
            },
            {
                id: 128,
                label: "Material Design",
                link: "#",
                parentId: 124
            },
            {
                id: 129,
                label: "Font Awesome 5",
                link: "#",
                parentId: 124
            },
        ]
    },
    {
        id: 130,
        novidade: false,
        label: "Maps",
        icon: "map-pin",
        link: "/#",
        subItems: [
            {
                id: 131,
                label: "Google",
                link: "#",
                parentId: 130
            },
            {
                id: 132,
                label: "Vector",
                link: "#",
                parentId: 130
            },
            {
                id: 133,
                label: "Leaflet",
                link: "#",
                parentId: 130
            },
        ]
    },
    {
        id: 134,
        novidade: false,
        label: "Multi Level",
        icon: "share-2",
        link: "/#",
        subItems: [
            {
                id: 135,
                label: "Level 1.1",
                link: "/#",
                parentId: 134
            },
            {
                id: 136,
                label: "Level 1.2",
                link: "/#",
                parentId: 134,
                subItems: [
                    {
                        id: 137,
                        label: "Level 2.1",
                        link: "/#",
                        parentId: 136
                    },
                    {
                        id: 138,
                        label: "Level 2.2",
                        link: "/#",
                        parentId: 136
                    }
                ]
            }
        ]
    },
];

export { menuItems };
