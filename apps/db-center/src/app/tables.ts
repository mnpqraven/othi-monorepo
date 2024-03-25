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
      { name: "Char. skill", route: "avatarToSkills" },
      { name: "Char. traces", route: "avatarTraces" },
      { name: "Skills", route: "skills" },
      { name: "Elements", route: "elements" },
      { name: "Paths", route: "paths" },
      { name: "Items", route: "items" },
      { name: "Item types", route: "itemTypes" },
      { name: "Item sub types", route: "itemSubTypes" },
      { name: "Item rarities", route: "itemRarities" },
      { name: "Light cone", route: "lightCones" },
      { name: "Light cone skills", route: "lightConeToSkills" },
      { name: "Skill types", route: "skillTypes" },
      { name: "Trace", route: "trace" },
      { name: "Trace materials", route: "traceMaterials" },
    ],
  },
  {
    category: {
      name: "Misc.",
      route: "misc",
    },
    tables: [
      { name: "Blogs", route: "blogs" },
      { name: "Frameworks", route: "frameworks" },
    ],
  },
];
