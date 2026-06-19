import React from 'react';
import { Star } from 'lucide-react';
import { getScoreColor } from '../../utils/score';

interface RatingStarsProps {
  score: number;
  size?: number;
  interactive?: boolean;
  onChange?: (score: number) => void;
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  score,
  size = 20,
  interactive = false,
  onChange,
  className = '',
}) => {
  const [hoverScore, setHoverScore] = React.useState(0);
  const displayScore = interactive ? hoverScore || score : score;
  const color = getScoreColor(displayScore);

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (interactive) {
      setHoverScore(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverScore(0);
    }
  };

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((value) => {
        const isFilled = value <= Math.round(displayScore);
        return (
          <button
            key={value}
            type="button"
            onClick={() => handleClick(value)}
            onMouseEnter={() => handleMouseEnter(value)}
            onMouseLeave={handleMouseLeave}
            className={`p-0.5 transition-transform ${
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            }`}
            disabled={!interactive}
            style={{ color: isFilled ? color : '#DFE6E9' }}
          >
            <Star
              size={size}
              fill={isFilled ? color : 'none'}
              strokeWidth={2}
            />
          </button>
        );
      })}
    </div>
  );
};
