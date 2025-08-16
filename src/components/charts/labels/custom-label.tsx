import { ToolTipElement } from '@/@types/charts';

const RADIAN = Math.PI / 180;
export const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: ToolTipElement) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
