'use client'

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { Data } from './+page'
import React from 'react'

export function ChartClassrooms({ store }: { store?: Data | null }) {
  const { classrooms = {} } = store || {}

  const chart = React.useMemo(() => {
    const data = Object.entries(classrooms).map(([key, value], i) => ({
      type: key,
      count: value,
      fill: `hsl(var(--chart-${i + 1}))`
    }))

    const config = data.reduce((acc, { type }, index) => {
      acc[type] = {
        label: type,
        color: `hsl(var(--chart-${index + 1}))`
      }
      return acc
    }, {} as Record<string, { label: string; color: string }>) satisfies ChartConfig

    return {
      data,
      config: {
        ...config,
        count: {
          label: 'Aulas'
        }
      }
    }
  }, [classrooms])

  const totalClassrooms = React.useMemo(() => {
    return Object.values(classrooms).reduce((acc, item) => acc + item, 0)
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
              dataKey="type"
              tickLine={false}
              tickMargin={10}
              tick={({ y, x, payload }) => {
                const words = payload.value.split(' ')
                return (
                  <text x={x} y={y + 0} textAnchor="middle" fill="#666">
                    {words.map((word: string, index: number) => (
                      <tspan x={x} dy={index === 0 ? 0 : 12} key={index}>
                        {word}
                      </tspan>
                    ))}
                  </text>
                )
              }}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            {/* <ChartLegend content={<ChartLegendContent />} /> */}
            <Bar dataKey="count" strokeWidth={2} radius={8} />
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
