import { BotClient } from "./BotClient";

export class Feature {
  public onStart(client: BotClient): boolean | Promise<boolean> {
    return true;
  }
}
