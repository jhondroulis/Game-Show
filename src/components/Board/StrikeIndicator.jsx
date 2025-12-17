import React from 'react';
import PropTypes from 'prop-types';
import './StrikeIndicator.css';

export function StrikeIndicator({ strikes }) {
  return (
    <div className="strike-container">
      {[1, 2, 3].map((num) => (
        <div key={num} className={`strike-x ${num <= strikes ? 'active' : ''}`}>
          X
        </div>
      ))}
    </div>
  );
}

StrikeIndicator.propTypes = {
  strikes: PropTypes.number.isRequired,
};



