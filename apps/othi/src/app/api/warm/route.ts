export function GET(_: Request) {
  void fetch("https://othi.dev/blog");
  return new Response("Blog list warmed");
}
