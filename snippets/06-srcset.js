const image1x = `/img/users/1x/${htmlEscape(user.image)}`;
const image2x = `/img/users/2x/${htmlEscape(user.image)}`;
const img = `<img src="${image1x}" srcset="${image2x} 2x"></img>`;
