"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Data } from "./+page"
import React from "react"
import { capitalizeText } from "@/utils"


export function ChartPlans({
  store
}: {
  store?: Data | null
}) {
  const { plans = {}, programs = {} } = store || {}

  const chart = React.useMemo(() => {

    const data = Object.entries(plans).map(([key, value], i) => ({
      career: key,
      careerName: capitalizeText(programs[key] || "Sin programa"),
      count: value,
      fill: `hsl(var(--chart-${i + 1}))`,
    }))

    const config = Object.entries(programs).reduce((acc, [key, label], index) => {
      acc[key] = {
        label: capitalizeText(label),
        color: `hsl(var(--chart-${index + 1}))`,
      };
      return acc;
    }, {} as Record<string, { label: string; color: string }>) satisfies ChartConfig

    return {
      data,
      config
    }
  }, [plans, programs])

  const totalPlans = React.useMemo(() => {
    const total = Object.entries(plans).reduce((acc, [, value]) => {
      return acc + value
    }, 0)
    return total
  }, [plans])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Planes de estudio</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{
          ...chart.config,
          count: {
            label: "Planes",
          }
        }}>
          <BarChart
            accessibilityLayer
            data={chart.data}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="career"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="count"
              layout="vertical"
              fill="var(--color-count)"
              radius={4}
            >
              <LabelList
                dataKey="careerName"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="count"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total planes de estudio {totalPlans}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
