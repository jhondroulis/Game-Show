import './Board.css';

interface RoundPotProps {
  value: number;
}

export function RoundPot({ value }: RoundPotProps) {
  return (
    <div className="round-pot">
      <p className="round-pot-label">Round Pot</p>
      <p className="round-pot-value">{value}</p>
    </div>
  );
}

