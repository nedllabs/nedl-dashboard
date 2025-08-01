"use client";

import type React from "react";

import { useState } from "react";
import { Search, Users } from "lucide-react";
import mockData from "@/data/mockData.json";
import { PayerDistributionChart } from "./payer-distribution-chart";
import { PolicyDistributionChart } from "./policy-distribution-chart";
import { CodeCoverageDonut } from "./code-coverage-donut";
import { CodeExplorerTable } from "./code-explorer-table";
import { HealthcarePayerProfilesTable } from "./healthcare-payer-profiles-table";
import { KeyInsightsSection } from "./key-insights-section";
import { HealthcarePayersChart } from "@/components/dashboard/healthcare-payers-chart";
import { PageHeader } from "@/components/ui/page-header";

export function PayerAnalysis() {
  const [selectedPayer, setSelectedPayer] = useState("All Payers");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Create a mapping between the new payer names and the existing data keys
  const payerMapping: Record<string, string> = {
    HCSC: "BCBSNC",
    UnitedHealthcare: "United",
    "Elevance Health (Anthem)": "Elevance Health (formerly Anthem)",
    "BCBS Texas (HCSC)": "Health Care Service Corporation (HCSC)",
    "BCBS Florida (GuideWell)": "BCBSNC", // Map to existing data
    "BCBS Michigan": "BCBSNC", // Map to existing data
    "BCBS Illinois (HCSC)": "Health Care Service Corporation (HCSC)",
    "Highmark BCBS": "BCBSNC", // Map to existing data
    "Kaiser Permanente": "Kaiser Permanente",
    Centene: "Centene Corp.",
    Humana: "Humana",
    "CVS Health/Aetna": "CVS Health (including Aetna)",
    Cigna: "Cigna",
    "Molina Healthcare": "Molina Healthcare",
    "BCBS Massachusetts": "BCBSNC", // Map to existing data
    "BCBS Tennessee": "BCBSNC", // Map to existing data
    "CareFirst BCBS": "BCBSNC", // Map to existing data
    "Independence BCBS": "BCBSNC", // Map to existing data
    WellCare: "Centene Corp.", // WellCare is part of Centene
    "Anthem BCBS (Other States)": "Elevance Health (formerly Anthem)",
  };

  const getPayerData = (payerName: string) => {
    if (payerName === "All Payers") {
      // For "All Payers", use aggregated data
      return {
        metrics: {
          totalPayers: { value: 20, label: "Total Payers" },
          livesCovered: { value: "270.1M", label: "Lives Covered" },
          totalPolicies: {
            value: 14750,
            label: "Total Policies",
            subtitle: "Across all payers",
          },
          recentChanges: {
            value: 421,
            label: "Recent Changes",
            subtitle: "Last 30 days",
          },
        },
        distribution: { commercial: 45, medicare: 30, medicaid: 25 },
        policyDistribution: mockData.payerAnalysis.BCBSNC.policyDistribution,
        codeCoverage: {
          percentage: 78,
          details: { covered: 78, priorAuth: 12, notCovered: 10 },
        },
        codeExplorer: mockData.payerAnalysis.BCBSNC.codeExplorer,
      };
    }

    // Get the mapped key for the selected payer
    const mappedKey = payerMapping[payerName];

    // If we have specific data for this payer, use it
    if (
      mappedKey &&
      mockData.payerAnalysis[mappedKey as keyof typeof mockData.payerAnalysis]
    ) {
      return mockData.payerAnalysis[
        mappedKey as keyof typeof mockData.payerAnalysis
      ];
    }

    // Fallback to BCBSNC data but customize the metrics
    const fallbackData = mockData.payerAnalysis.BCBSNC;
    return {
      ...fallbackData,
      metrics: {
        totalPayers: {
          value: Math.floor(Math.random() * 50) + 80,
          label: "Total Payers",
        },
        livesCovered: {
          value: `${(Math.random() * 30 + 20).toFixed(1)}M`,
          label: "Lives Covered",
        },
        totalPolicies: {
          value: Math.floor(Math.random() * 500) + 1000,
          label: "Total Policies",
          subtitle: "Active policies",
        },
        recentChanges: {
          value: Math.floor(Math.random() * 20) + 25,
          label: "Recent Changes",
          subtitle: "Last 30 days",
        },
      },
    };
  };

  const payerData = getPayerData(selectedPayer);

  const filteredPayers = mockData.payersList.filter((payer) =>
    payer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePayerSelect = (payer: string) => {
    setSelectedPayer(payer);
    setSearchTerm("");
    setShowDropdown(false); // Close dropdown after selection
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <PageHeader
        title="Payer Analysis"
        description="Analyze payer policies and coverage metrics across your network"
        className="mb-8"
      />

      {/* Search Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              Select Payer:
            </span>
          </div>

          <div className="flex-1 max-w-lg relative">
            <div
              className="relative rounded-full overflow-hidden"
              style={{
                background:
                  "linear-gradient(white, white) padding-box, linear-gradient(90deg, #449CFB, #F5709A) border-box",
                borderWidth: "2px",
                borderStyle: "solid",
                borderColor: "transparent",
              }}
            >
              <input
                type="text"
                placeholder="Search payers..."
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={() => {
                  // Delay hiding dropdown to allow for clicks
                  setTimeout(() => setShowDropdown(false), 150);
                }}
                className="w-full rounded-full border-0 py-3 px-6 focus:outline-none bg-white text-sm"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
            </div>

            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-lg z-10">
                <button
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 border-b text-sm ${
                    selectedPayer === "All Payers"
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : ""
                  }`}
                  onMouseDown={(e) => e.preventDefault()} // Prevent blur event
                  onClick={() => handlePayerSelect("All Payers")}
                >
                  All Payers
                </button>
                {(searchTerm ? filteredPayers : mockData.payersList).map(
                  (payer) => (
                    <button
                      key={payer}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 border-b last:border-b-0 text-sm ${
                        selectedPayer === payer
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : ""
                      }`}
                      onMouseDown={(e) => e.preventDefault()} // Prevent blur event
                      onClick={() => handlePayerSelect(payer)}
                    >
                      {payer}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          <div className="text-sm text-gray-600">
            Selected:{" "}
            <span className="font-medium text-blue-600">{selectedPayer}</span>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-sm font-medium text-gray-500">
            {payerData.metrics.totalPayers.label}
          </h3>
          <p className="text-2xl font-bold mt-2">
            {payerData.metrics.totalPayers.value}
          </p>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-sm font-medium text-gray-500">
            {payerData.metrics.livesCovered.label}
          </h3>
          <p className="text-2xl font-bold mt-2">
            {payerData.metrics.livesCovered.value}
          </p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            {payerData.metrics.totalPolicies.label}
          </h3>

          {/* Main Total Policies Value */}
          <div className="mb-3">
            <p className="text-xl font-bold text-gray-900">
              {payerData.metrics.totalPolicies.value}
            </p>
            {payerData.metrics.totalPolicies.subtitle && (
              <p className="text-xs text-gray-500 mt-1">
                {payerData.metrics.totalPolicies.subtitle}
              </p>
            )}
          </div>

          {/* Additional Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
            <div className="text-center">
              <p className="text-sm font-semibold text-blue-600">12,400</p>
              <p className="text-xs text-gray-500">Proc Codes</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-green-600">92</p>
              <p className="text-xs text-gray-500">EIU Proc Code</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-purple-600">1,524</p>
              <p className="text-xs text-gray-500">Services</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-sm font-medium text-gray-500">
            {payerData.metrics.recentChanges.label}
          </h3>
          <p className="text-2xl font-bold mt-2">
            {payerData.metrics.recentChanges.value}
          </p>
          {payerData.metrics.recentChanges.subtitle && (
            <p className="text-sm text-gray-500 mt-1">
              {payerData.metrics.recentChanges.subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="mb-6">
        {/* Healthcare Payers Chart - Full Width */}
        <HealthcarePayersChart selectedPayer={selectedPayer} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
        <PayerDistributionChart distribution={payerData.distribution} />
        <PolicyDistributionChart data={payerData.policyDistribution} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
        <div className="bg-white rounded-lg border p-6 h-[400px] flex flex-col">
          <div className="mb-4">
            <h2 className="text-base font-semibold">Coverage Analysis</h2>
            <p className="text-sm text-gray-600">Code Coverage</p>
          </div>
          <div className="flex-1">
            <CodeCoverageDonut codeCoverage={payerData.codeCoverage} />
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6 h-[400px] flex flex-col">
          <h2 className="text-base font-semibold mb-4">Code Explorer</h2>
          <div className="flex-1 overflow-hidden">
            <CodeExplorerTable codeExplorer={payerData.codeExplorer} />
          </div>
        </div>
      </div>

      <div className="mb-6">
        {/* Healthcare Payer Profiles Table */}
        <HealthcarePayerProfilesTable />
      </div>

      {/* Key Insights Section */}
      <KeyInsightsSection />
    </div>
  );
}
