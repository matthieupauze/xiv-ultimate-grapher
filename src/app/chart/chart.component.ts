import { Component, Input } from '@angular/core';
import * as Highcharts from 'highcharts';

import { YAxisPlotLinesOptions } from 'highcharts';
//@ts-ignore
import * as MouseWheelZoom from 'highcharts/modules/mouse-wheel-zoom.js';
import { GraphingData } from '../interfaces';
MouseWheelZoom(Highcharts);

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent {
  @Input({ required: true })
  set data(data: GraphingData) {
    this.chartOptions = {
      title: {
        text: 'DSR PROG',
      },
      yAxis: {
        min: 0,
        max: 100,
        offset: 15,
        tickAmount: 0,
        labels: {
          format: '{value}%',
          enabled: false,
        },
        title: {
          text: 'Progression (%)',
        },
        plotLines: this.formatPlotlines(data),
      },
      chart: {
        zooming: {
          type: 'x',
        },
        panKey: 'alt',
        panning: {
          enabled: true,
          type: 'x',
        },
      },
      xAxis: {
        title: {
          text: 'Pulls',
        },
        plotLines: this.formatDayLines(data),
      },
      series: [
        {
          data: data.points,
          type: 'scatter',
          name: 'Pulls',
        },
      ],
      credits: {
        enabled: false,
      },
    };
  }

  private formatPlotlines(data: GraphingData): YAxisPlotLinesOptions[] {
    return [...data.first.entries()].map(([phase, percentage]) => ({
      value: percentage,
      dashStyle: 'dash' as any,
      label: {
        text: phase,
        x: -10,
      },
    }));
  }

  private formatDayLines(data: GraphingData): Highcharts.XAxisPlotLinesOptions[] {
    return data.startTimes.map((x, i) => ({
      value: x,
      dashStyle: 'LongDash',
      label: { text: (i + 1).toString(), rotation: 0, y: -5 }
    }))
  }

  Highcharts: typeof Highcharts = Highcharts;
  chartConstructor: string = 'chart';
  chartOptions: Highcharts.Options = {};
  updateFlag: boolean = false;
  oneToOneFlag: boolean = true;
  runOutsideAngular: boolean = false;
}
