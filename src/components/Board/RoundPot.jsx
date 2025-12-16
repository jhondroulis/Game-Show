import React from 'react';
import PropTypes from 'prop-types';
import './Board.css';

export function RoundPot({ value }) {
  return (
    <div className="round-pot">
      <p className="round-pot-label">Round Pot</p>
      <p className="round-pot-value">{value}</p>
    </div>
  );
}

RoundPot.propTypes = {
  value: PropTypes.number.isRequired,
};

