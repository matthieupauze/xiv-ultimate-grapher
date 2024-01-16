import { Component } from '@angular/core';
import { Fight, Logs } from './interfaces';

const logs: Logs = require('../assets/logs.json');

const DSR_PHASES = 8;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  // TODO(Matt): Pull logs in from API directly, hopefully with caching mechanism
  formattedLogs = logs.data.reportData.reports.data
    .filter((x) => x.fights.length !== 0)
    .reduce((acc, curr) => {
      curr.fights.forEach((x) =>
        acc.push({
          ...x,
          bossPercentage: 100 - x.bossPercentage,
          startTime: x.startTime + curr.startTime,
        })
      );
      return acc;
    }, [] as Fight[])
    .sort((a, b) => a.startTime - b.startTime)
    .map((f, i) => [
      i,
      +(
        (f.lastPhaseAsAbsoluteIndex * 100 + f.bossPercentage) /
        DSR_PHASES
      ).toFixed(2),
    ]);
}
