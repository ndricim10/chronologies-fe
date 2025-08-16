import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  XAxisProps,
  YAxis,
  YAxisProps,
} from 'recharts';
import { XAxisLineChart, compactNumberFormatter } from './common/custom-x-axis-chart';
import { useXAxisTopSettings } from './common/x-y-axis-settings';
import { getDomainValue } from './domains/get-domain-value';
import { CustomMiddleLabelList } from './labels/custom-bar-chart-label';
import { ChartParams, PayloadChart } from '@/@types/charts';
import { colorList } from './common/data';
import WrapperChart from './wrapper-chart';
import { ReferenceLine } from 'recharts';

export default function CustomBarChart({
  data = [],
  barSize = 80,
  height = 500,
  width = '100%',
  barName = 'name',
  layout = 'horizontal',
  colors = colorList,
  showLabel = true,
  isLoading = false,
  referenceLineColor = 'white',
  isReferenceLine = false,
  stackId = undefined,
  radius = [0, 0, 0, 0],
}: ChartParams) {
  const xAxisSettings = useXAxisTopSettings();

  const dataKeys = data.length > 0 ? Object.keys(data[0]).filter((key) => key !== barName && key !== 'emertimi') : [];

  return (
    <WrapperChart {...{ data, isLoading }}>
      <ResponsiveContainer {...{ width, height }} className="mt-6">
        <BarChart
          data={data}
          layout={layout}
          margin={{
            top: 24,
            bottom: 6,
            right: 22,
          }}
        >
          {layout === 'horizontal' ? (
            <>
              {isReferenceLine && <ReferenceLine y={0} stroke={referenceLineColor} />}
              <XAxis {...(xAxisSettings as XAxisProps)} dataKey={barName} interval={0} tick={XAxisLineChart} />
              <YAxis
                type="number"
                domain={[0, getDomainValue(data)]}
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tickFormatter={compactNumberFormatter}
                interval={0}
                tick={true}
              />
              <CartesianGrid vertical={false} horizontal={true} />
            </>
          ) : (
            <>
              {isReferenceLine && <ReferenceLine y={0} stroke={referenceLineColor} />}

              <XAxis
                type="number"
                domain={[0, getDomainValue(data)]}
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tickFormatter={compactNumberFormatter}
                interval={0}
                tick={true}
              />
              <YAxis {...(xAxisSettings as YAxisProps)} dataKey={barName} interval={0} tick={XAxisLineChart} />
            </>
          )}
          {dataKeys.map((key, index) => (
            <>
              <Bar key={index} name={key} dataKey={key} isAnimationActive={false} {...{ stackId, barSize, radius }}>
                {data.map((_, entryIndex) => (
                  <Cell
                    key={`cell-${key}-${entryIndex}`}
                    fill={colors[(index + entryIndex) % colors.length]}
                    style={{ outline: 'none' }}
                  />
                ))}

                {showLabel && (
                  <LabelList
                    dataKey={key}
                    content={(props: unknown) => <CustomMiddleLabelList {...(props as PayloadChart)} layout={layout} />}
                  />
                )}
              </Bar>
            </>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </WrapperChart>
  );
}
