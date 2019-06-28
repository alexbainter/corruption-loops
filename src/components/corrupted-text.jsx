import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import corruptText from '../corrupt-text';

const CorruptedText = ({ children, corruptAfter }) => {
  const [text, setText] = useState(children);
  useEffect(() => {
    let interval;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setText(oldText => corruptText(oldText));
      }, Math.random() * 1000 + 1000);
    }, corruptAfter);

    return () => {
      clearTimeout(timeout);
      if (typeof interval !== 'undefined') {
        clearInterval(interval);
      }
    };
  }, []);

  return <p className="copy">{text}</p>;
};

CorruptedText.propTypes = {
  children: propTypes.oneOfType([
    propTypes.arrayOf(propTypes.node),
    propTypes.node,
  ]).isRequired,
  corruptAfter: propTypes.number.isRequired,
};

export default CorruptedText;
