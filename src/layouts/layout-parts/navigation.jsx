  // CUSTOM ICON COMPONENT
  import duotone from "@/icons/duotone";

  export const roleWiseRouteAccess = [
    {
      roleName: "care_home",
      routeAccess: [
        "/dashboard",
        "/dashboard/add-patient",
        "/dashboard/patient-list",
        "/dashboard/schedule-call-list",
        "/dashboard/schedule-call",
        "/dashboard/call-details",
        "/dashboard/profile",
        "/dashboard/account",
      ],
    },
    {
      roleName: "patient",
      routeAccess: [
        "/dashboard",
        "/dashboard/schedule-call-list",
        "/dashboard/call-details",
        // "/dashboard/profile",
        "/dashboard/account",
        "/dashboard/photo-gallery",
      ],
    },
    {
      roleName: "family_member",
      routeAccess: [
        "/dashboard",
        "/dashboard/call-history",
        // "/dashboard/schedule-call-list",
        // "/dashboard/call-details",
        // "/dashboard/profile",
        "/dashboard/account",
        // "/dashboard/photo-gallery",
        "/dashboard/media",
        "/dashboard/instruction",
        "/dashboard/life-history",
      ],
    },
  ];
  export const navigations = [
    {
      type: "label",
      label: "Dashboard",
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: duotone.PersonChalkboard,
    },
    {
      type: "label",
      label: "Management",
    },

    {
      name: "Patient",
      icon: duotone.UserList,
      children: [
        {
          name: "Add Patient",
          path: "/dashboard/add-patient",
        },
        {
          name: "Patient List",
          path: "/dashboard/patient-list",
        },
        {
          name: "Patient Grid List",
          path: "/dashboard/patient-grid-list",
        },
      ],
    },
    {
      name: "Photo Gallery",
      icon: duotone.UserProfile,
      path: "/dashboard/photo-gallery",
    },
    {
      name: "Schedule call",
      icon: duotone.AdminEcommerce,
      children: [
        {
          name: "Schedule call List",
          path: "/dashboard/schedule-call-list",
        },
        {
          name: "Schedule call",
          path: "/dashboard/schedule-call",
        },
        {
          name: "Call Details",
          path: "/dashboard/call-details",
        },
      ],
    },
    {
      name: "Call History",
      icon: duotone.Chat,
      path: "/dashboard/call-history",
    },

    {
      name: "Train Bot",
      // access: "access",
      icon: duotone.Pages,
      children: [
        {
          name: "Media",
          path: "/dashboard/media",
        },
        {
          name: "Instruction",
          path: "/dashboard/instruction",
        },
        {
          name: "Life History",
          path: "/dashboard/life-history",
        },
      ],
    },
    {
      type: "label",
      label: "Settings",
    },
    {
      name: "Profile",
      icon: duotone.UserProfile,
      path: "/dashboard/profile",
    },

    {
      name: "Account",
      icon: duotone.Accounts,
      path: "/dashboard/account",
    },
  ];
