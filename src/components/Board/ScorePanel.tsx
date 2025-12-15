import type { Team } from '../../types';
import './ScorePanel.css';

interface ScorePanelProps {
  team: Team;
  teamName: string;
  score: number;
  isSetup: boolean;
  onNameChange: (name: string) => void;
}

export function ScorePanel({ team, teamName, score, isSetup, onNameChange }: ScorePanelProps) {
  return (
    <div className={`score-panel team-${team.toLowerCase()}`}>
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

