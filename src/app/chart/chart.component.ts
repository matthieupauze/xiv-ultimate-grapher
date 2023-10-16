import { Component, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import { YAxisPlotLinesOptions } from 'highcharts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent {
  private plotLines: YAxisPlotLinesOptions[] = new Array(7)
    .fill(0)
    .map((_, i) => ({
      label: {
        text: 'P' + (i + 2),
      },
      value: 12.5 * (i + 1),
    }));

  @Input({ required: true })
  set data(data: number[][]) {
    this.chartOptions = {
      title: {
        text: 'DSR PROG',
      },
      yAxis: {
        min: 0,
        max: 100,
        title: {
          text: 'Progression',
        },
        plotLines: this.plotLines,
      },
      xAxis: {
        title: {
          text: 'Pulls',
        },
      },
      series: [
        {
          data,
          type: 'line',
          name: 'Pulls'
        },
      ],
      credits: {
        enabled: false,
      },
    };
  }

  Highcharts: typeof Highcharts = Highcharts;
  chartConstructor: string = 'chart';
  chartOptions: Highcharts.Options = {};
  updateFlag: boolean = false;
  oneToOneFlag: boolean = true;
  runOutsideAngular: boolean = false;
}
