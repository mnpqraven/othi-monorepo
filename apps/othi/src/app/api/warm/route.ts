export function GET(_request: Request) {
  void fetch("https://othi.dev/blog");
  return new Response("Blog list warmed");
}
