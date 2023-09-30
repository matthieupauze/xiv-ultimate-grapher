import { Chart } from "chart.js";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import annotationPlugin, {
  AnnotationOptions,
  AnnotationTypeRegistry,
} from "chartjs-plugin-annotation";
import { writeFileSync } from "fs";

Chart.register(annotationPlugin);

export type Point = {
  x: number; // Unix Millis
  y: number; // Between 0 - 100
};

export interface Renderer {
  render(points: Point[], file: string): void;
}

export class ConsoleRenderer implements Renderer {
  render(points: Point[]): void {
    points.forEach((p) => console.log(`${p.x} ${p.y}`));
  }
}

export class LatestRenderer implements Renderer {
  render(points: Point[]): void {
    console.log(Math.max(...points.map((x) => x.y)));
  }
}

export class FileGraphRenderer implements Renderer {
  chartJSNodeCanvas: ChartJSNodeCanvas;

  constructor(width = 1500, height = 800, backgroundColour = "white") {
    this.chartJSNodeCanvas = new ChartJSNodeCanvas({
      type: "svg",
      width,
      height,
      backgroundColour,
    });
  }

  render(points: Point[], file: string): void {
    const labels: AnnotationOptions<keyof AnnotationTypeRegistry>[] = new Array(
      7
    )
      .fill(0)
      .map((_, i) => ({
        label: {
          content: "P" + (i + 2),
          enabled: true,
          position: "start",
        },
        type: "line" as const,
        yMax: 12.5 * (i + 1),
        yMin: 12.5 * (i + 1),
        borderColor: "rgba(255, 99, 132, 0.3)",
        borderWidth: 2,
      }));

    const image = this.chartJSNodeCanvas.renderToBufferSync({
      type: "line",
      options: {
        plugins: {
          annotation: {
            annotations: labels,
          },
          title: {
            text: "DSR PROG",
            display: true,
            font: {
              size: 36,
            },
          },
        },
        scales: {
          y: {
            axis: "y",
            type: "linear",
            title: {
              text: "Progression",
              display: true,
            },
            min: 0,
            max: 100,
          },
          x: {
            axis: "x",
            type: "linear",
            title: {
              display: true,
              text: "Pulls",
            },
          },
        },
      },
      data: {
        datasets: [
          {
            data: points,
            label: "Clear %",
            borderColor: "#36A2EB",
            backgroundColor: "#9BD0F5",
          },
        ],
      },
    });
    writeFileSync(file, image);
  }
}
