import React from 'react';

const getDurabilityColor = (percent: number): string => {
  if (percent >= 50) return 'bg-white/80';
  if (percent >= 25) return 'bg-[#FFC857]';
  return 'bg-red-500';
};

const getWeightColor = (percent: number): string => {
  if (percent >= 90) return 'bg-red-500';
  if (percent >= 80) return 'bg-[#FFC857]';
  return 'bg-white/60';
};

const WeightBar: React.FC<{ percent: number; durability?: boolean }> = ({ percent, durability }) => {
  const color = React.useMemo(() => {
    return durability ? getDurabilityColor(percent) : getWeightColor(percent);
  }, [percent, durability]);

  return (
    <div className={`w-full overflow-hidden ${durability ? 'h-[2px] bg-black/50 rounded-full' : 'h-1.5 bg-black/40 rounded-full border border-white/10'}`}>
      <div
        className={`h-full rounded-full transition-all duration-300 ${color}`}
        style={{
          width: `${Math.min(Math.max(percent, 0), 100)}%`,
        }}
      />
    </div>
  );
};

export default WeightBar;
