(function () {
'use strict';

// import _ from 'lodash-es';

(async () => {
  const form = document.querySelector('form');
  const input = document.querySelector('input');
  const section = document.querySelector('section');
  const emojiButton = document.querySelector('button[type="button"]');
  const emojiMenu = document.querySelector('menu');

  const emojiList = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', 
    '🤣', '😡', '😊', '😇', '🙂', '🙃', '😉', 
    '😌', '😍', '😘', '😗', '😙', '😚', '😋'];

  function pad0(number) {
    // return _.padStart(number, 2, 0);
    return `0${number}`.slice(-2);
  }

  function time() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    return `${pad0(hours)}:${pad0(minutes)}`;
  }

  const htmlEntitiesMap = { '<': 'lt', '>': 'gt', '"': 'quot' };
  const htmlEntities = Object.keys(htmlEntitiesMap);
  const htmlRegexp = new RegExp('[' + htmlEntities.join('') + ']', 'g');

  /** excape html special characters */
  function s(str) {
    return str.replace(htmlRegexp, x => '&' + htmlEntitiesMap[x] + ';');
  }

  function createArticle({ user, time, text }) {
    const article = document.createElement('article');

    const image1x = `/img/users/1x/${s(user.image)}`;
    const image2x = `/img/users/2x/${s(user.image)}`;
    
    article.innerHTML = `
      <header>
        <address>${s(user.name)}</address>
        <time>${s(time)}</time>
        <image src="${image1x}" srcset="${image2x} 2x"></image>
      </header>
      <p>${s(text)}</p>
    `;
    
    return article;
  }

  emojiButton.addEventListener('click', async _ => {
    if (emojiMenu.getAttribute('hidden') !== null) {
      // const emojiResponse = await fetch('/api/emoji');
      // const emojiList = await emojiResponse.json();

      for (const emoji of emojiList) {
        // const image = `/img/emoji/${emoji}`;
        // const img = document.createElement('img');
        const menuitem = document.createElement('menuitem');

        menuitem.textContent = emoji;
        // img.src = image;
        // menuitem.appendChild(img);
        emojiMenu.appendChild(menuitem);
      }

      emojiMenu.removeAttribute('hidden');
    } else {
      emojiMenu.setAttribute('hidden', '');
      emojiMenu.textContent = '';
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    
    if (input.value === '') {
      return;
    }
    
    const article = createArticle({
      user: usersByName.grumpy,
      time: time(),
      text: input.value,
    });
    
    section.appendChild(article);
    article.scrollIntoView({ behavior: 'smooth' });
    
    input.value = '';
    input.focus();
  });

  const messagesPromise = fetch('/api/messages');
  const usersPromise = fetch('/api/users');

  const messagesResponse = await messagesPromise;
  const messages = await messagesResponse.json();

  const usersResponse = await usersPromise;
  const users = await usersResponse.json();

  const usersByName = users.reduce((users, user) => {
    users[user.name] = user;

    return users;
  }, {});

  section.textContent = '';
  for (const message of messages) {
    message.user = usersByName[message.user];

    const article = createArticle(message);
    section.appendChild(article);
  }
})();

}());
