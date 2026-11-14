/**
 * Example: Discord.js Bot with discord-transcript
 *
 * One function call generates a full HTML transcript from a channel.
 */

import {
    Client,
    GatewayIntentBits,
    SlashCommandBuilder,
    type TextChannel,
    PermissionFlagsBits,
} from "discord.js";
import { createTranscript } from "@getoeteter/discord-transcripts";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// ─── Register Slash Command ───

client.once("ready", async () => {
    console.log(`Logged in as ${client.user?.tag}`);

    const command = new SlashCommandBuilder()
        .setName("transcript")
        .setDescription("Generate an HTML transcript of this channel")
        .addIntegerOption((opt) =>
            opt
                .setName("limit")
                .setDescription("Number of messages to include (default: 100)")
                .setMinValue(1)
                .setMaxValue(5000),
        )
        .addStringOption((opt) =>
            opt
                .setName("theme")
                .setDescription("Transcript theme")
                .addChoices(
                    { name: "Dark", value: "dark" },
                    { name: "Light", value: "light" },
                ),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

    await client.application?.commands.create(command);
});

// ─── Handle Slash Command ───

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName !== "transcript") return;

    await interaction.deferReply({ ephemeral: true });

    try {
        const limit = interaction.options.getInteger("limit") ?? 100;
        const theme = (interaction.options.getString("theme") ?? "dark") as
            | "dark"
            | "light";
        const channel = interaction.channel as TextChannel;

        // One function call — fetches messages, resolves roles, generates HTML
        const result = await createTranscript(channel, { theme, limit });

        await interaction.editReply({
            content: `Transcript generated with ${result.messageCount} messages.`,
            files: [{ attachment: result.buffer, name: result.filename }],
        });
    } catch (error) {
        console.error("Transcript generation failed:", error);
        await interaction.editReply({
            content: "Failed to generate transcript. Check the logs for details.",
        });
    }
});

// Start the bot
client.login(process.env.DISCORD_TOKEN);
