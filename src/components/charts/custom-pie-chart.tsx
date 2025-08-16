import { ChartParams, ToolTipElement } from '@/@types/charts';
import { Cell, Legend, Pie, Tooltip } from 'recharts';
import { PieChart, ResponsiveContainer } from 'recharts';
import PieChartTooltip from './tooltips/pie-chart-tooltip';
import { renderLegend } from './legends/custom-legend';
import { colorList } from './common/data';
import WrapperChart from './wrapper-chart';

export default function CustomPieChart({
  data = [],
  showLegend = true,
  tooltipData,
  setTooltipData,
  colors = colorList,
  width = '100%',
  height = 350,
  isLoading = false,
  nameKey = 'name',
  outerRadius = '90%',
}: ChartParams) {
  const handleMouseEnter = (data: ToolTipElement) => {
    setTooltipData?.({
      ...data,
      payload: [data.payload],
    });
  };

  const handleMouseLeave = () => setTooltipData?.(undefined);

  return (
    <>
      <WrapperChart {...{ data, isLoading }}>
        <ResponsiveContainer {...{ width, height }}>
          <PieChart>
            <Tooltip
              content={
                <PieChartTooltip
                  name={nameKey}
                  tooltipPayload={tooltipData?.tooltipPayload}
                  tooltipData={tooltipData}
                />
              }
              cursor={false}
            />
            {showLegend && <Legend formatter={renderLegend} />}
            <Pie
              paddingAngle={1}
              minAngle={1}
              data={data}
              dataKey="value"
              nameKey={nameKey}
              labelLine={false}
              outerRadius={outerRadius}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              isAnimationActive={false}
              cursor="pointer"
            >
              {colors.map((entry, index: number) => (
                <Cell key={`cell-${index}`} fill={entry} style={{ outline: 'none' }} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </WrapperChart>
    </>
  );
}
