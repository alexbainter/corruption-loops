import { createElement } from 'react';
import { render } from 'react-dom';
import App from './components/app.jsx';
import corruptText from './corrupt-text';

render(createElement(App), document.getElementById('root'));

//eslint-disable-next-line no-console
console.log('https://github.com/metalex9/corruption-loops');

setTimeout(() => {
  setInterval(() => {
    document.title = corruptText(document.title);
  }, Math.random() * 500 + 500);
}, 60000);
