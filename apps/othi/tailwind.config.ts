import type { Config } from "tailwindcss";
import sharedConfig from "tailwind-config/tailwind.config";
import { withUt } from "uploadthing/tw";

const config: Pick<Config, "presets"> = {
  presets: [sharedConfig],
};

export default withUt({
  presets: config.presets,
  content: sharedConfig.content,
}) satisfies Config;
