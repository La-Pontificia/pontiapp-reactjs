
import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Data } from "./+page"
import { capitalizeText } from "@/utils"

export function ChartSchedules({
  store,
}: {
  store?: Data | null
}) {

  const { schedules, programs = {} } = store || {}

  const chart = React.useMemo(() => {
    const data = Object.entries(schedules?.data || {}).map(([key, value], i) => ({
      id: (i + 1).toString(),
      schedules: value,
      program: programs[key] || "Sin programa",
      fill: `var(--color-${i + 1})`,
    }));

    type ChartConfig = Record<string, { label: string; color: string }>;

    const config: ChartConfig = data.reduce((acc, { id, program }) => {
      acc[id] = {
        label: capitalizeText(program),
        color: `hsl(var(--chart-${id}))`,
      };
      return acc;
    }, {} as ChartConfig) satisfies ChartConfig;

    return {
      data, config
    };
  }, [schedules, programs]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Horarios academicos</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chart.config}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chart.data}
              dataKey="schedules"
              nameKey="id"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {schedules?.total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {(schedules && schedules?.total > 1) ? "horarios" : "horario"}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Horarios por programas académicos
        </div>
        <div className="leading-none text-center text-muted-foreground">
          Horarios visibles que esten activos, con o sin docentes asignados
        </div>
      </CardFooter>
    </Card>
  )
}
