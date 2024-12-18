import { Events, type Message } from 'discord.js';

interface MiiboResponse {
  utterance: string;
  bestResponse: {
    utterance: string;
    score: number;
    options: string[];
    topic: string;
    imageUrl: string;
    url: string;
    isAutoResponse: boolean;
    extensions: any;
    shouldSelectOption: boolean;
    state: string;
    embededHtml: string;
  };
  avatarIconUrl: string;
  userState: Record<string, any>;
  isError: boolean;
  historyId: string;
}

export default {
  name: Events.MessageCreate,
  async execute(message: Message): Promise<void> {
    // Check if the message mentions the bot
    if (message.mentions.has(message.client.user)) {
      // Ignore messages containing @here or @everyone
      if (
        message.content.includes('@here') ||
        message.content.includes('@everyone')
      ) {
        return;
      }
      
      if (message.inGuild() && message.channel.isTextBased()) {
        void message.channel.sendTyping();
      }

      // Reply with the content without the mention
      const contentWithoutMention = message.content
        .replace(/<@!?(\d+)>/, '')
        .trim();

      // Prepare the payload for the fetch request
      const payload = {
        api_key: process.env.MIIBO_API_KEY,
        agent_id: process.env.MIIBO_AGENT_ID,
        utterance: contentWithoutMention,
        uid: process.env.MIIBO_UID,
      };

      // Send the fetch request
      try {
        const response = await fetch('https://api-mebo.dev/api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          console.error(`Error: ${response.statusText}`);
          await message.reply(
            'An error occurred while processing your request.',
          );
        } else {
          const data = (await response.json()) as MiiboResponse;
          const formattedResponse = data.bestResponse.utterance
            .replaceAll('。', '　')
            .replaceAll('!', '！')
            .replaceAll('?', '？');
          await message.reply(formattedResponse);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }
  },
};
