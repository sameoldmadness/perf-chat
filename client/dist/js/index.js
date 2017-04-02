(function () {
'use strict';

const htmlEntitiesMap = { '<': 'lt', '>': 'gt', '"': 'quot' };
const htmlEntities = Object.keys(htmlEntitiesMap);
const htmlRegexp = new RegExp('[' + htmlEntities.join('') + ']', 'g');

function htmlEscape(str) {
  return str.replace(htmlRegexp, x => '&' + htmlEntitiesMap[x] + ';');
}

function formatTime(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();

  hours = _.padStart(hours, 2, 0);
  minutes = _.padStart(minutes, 2, 0);
  
  return `${hours}:${minutes}`;
}

function getWarAndPeace() {
    return [
        'Well, Prince, so Genoa and Lucca are now just family estates of the Buonapartes. But I warn you, if you don\'t tell me that this means war, if you still try to defend the infamies and horrors perpetrated by that Antichrist- I really believe he is Antichrist- I will have nothing more to do with you and you are no longer my friend, no longer my \'faithful slave,\' as you call yourself! But how do you do? I see I have frightened you- sit down and tell me all the news."',
        'It was in July, 1805, and the speaker was the well-known Anna Pavlovna Scherer, maid of honor and favorite of the Empress Marya Fedorovna. With these words she greeted Prince Vasili Kuragin, a man of high rank and importance, who was the first to arrive at her reception. Anna Pavlovna had had a cough for some days. She was, as she said, suffering from la grippe; grippe being then a new word in St. Petersburg, used only by the elite.',
        'All her invitations without exception, written in French, and delivered by a scarlet-liveried footman that morning, ran as follows:',
        '"If you have nothing better to do, Count [or Prince], and if the prospect of spending an evening with a poor invalid is not too terrible, I shall be very charmed to see you tonight between 7 and 10- Annette Scherer."',
        '"Heavens! what a virulent attack!" replied the prince, not in the least disconcerted by this reception. He had just entered, wearing an embroidered court uniform, knee breeches, and shoes, and had stars on his breast and a serene expression on his flat face. He spoke in that refined French in which our grandfathers not only spoke but thought, and with the gentle, patronizing intonation natural to a man of importance who had grown old in society and at court. He went up to Anna Pavlovna, kissed her hand, presenting to her his bald, scented, and shining head, and complacently seated himself on the sofa.',
        '"First of all, dear friend, tell me how you are. Set your friend\'s mind at rest," said he without altering his tone, beneath the politeness and affected sympathy of which indifference and even irony could be discerned.',
        '[Table of Contents] Next: Chapter 1 (continued)',
    ];
}

const form = document.querySelector('form');
const input = document.querySelector('input');
const section = document.querySelector('section');
const emojiButton = document.querySelector('button[type="button"]');
const emojiMenu = document.querySelector('menu');

function createArticle({ user, time, text }) {
  const article = document.createElement('article');

  const image = `/img/users/${htmlEscape(user.image)}`;
  const img = `<img src="${image}"></img>`;
  
  article.innerHTML = `
    <header>
      <address>${htmlEscape(user.name)}</address>
      <time>${htmlEscape(time)}</time>
      ${img}
    </header>
    <p>${htmlEscape(text)}</p>
  `;
  
  return article;
}

emojiButton.addEventListener('click', async _ => {
  if (emojiMenu.getAttribute('hidden') !== null) {
    const emojiResponse = await fetch('/api/emoji');
    const emojiList = (await emojiResponse.json()).map(emoji => {
      return `<img src="/img/emoji/${htmlEscape(emoji)}">`;
    });

    for (const emoji of emojiList) {
      const menuitem = document.createElement('menuitem');

      menuitem.innerHTML = emoji;
      emojiMenu.appendChild(menuitem);
    }

    emojiMenu.removeAttribute('hidden');
  } else {
    emojiMenu.setAttribute('hidden', '');
    emojiMenu.textContent = '';
  }
});

let me;

form.addEventListener('submit', e => {
  e.preventDefault();
  
  if (input.value === '') {
    return;
  }
  
  const article = createArticle({
    user: me,
    time: formatTime(new Date()),
    text: input.value,
  });
  
  section.appendChild(article);
  article.scrollIntoView({ behavior: 'smooth' });
  
  input.value = '';
  input.focus();
});

(async _ => {
  const messagesPromise = fetch('/api/messages');
  const usersPromise = fetch('/api/users');

  const messagesResponse = await messagesPromise;
  const messages = await messagesResponse.json();

  const usersResponse = await usersPromise;
  const users = await usersResponse.json();

  const usersByLogin = users.reduce((users, user) => {
    users[user.login] = user;

    return users;
  }, {});

  section.textContent = '';
  for (const message of messages) {
    message.user = usersByLogin[message.user];

    const article = createArticle(message);
    section.appendChild(article);
  }

  me = usersByLogin.grumpy;
})();

}());
