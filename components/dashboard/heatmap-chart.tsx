"use client";

import { useState } from "react";
import { Filter, Info } from "lucide-react";
import mockData from "@/data/mockData.json";

// Convert hex colors to RGB
const blueColor = { r: 68, g: 156, b: 251 }; // #449CFB
const purpleColor = { r: 245, g: 112, b: 154 }; // #f5709a

export function HeatmapChart() {
  const { title, data, maxValue } = mockData.dashboard.heatmapChart;
  const payers = mockData.payersList;
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [displayedPayers, setDisplayedPayers] = useState([
    "HCSC",
    "United",
    "Cigna",
    "Elevance Health",
    "CVS Health",
    "Kaiser Per...",
    "Centene",
  ]);

  // Get color based on value - blue to purple gradient with amplified range
  const getColorIntensity = (value: number) => {
    if (value === 0) return "bg-white";

    // Map the actual data range (45-72) to a wider visual range (25-90)
    const actualMin = 45;
    const actualMax = 72;
    const visualMin = 25;
    const visualMax = 90;

    // Normalize the value to the visual range
    let normalizedValue;
    if (value <= actualMin) {
      normalizedValue = 0; // Map to the lightest color
    } else if (value >= actualMax) {
      normalizedValue = 1; // Map to the darkest color
    } else {
      // Map the value proportionally from actual range to visual range
      const actualRange = actualMax - actualMin;
      const visualRange = visualMax - visualMin;
      const actualPosition = (value - actualMin) / actualRange;
      const visualValue = visualMin + actualPosition * visualRange;
      normalizedValue = (visualValue - visualMin) / (visualMax - visualMin);
    }

    // Interpolate between blue and purple based on the normalized value
    const r = Math.round(
      blueColor.r + normalizedValue * (purpleColor.r - blueColor.r)
    );
    const g = Math.round(
      blueColor.g + normalizedValue * (purpleColor.g - blueColor.g)
    );
    const b = Math.round(
      blueColor.b + normalizedValue * (purpleColor.b - blueColor.b)
    );

    return `rgb(${r}, ${g}, ${b})`;
  };

  // Function to abbreviate payer names for better display
  const abbreviatePayer = (name: string) => {
    if (name.includes("(")) {
      // Extract the name before parentheses
      return name.split("(")[0].trim();
    }
    // For other names, return the first 10 characters
    return name.length > 10 ? `${name.substring(0, 10)}...` : name;
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-custom">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium">Policy Coverage Analysis</h3>
          <p className="text-xs text-slate-500 mt-1">
            Policy coverage comparison between payers (%)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md border bg-slate-50 px-3 py-1 text-xs shadow-custom">
            <Filter className="mr-2 h-4 w-4 text-slate-500 no-shadow" />
            <span>Filter</span>
          </div>
          <div className="flex items-center rounded-md border bg-slate-50 px-3 py-1 text-xs shadow-custom">
            <Info className="mr-2 h-4 w-4 text-slate-500 no-shadow" />
            <span>Info</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left text-xs font-medium text-slate-500 w-[120px]"></th>
                {displayedPayers.map((payer) => (
                  <th
                    key={payer}
                    className="p-2 text-center text-xs font-medium text-slate-500 w-[100px]"
                  >
                    <div className="transform -rotate-45 origin-left h-16 flex items-end ml-8">
                      {abbreviatePayer(payer)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayedPayers.map((rowPayer) => (
                <tr key={rowPayer} className="border-t border-slate-100">
                  <td className="p-2 text-xs font-medium text-slate-700 max-w-[120px]">
                    <div className="truncate">{abbreviatePayer(rowPayer)}</div>
                  </td>
                  {displayedPayers.map((colPayer) => {
                    const cellKey = `${rowPayer}-${colPayer}`;
                    const value =
                      rowPayer === colPayer ? 0 : data[cellKey] || 0;

                    return (
                      <td key={colPayer} className="p-1 text-center">
                        <div
                          className={`relative mx-auto h-14 w-24 rounded-sm cursor-pointer transition-all hover:scale-105 flex items-center justify-center no-shadow ${
                            rowPayer === colPayer
                              ? "border border-slate-200"
                              : ""
                          }`}
                          style={{
                            backgroundColor: getColorIntensity(value),
                          }}
                          onMouseEnter={() => setHoveredCell(cellKey)}
                          onMouseLeave={() => setHoveredCell(null)}
                        >
                          {value > 0 && (
                            <span
                              className={`text-sm font-medium ${
                                value > 50 ? "text-white" : "text-slate-700"
                              }`}
                            >
                              {value}
                            </span>
                          )}
                          {hoveredCell === cellKey && value > 0 && (
                            <div className="absolute top-0 left-1/2 -translate-y-full -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs p-1 rounded z-10 whitespace-nowrap shadow-custom">
                              {rowPayer} and {colPayer} have {value}% policy
                              coverage similarity
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex justify-center items-center gap-4">
        <div className="text-xs text-slate-500">Less Similar</div>
        <div className="flex gap-1">
          {[0.1, 0.3, 0.5, 0.7, 0.9].map((intensity, i) => {
            // Interpolate between blue and purple for the legend

            const r = Math.round(
              blueColor.r + intensity * (purpleColor.r - blueColor.r)
            );
            const g = Math.round(
              blueColor.g + intensity * (purpleColor.g - blueColor.g)
            );
            const b = Math.round(
              blueColor.b + intensity * (purpleColor.b - blueColor.b)
            );

            return (
              <div
                key={i}
                className="w-8 h-8 rounded-sm no-shadow"
                style={{
                  backgroundColor: `rgb(${r}, ${g}, ${b})`,
                  border: "1px solid rgba(0,0,0,0.05)",
                }}
              ></div>
            );
          })}
        </div>
        <div className="text-xs text-slate-500">More Similar</div>
      </div>
    </div>
  );
}
