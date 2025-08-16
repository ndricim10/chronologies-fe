import { PayloadChart } from '@/@types/charts';

export const CustomMiddleLabelList = ({ x, y, width, height, value, layout }: PayloadChart) => {
  /** position the text in the center of a bar piece, x-scale */
  const xAxisTextPosition = layout === 'vertical' ? x + width + 2 : x + width / 2;

  /**
   *  Calculate the text size for a bar chart piece,
   *  if height will be smaller than 12, the size of the text will be reduced to that height
   */
  const textSize = Math.ceil(height > 12 ? 12 : height);

  /** position the text in the center of a bar piece, y-scale */
  const yAxisTextPosition = y + height / 2 + textSize / 2.5;

  return height > 8 ? (
    <g>
      <circle cx={xAxisTextPosition} cy={yAxisTextPosition} width={100} />
      <text
        x={xAxisTextPosition}
        y={yAxisTextPosition}
        fill={`${layout === 'horizontal' ? '#ffffff' : ''}`}
        fontSize={`${layout === 'horizontal' ? `${textSize}px` : '11px'}`}
        dominantBaseline="top"
        textAnchor={`${layout === 'horizontal' ? `middle` : ''}`}
        className="zIndex"
        fontWeight={600}
      >
        {value.toLocaleString()}
      </text>
    </g>
  ) : null;
};
