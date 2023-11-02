interface RouteItem {
  category: { name: string; route: string };
  tables: {
    name: string;
    route: string;
    api?: string[];
  }[];
}

export const routeDict: RouteItem[] = [
  {
    category: {
      name: "Honkai",
      route: "honkai",
    },
    tables: [
      { name: "Characters", route: "avatar", api: ["list"] },
      { name: "Items", route: "item" },
    ],
  },
];
