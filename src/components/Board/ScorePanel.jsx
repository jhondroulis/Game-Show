import React from 'react';
import PropTypes from 'prop-types';
import './ScorePanel.css';

export function ScorePanel({
  team,
  teamName,
  score,
  isSetup,
  isActive = false,
  onNameChange,
}) {
  return (
    <div
      className={[
        'score-panel',
        `team-${team.toLowerCase()}`,
        isActive ? 'is-active' : '',
      ].join(' ')}
    >
      {!isSetup && isActive && <div className="active-badge">PLAYING</div>}
      {isSetup ? (
        <input
          type="text"
          className="team-name-input"
          value={teamName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={`Team ${team}`}
          maxLength={20}
        />
      ) : (
        <p className="team-name-display">{teamName}</p>
      )}
      <div className="score-value">{score}</div>
    </div>
  );
}

ScorePanel.propTypes = {
  team: PropTypes.oneOf(['A', 'B']).isRequired,
  teamName: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  isSetup: PropTypes.bool.isRequired,
  isActive: PropTypes.bool,
  onNameChange: PropTypes.func.isRequired,
};

