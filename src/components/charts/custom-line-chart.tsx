import { ChartParams, ToolTipElement } from '@/@types/charts';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  XAxisProps,
  YAxis,
} from 'recharts';
import { useXAxisTopSettings } from './common/x-y-axis-settings';
import { compactNumberFormatter, XAxisLineChart } from './common/custom-x-axis-chart';
import { getDomainValue } from './domains/get-domain-value';
import { renderLegend } from './legends/custom-legend';
import { defaultLegendWrapperStyle } from './common/styles';
import { colorList } from './common/data';
import LineChartCustomToolTip from './tooltips/line-chart-tooltip';
import WrapperChart from './wrapper-chart';

const CustomLineChart = ({
  data = [],
  showLegend = true,
  setTooltipData,
  tooltipData,
  colors = colorList,
  width = '100%',
  height = 350,
  isLoading = false,
}: ChartParams) => {
  const xAxisSettings = useXAxisTopSettings();

  const handleMouseEnter = (data: ToolTipElement) =>
    setTooltipData?.({
      ...data,
      payload: [data.payload],
    });

  const handleMouseLeave = () => setTooltipData?.(undefined);

  const secondFieldKeys =
    data.length > 0 ? Object.keys(data[0]).filter((key) => key !== 'field' && key !== 'value') : [];

  return (
    <WrapperChart {...{ data, isLoading }}>
      <ResponsiveContainer {...{ width, height }}>
        <LineChart
          data={data}
          margin={{
            top: 13,
            right: 30,
            left: 20,
            bottom: 30,
          }}
          layout="horizontal"
        >
          <Tooltip
            content={
              <LineChartCustomToolTip
                name={tooltipData?.name}
                payload={tooltipData?.payload}
                color={tooltipData?.stroke}
                tooltipData={tooltipData}
              />
            }
            cursor={false}
          />
          <>
            <CartesianGrid strokeDasharray={undefined} vertical={false} />
            <XAxis {...(xAxisSettings as XAxisProps)} interval={0} tick={XAxisLineChart} />
            <YAxis
              type="number"
              domain={[0, getDomainValue(data)]}
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tickFormatter={compactNumberFormatter}
              width={undefined}
              tick={true}
            />
            {showLegend && (
              <Legend formatter={renderLegend} verticalAlign="bottom" wrapperStyle={defaultLegendWrapperStyle} />
            )}
            {secondFieldKeys?.map((item, index: number) => {
              return (
                <Line
                  key={item}
                  name={item}
                  dataKey={item}
                  strokeWidth={2}
                  type="linear"
                  stroke={colors[index]}
                  fill={colors[index]}
                  dot={{
                    fill: colors[index],
                    stroke: colors[index],
                    strokeWidth: 5,
                    r: 2,
                  }}
                  onMouseEnter={(e) => handleMouseEnter(e as ToolTipElement)}
                  onMouseLeave={handleMouseLeave}
                />
              );
            })}
          </>
        </LineChart>
      </ResponsiveContainer>
    </WrapperChart>
  );
};

export default CustomLineChart;
