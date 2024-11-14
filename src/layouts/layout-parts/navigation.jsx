// CUSTOM ICON COMPONENT
import duotone from '@/icons/duotone'; // ==============================================================

// ==============================================================
export const navigations = [
  {
    type: "label",
    label: "Dashboard",
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: duotone.PersonChalkboard,
    // children: [
    //   {
    //     name: "",
    //     path: "/dashboard",
    //   },
    //   // {
    //   // name: 'Analytics 2',
    //   // path: '/dashboard/analytics-2'
    //   // }
    // ],
  },
  // {
  //   name: "Finance",
  //   icon: duotone.MessagesDollar,
  //   children: [
  //     {
  //       name: "Finance 1",
  //       path: "/dashboard/finance",
  //     },
  //     {
  //       name: "Finance 2",
  //       path: "/dashboard/finance-2",
  //     },
  //   ],
  // },
  // {
  //   name: "CRM",
  //   icon: duotone.CommentsQuestionCheck,
  //   children: [
  //     {
  //       name: "CRM",
  //       path: "/dashboard/crm",
  //     },
  //     {
  //       name: "CRM 2",
  //       path: "/dashboard/crm-2",
  //     },
  //   ],
  // },
  // {
  //   name: "Sales",
  //   icon: duotone.Ecommerce,
  //   children: [
  //     {
  //       name: "Sales",
  //       path: "/dashboard/sales",
  //     },
  //     {
  //       name: "Sales 2",
  //       path: "/dashboard/sales-2",
  //     },
  //   ],
  // },
  // {
  //   name: "Ecommerce",
  //   path: "/dashboard/ecommerce",
  //   icon: duotone.RectangleCirclePlus,
  // },
  // {
  //   name: "Logistics",
  //   path: "/dashboard/logistics",
  //   icon: duotone.DiagramProject,
  // },
  // {
  //   name: "Marketing",
  //   path: "/dashboard/marketing",
  //   icon: duotone.LayerGroup,
  // },
  // {
  //   name: "LMS",
  //   path: "/dashboard/learning-management",
  //   icon: duotone.PersonCircleCheck,
  // },
  // {
  //   name: "Job Management",
  //   path: "/dashboard/job-management",
  //   icon: duotone.PersonCircleCheck,
  // },
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
      // {
      //   name: "User List 2",
      //   path: "/dashboard/patient-list-2",
      // },
      // {
      //   name: "User Grid 2",
      //   path: "/dashboard/user-grid-2",
      // },
    ],
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
  // {
  //   name: "Invoice",
  //   icon: duotone.Invoice,
  //   children: [
  //     {
  //       name: "Invoice List",
  //       path: "/dashboard/invoice-list",
  //     },
  //     {
  //       name: "Invoice Details",
  //       path: "/dashboard/invoice-details",
  //     },
  //     {
  //       name: "Create Invoice",
  //       path: "/dashboard/create-invoice",
  //     },
  //   ],
  // },
  // {
  //   name: "Ecommerce",
  //   icon: duotone.Ecommerce,
  //   children: [
  //     {
  //       name: "Cart",
  //       path: "/dashboard/cart",
  //     },
  //     {
  //       name: "Payment",
  //       path: "/dashboard/payment",
  //     },
  //     {
  //       name: "Billing Address",
  //       path: "/dashboard/billing-address",
  //     },
  //     {
  //       name: "Payment Complete",
  //       path: "/dashboard/payment-complete",
  //     },
  //   ],
  // },
  // {
  //   name: "Projects",
  //   icon: duotone.ProjectChart,
  //   children: [
  //     {
  //       name: "Project 1",
  //       path: "/dashboard/projects/version-1",
  //     },
  //     {
  //       name: "Project 2",
  //       path: "/dashboard/projects/version-2",
  //     },
  //     {
  //       name: "Project 3",
  //       path: "/dashboard/projects/version-3",
  //     },
  //     {
  //       name: "Project Details",
  //       path: "/dashboard/projects/details",
  //     },
  //     {
  //       name: "Team Member",
  //       path: "/dashboard/projects/team-member",
  //     },
  //   ],
  // },
  // {
  //   name: "Data Table",
  //   icon: duotone.DataTable,
  //   children: [
  //     {
  //       name: "Data Table 1",
  //       path: "/dashboard/data-table-1",
  //     },
  //   ],
  // },
  // {
  //   type: "label",
  //   label: "Apps",
  // },
  // {
  //   name: "Todo List",
  //   icon: duotone.TodoList,
  //   path: "/dashboard/todo-list",
  // },
  {
    name: "Call History",
    icon: duotone.Chat,
    path: "/dashboard/call-history",
  },
  // {
  //   name: "Email",
  //   icon: duotone.Inbox,
  //   children: [
  //     {
  //       name: "Inbox",
  //       path: "/dashboard/mail/all",
  //     },
  //     {
  //       name: "Email Details",
  //       path: "/dashboard/mail/details",
  //     },
  //     {
  //       name: "Create Email",
  //       path: "/dashboard/mail/compose",
  //     },
  //   ],
  // },
  {
    name: "Train Bot",
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
  // {
  //   type: "extLink",
  //   name: "Documentation",
  //   icon: duotone.FileCircleQuestion,
  //   path: "https://essence-doc.vercel.app/",
  // },
  // {
  //   type: "label",
  //   label: "Others",
  // },
  // {
  //   path: "https://essence-doc.vercel.app/",
  //   name: "Item Disabled",
  //   icon: duotone.Folder,
  //   disabled: true,
  // },
  // {
  //   name: "Multi Level Item",
  //   icon: duotone.Apps,
  //   children: [
  //     {
  //       name: "Level A",
  //       path: "#dashboard/cart",
  //     },
  //     {
  //       iconText: "B",
  //       name: "Level B",
  //       path: "#dashboard/payment",
  //       children: [
  //         {
  //           name: "Level B1",
  //           path: "#dashboard/payment",
  //         },
  //         {
  //           iconText: "B",
  //           name: "Level B2",
  //           path: "#dashboard/payment",
  //           children: [
  //             {
  //               name: "Level B21",
  //               path: "#dashboard/payment",
  //             },
  //             {
  //               name: "Level B22",
  //               path: "#dashboard/payment",
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },
];