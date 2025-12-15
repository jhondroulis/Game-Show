import './StrikeIndicator.css';

interface StrikeIndicatorProps {
  strikes: number;
}

export function StrikeIndicator({ strikes }: StrikeIndicatorProps) {
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

