import { Events, type Client, ActivityType } from 'discord.js';

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client): Promise<void> {
    client.user?.setActivity('Start a chat with a Mention', {
      type: ActivityType.Playing,
    });
    // Log the username of the client when it is ready.
    console.log(`Logged in as ${client.user?.username}!`);
  },
};
