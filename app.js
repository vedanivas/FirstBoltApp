const { App, ExpressReceiver } = require('@slack/bolt');
const express = require('express');
const axios = require('axios');
const schedule = require('node-schedule');


const receiver = new ExpressReceiver({
  signingSecret: process.env.SIGNING_SECRET_,
});

const app = new App({
  token: process.env.SLACK_TOKEN_,
  receiver,
});

const welcomeMessages = {};
const messageCounts = {};
const badWords = ['hmm', 'no'];

let scheduledMessages = [
  { text: 'First message', postAt: new Date(new Date().getTime() + 20000), channel: 'C01BXQNT598' },
  { text: 'Second Message!', postAt: new Date(new Date().getTime() + 30000), channel: 'C01BXQNT598' },
];

class WelcomeMessage {
  constructor(channel) {
    this.channel = channel;
    this.iconEmoji = ':robot_face:';
    this.timestamp = '';
    this.completed = false;
  }

  get startText() {
    return {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Welcome to this awesome channel! \n\n*Get started by completing the tasks!*',
      },
    };
  }

  get divider() {
    return { type: 'divider' };
  }

  get message() {
    return {
      ts: this.timestamp,
      channel: this.channel,
      username: 'Welcome Robot!',
      icon_emoji: this.iconEmoji,
      blocks: [this.startText, this.divider, this.reactionTask],
    };
  }

  get reactionTask() {
    const checkmark = this.completed ? ':white_check_mark:' : ':white_large_square:';
    const text = `${checkmark} *React to this message!*`;
    return { type: 'section', text: { type: 'mrkdwn', text } };
  }
}

async function sendWelcomeMessage(channel, user) {
  if (!welcomeMessages[channel]) {
    welcomeMessages[channel] = {};
  }

  if (welcomeMessages[channel][user]) {
    return;
  }

  const welcome = new WelcomeMessage(channel);
  const message = await app.client.chat.postMessage(welcome.message);
  welcome.timestamp = message.ts;
  welcomeMessages[channel][user] = welcome;
}

app.message(async ({ message, say }) => {
  const user_id = message.user;
  const channel_id = message.channel;
  const text = message.text;

  if (user_id && BOT_ID !== user_id) {
    messageCounts[user_id] = (messageCounts[user_id] || 0) + 1;

    if (text.toLowerCase() === 'start') {
      sendWelcomeMessage(channel_id, user_id);
    } else if (badWords.some(word => text.toLowerCase().includes(word))) {
      await say({ channel: channel_id, text: 'THAT IS A BAD WORD!', thread_ts: message.ts });
    }
  }
});

app.event('reaction_added', async ({ event, client }) => {
  const { user, item: { channel } } = event;

  if (welcomeMessages[user]) {
    const welcome = welcomeMessages[user];
    welcome.completed = true;
    welcome.channel = channel;
    await client.chat.update(welcome.message);
  }
});

receiver.router.post('/message-count', async (req, res) => {
  const { user_id, channel_id } = req.body;
  const count = messageCounts[user_id] || 0;
  await app.client.chat.postMessage({ channel: channel_id, text: `Message: ${count}` });
  res.sendStatus(200);
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();

// Schedule messages functionality
scheduledMessages.forEach(message => {
  schedule.scheduleJob(message.postAt, function(){
    app.client.chat.postMessage({ channel: message.channel, text: message.text });
  });
});
