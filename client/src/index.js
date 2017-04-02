import { htmlEscape, formatTime } from './templating';

const form = document.querySelector('form');
const input = document.querySelector('input');
const section = document.querySelector('section');
const emojiButton = document.querySelector('button[type="button"]');
const emojiMenu = document.querySelector('menu');

const emojiList = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', 
  '🤣', '😡', '😊', '😇', '🙂', '🙃', '😉', 
  '😌', '😍', '😘', '😗', '😙', '😚', '😋'];

function createArticle({ user, time, text }) {
  const article = document.createElement('article');

  const image1x = `/img/users/1x/${htmlEscape(user.image)}`;
  const image2x = `/img/users/2x/${htmlEscape(user.image)}`;
  
  article.innerHTML = `
    <header>
      <address>${htmlEscape(user.name)}</address>
      <time>${htmlEscape(time)}</time>
      <image src="${image1x}" srcset="${image2x} 2x"></image>
    </header>
    <p>${htmlEscape(text)}</p>
  `;
  
  return article;
}

emojiButton.addEventListener('click', async _ => {
  if (emojiMenu.getAttribute('hidden') !== null) {
    for (const emoji of emojiList) {
      const menuitem = document.createElement('menuitem');

      menuitem.textContent = emoji;
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
