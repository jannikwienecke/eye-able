import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import type { ChartDataType } from "@/types";

export const description = "A chart of US population growth";

const chartConfig = {
  desktop: {
    label: "US Population",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartCard({ chartData }: { chartData: ChartDataType[] }) {
  const unique = React.useId();
  const headingId = `${unique}-chart-title`;
  const descId = `${unique}-chart-desc`;
  const tableId = `${unique}-chart-table`;

  const prefersReducedMotion = usePrefersReducedMotion();

  const yValues = chartData
    .map((d) => Number(d["Population"] ?? 0))
    .filter((v) => Number.isFinite(v));

  // we adjust the yMin so that the chart is not too close to the origin
  // this makes the differences between the bars more visible
  const yMin = yValues.length ? Math.min(...yValues) - 10000000 : 0;

  const yMax = yValues.length ? Math.max(...yValues) : 0;
  const range = yMax - yMin;

  const padding = yValues.length
    ? Math.max(1, range === 0 ? Math.max(1, yMax * 0.01) : range * 0.1)
    : 0;

  const domain: [number, number] = [yMin - padding, yMax + padding];

  const startYear = chartData[0]?.Years ?? "";
  const endYear = chartData[chartData.length - 1]?.Years ?? "";

  const firstPopulation = chartData[0]?.Population;
  const lastPopulation = chartData[chartData.length - 1]?.Population;
  const averageGrowthPct =
    typeof firstPopulation === "number" &&
    firstPopulation > 0 &&
    typeof lastPopulation === "number"
      ? ((lastPopulation - firstPopulation) / firstPopulation) * 100
      : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle id={headingId}>US Population Growth</CardTitle>
        <CardDescription id={descId}>
          The total population of the United States from {startYear} to{" "}
          {endYear}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div
          role="img"
          aria-labelledby={`${headingId} ${descId}`}
          aria-describedby={tableId}
        >
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={"Years" satisfies keyof ChartDataType}
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 4)}
              />
              <YAxis
                domain={domain}
                tickLine={false}
                axisLine={false}
                width={70}
                tickFormatter={(value: number) =>
                  new Intl.NumberFormat("en", {
                    notation: "compact",
                    maximumFractionDigits: 1,
                  }).format(value)
                }
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey={"Population" satisfies keyof ChartDataType}
                fill="var(--color-desktop)"
                radius={8}
                isAnimationActive={!prefersReducedMotion}
              />
            </BarChart>
          </ChartContainer>
        </div>

        <table className="sr-only" id={tableId}>
          <caption>US population by year for the selected range</caption>
          <thead>
            <tr>
              <th scope="col">Year</th>
              <th scope="col">Population</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((row) => (
              <tr key={row.Years}>
                <td>{row.Years}</td>
                <td>{new Intl.NumberFormat("en").format(row.Population)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Average growth: {averageGrowthPct.toFixed(2)}%
        </div>
      </CardFooter>
    </Card>
  );
}
