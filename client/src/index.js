import { htmlEscape, formatTime } from './templating';

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
