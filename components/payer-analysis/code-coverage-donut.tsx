"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { CHART_COLORS_ARRAY } from "@/lib/chart-colors"

interface CodeCoverageDonutProps {
  codeCoverage?: {
    percentage: number
    details: {
      covered: number
      priorAuth: number
      notCovered: number
    }
  }
}

export function CodeCoverageDonut({ codeCoverage }: CodeCoverageDonutProps) {
  // Default values if codeCoverage is undefined
  const percentage = codeCoverage?.percentage || 0
  const details = codeCoverage?.details || { covered: 0, priorAuth: 0, notCovered: 0 }

  const data = [
    { name: "Covered", value: details.covered },
    { name: "Prior Auth", value: details.priorAuth },
    { name: "Not Covered", value: details.notCovered },
  ]

  // Calculate total to ensure percentages add up to 100%
  const total = data.reduce((acc, item) => acc + item.value, 0)

  // Normalize data if total is not 100
  const normalizedData = data.map((item) => ({
    ...item,
    value: total === 0 ? 0 : Math.round((item.value / total) * 100),
  }))

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={normalizedData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={false}
            >
              {normalizedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS_ARRAY[index % CHART_COLORS_ARRAY.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <span className="text-2xl font-bold">{percentage}%</span>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Coverage Breakdown</h3>
        <div className="flex flex-col gap-2">
          {normalizedData.map((entry, index) => (
            <div key={index} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2 no-shadow"
                style={{ backgroundColor: CHART_COLORS_ARRAY[index % CHART_COLORS_ARRAY.length] }}
              />
              <span className="text-xs">
                {entry.name}: {entry.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
