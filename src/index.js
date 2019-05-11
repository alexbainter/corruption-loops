import { createElement } from 'react';
import { render } from 'react-dom';
import App from './app.jsx';
import startMusic from './start-music';

startMusic();

render(createElement(App), document.getElementById('root'));
