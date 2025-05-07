import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { Data } from './+page'
import React from 'react'
import { capitalizeText } from '@/utils'

export function ChartSections({ store }: { store?: Data | null }) {
  const { sections = {}, programs = {} } = store || {}
  const chart = React.useMemo(() => {
    const data = Object.entries(sections).map(([key, value]) => ({
      period: key,
      ...value
    }))

    const config = Object.entries(programs).reduce(
      (acc, [key, label], index) => {
        acc[key] = {
          label: capitalizeText(label),
          color: `hsl(var(--chart-${index + 1}))`
        }
        return acc
      },
      {} as Record<string, { label: string; color: string }>
    ) satisfies ChartConfig

    return {
      data,
      config
    }
  }, [sections, programs])

  const totalSections = React.useMemo(() => {
    const total = Object.entries(sections).reduce((acc, [, value]) => {
      return acc + Object.values(value).reduce((acc, item) => acc + item, 0)
    }, 0)
    return total
  }, [sections])

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Secciones</CardTitle>
        <CardDescription></CardDescription>
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
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            {Object.entries(programs).map(([key], index) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                fill={`hsl(var(--chart-${index + 1}))`}
                radius={[index === 0 ? 0 : 4, index === 0 ? 0 : 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total secciones {totalSections}
        </div>
        <div className="leading-none text-muted-foreground">
          Secciones agrupadas por periodo y programa academico.
        </div>
      </CardFooter>
    </Card>
  )
}
