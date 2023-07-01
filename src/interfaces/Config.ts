import { ColorResolvable } from "discord.js";

export interface Config {
  prefix: string;
  color: ColorResolvable;
  guildId: string | null;
}
