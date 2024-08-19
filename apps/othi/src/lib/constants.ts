export interface HeaderRoute {
  path: string;
  label: string;
  subItems?: HeaderRoute[];
}

export const headerRoute = [
  { path: "/", label: "/", subItems: [] },
  { path: "/blog", label: "/BLOG", subItems: [] },
  { path: "/about", label: "/ABOUT", subItems: [] },
];
