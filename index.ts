import { Bot, GrammyError, HttpError, InlineKeyboard } from 'grammy';
import { z } from 'zod';

if (!process.env.BOT_TOKEN) {
  throw new Error('set BOT_TOKEN in .env file');
}

const bot = new Bot(process.env.BOT_TOKEN);

bot.on(':text', async (ctx) => {
  const url = z.string().url().safeParse(ctx.msg.text);

  if (url.success) {
    await ctx.reply('Here is the app!', {
      reply_markup: new InlineKeyboard().webApp('Open TMA', url.data),
    });
  } else {
    await ctx.reply('Invalid url');
  }
});

bot.catch((err: any) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error('Error in request:', e.description);
  } else if (e instanceof HttpError) {
    console.error('Could not contact Telegram:', e);
  } else {
    console.error('Unknown error:', e);
  }
});

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start();
console.log('🤖 bot started');
