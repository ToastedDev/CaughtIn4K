import { Message, PartialMessage } from "discord.js";

export interface Snipe {
  message: Message | PartialMessage;
  image: string | null;
  url: string | null;
  type: string | null;
  sticker: {
    name: string | null;
    url: string | null;
  };
  time: number;
}

export interface EditSnipe {
  oldMessage: Message | PartialMessage;
  newMessage: Message | PartialMessage;
  image: string | null;
  time: number;
}
