import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';

const TimedReveal = ({ revealAfter, children }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsRevealed(true);
    }, revealAfter);
    return () => clearTimeout(timeout);
  }, [revealAfter]);

  return (
    <div className="fade-in" style={{ opacity: isRevealed ? 1 : 0 }}>
      {children}
    </div>
  );
};

TimedReveal.propTypes = {
  children: propTypes.oneOfType([
    propTypes.arrayOf(propTypes.node),
    propTypes.node,
  ]).isRequired,
  revealAfter: propTypes.number.isRequired,
};

export default TimedReveal;
