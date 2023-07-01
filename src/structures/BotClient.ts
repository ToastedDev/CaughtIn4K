import {
  ApplicationCommandDataResolvable,
  Client,
  Collection,
  Snowflake,
} from "discord.js";
import Enmap from "enmap";
import fs from "fs";
import path from "path";
import { Config } from "../interfaces/Config";
import { EditSnipe, Snipe } from "../interfaces/Snipe";
import { botOptions } from "../utils/botOptions";
import { env } from "../utils/env";
import { Command, SlashCommand } from "./Command";

export class BotClient<Ready extends boolean = boolean> extends Client<Ready> {
  config: Config;

  commands = new Collection<string, Command>();
  slashCommands = new Collection<string, SlashCommand>();

  snipes = new Collection<Snowflake, Snipe[]>();
  esnipes = new Collection<Snowflake, EditSnipe[]>();

  settings = new Enmap({
    name: "db",
    dataDir: "./db",
  });

  constructor() {
    super(botOptions);
    this.config = JSON.parse(
      fs.readFileSync("./config.json", "utf-8")
    ) as Config;
  }

  connect() {
    this.login(env.TOKEN);
  }

  register() {
    this._registerCommands();
    this._registerSlashCommands();
    this._registerEvents();
    this._registerFeatures();
  }

  private _getDirectory(...directories: string[]) {
    return path.join(__dirname, ...directories);
  }

  private _registerCommands() {
    fs.readdirSync(this._getDirectory("../commands")).forEach(async (dir) => {
      const commandFiles = fs
        .readdirSync(this._getDirectory("../commands", dir))
        .filter((file) => file.endsWith("js") || file.endsWith("ts"));

      for (const file of commandFiles) {
        const cmd = await import(`../commands/${dir}/${file}`)
          .then((x) => x?.default)
          .catch(() => null);
        if (!cmd) return;

        const command: Command = new cmd(this);
        this.commands.set(command.data.name, command);
      }
    });
  }

  private _registerSlashCommands() {
    const commands: ApplicationCommandDataResolvable[] = [];

    fs.readdirSync(this._getDirectory("../slashCommands")).forEach(
      async (dir) => {
        const slashCommandFiles = fs
          .readdirSync(this._getDirectory("../slashCommands", dir))
          .filter((file) => file.endsWith("js") || file.endsWith("ts"));

        for (const file of slashCommandFiles) {
          const cmd = await import(`../commands/${dir}/${file}`)
            .then((x) => x?.default)
            .catch(() => null);

          const command: SlashCommand = new cmd(this);
          this.slashCommands.set(command.data.name, command);
          commands.push(command.data);
        }
      }
    );

    this.on("ready", async () => {
      if (this.config.guildId && this.config.guildId.length) {
        const guild = this.guilds.cache.get(this.config.guildId);
        if (!guild)
          return console.log(`No guild found with ID ${this.config.guildId}`);

        guild.commands.set(commands);
        console.log(`Registered commands in ${guild.name}.`);
      } else {
        this.application?.commands.set(commands);
        console.log("Registered commands globally.");
      }
    });
  }

  private _registerEvents() {
    fs.readdirSync(this._getDirectory("../events"))
      .filter((file) => file.endsWith("js") || file.endsWith("ts"))
      .forEach(async (file) => {
        const event = await import(`../events/${file}`)
          .then((x) => x?.default)
          .catch(() => null);
        if (!event) return;

        this.on(event.name, event.run.bind(null, this));
      });
  }

  private _registerFeatures() {
    fs.readdirSync(this._getDirectory("../features"))
      .filter((file) => file.endsWith("js") || file.endsWith("ts"))
      .forEach(async (file) => {
        const f = await import(`../features/${file}`)
          .then((x) => x?.default)
          .catch(() => null);
        if (!f) return;

        const feature = new f();
        feature.onStart(this);
      });
  }
}
