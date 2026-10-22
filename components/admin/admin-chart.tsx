"use client";

import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  BarController,
  type ChartConfiguration,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  BarController
);

/** Reads a design-system CSS variable (e.g. --primary) at render time. */
function cssVar(name: string): string {
  if (typeof document === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Fixed categorical order (never cycled): primary, lilac, accent, primary-deep. */
function seriesPalette(): string[] {
  return [
    cssVar("--primary"),
    cssVar("--lilac"),
    cssVar("--accent"),
    cssVar("--primary-deep"),
    cssVar("--primary"),
    cssVar("--lilac"),
    cssVar("--accent"),
  ];
}

export function AdminDoughnutChart({
  labels,
  values,
}: {
  labels: string[];
  values: number[];
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const surface = cssVar("--card");
    const ink = cssVar("--foreground");
    const config: ChartConfiguration<"doughnut"> = {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: seriesPalette(),
            borderWidth: 2,
            borderColor: surface,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "62%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: ink,
              boxWidth: 12,
              padding: 12,
            },
          },
        },
      },
    };

    chartRef.current = new ChartJS(ctx, config);
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [labels, values]);

  return (
    <div className="relative h-64">
      <canvas ref={canvasRef} />
    </div>
  );
}

export function AdminBarChart({
  labels,
  values,
}: {
  labels: string[];
  values: number[];
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const tickColor = cssVar("--foreground");
    const config: ChartConfiguration<"bar"> = {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Transactions",
            data: values,
            backgroundColor: cssVar("--primary"),
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: { ticks: { color: tickColor, maxRotation: 45 } },
          y: { ticks: { color: tickColor, precision: 0 } },
        },
      },
    };

    chartRef.current = new ChartJS(ctx, config);
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [labels, values]);

  return (
    <div className="relative h-64">
      <canvas ref={canvasRef} />
    </div>
  );
}
