"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Data } from "./+page"
import React from "react"
import { CLASSROOM_TYPES } from "@/const"

export function ChartClassrooms({
  store
}: {
  store?: Data | null
}) {

  const { classrooms = {} } = store || {}

  const chart = React.useMemo(() => {

    const data = Object.entries(classrooms).map(([key, value]) => ({
      period: key,
      ...value
    }))

    const config = CLASSROOM_TYPES.reduce((acc, key, index) => {
      acc[key] = {
        label: key,
        color: `hsl(var(--chart-${index + 2}))`,
      };
      return acc;
    }, {} as Record<string, { label: string; color: string }>) satisfies ChartConfig

    return {
      data,
      config
    }
  }, [classrooms])

  const totalClassrooms = React.useMemo(() => {
    const total = Object.entries(classrooms).reduce((acc, [, value]) => {
      return acc + Object.values(value).reduce((acc, item) => acc + item, 0)
    }, 0)
    return total
  }, [classrooms])

  return (
    <Card className="lg:col-span-2 min-h-[400px]">
      <CardHeader>
        <CardTitle>Aulas</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chart.config}>
          <BarChart accessibilityLayer data={chart.data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="period"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            {
              CLASSROOM_TYPES.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="a"
                  fill={`hsl(var(--chart-${index + 2}))`}
                  radius={4}
                />
              ))
            }
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total aulas {totalClassrooms}
        </div>
        <div className="leading-none text-muted-foreground">
          Aulas agrupadas por tipo y periodo.
        </div>
      </CardFooter>
    </Card>
  )
}
