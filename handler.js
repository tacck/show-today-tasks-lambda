'use strict';

const axios = require('axios');
const { dialogflow, HtmlResponse } = require('actions-on-google');

const app = dialogflow({ debug: false });

const tasksUrl = 'https://show-today-tasks.netlify.com'
const currentListId = process.env.CURRENT_LIST_ID
const finishedListId = process.env.FINISHED_LIST_ID
const apiKey = process.env.API_KEY
const apiToken = process.env.API_TOKEN

// 起動時Intent
app.intent('welcome', (conv) => {
  conv.ask('今日のタスク一覧です。確認しましょう。');
  conv.ask(new HtmlResponse({
    url: `${tasksUrl}/?listId=${currentListId}&apiKey=${apiKey}&apiToken=${apiToken}`,
    suppress: true
  }));
});

app.intent('finishedTask', async (conv, { cardId }) => {
  // Trelloのカードを完了に移す
  const response = await axios.put(`https://api.trello.com/1/cards/${cardId}?idList=${finishedListId}&key=${apiKey}&token=${apiToken}&pos=bottom`)

  const now = Date.now()
  conv.ask('カードを完了にしました。')
  conv.ask(new HtmlResponse({
    url: `${tasksUrl}/?listId=${currentListId}&apiKey=${apiKey}&apiToken=${apiToken}&d=${now}`,
    suppress: true
  }));
});

app.fallback((conv) => {
  console.log('Default Fallback Intent');
  console.log(conv);
  conv.ask('フォールバック');
});

module.exports.fulfillment = app;
