import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';

const MIN_CHAR_CODE = 32;
const MAX_CHAR_CODE = 10144;

const CorruptedText = ({ children, corruptAfter }) => {
  const [text, setText] = useState(children);
  useEffect(() => {
    let interval;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setText(oldText =>
          oldText
            .split('')
            .map(char =>
              Math.random() < 0.0003
                ? String.fromCharCode(
                    Math.floor(MIN_CHAR_CODE + Math.random() * MAX_CHAR_CODE)
                  )
                : char
            )
            .join('')
        );
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
