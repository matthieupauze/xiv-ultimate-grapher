import { Component } from '@angular/core';
import { CleanFight, Fight, Logs } from './interfaces';

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
    .map((x) => ({
      ...x,
      fights: x.fights.filter((x) => x.bossPercentage != null) as CleanFight[],
    }))
    .filter((x) => x.fights.length !== 0)
    .reduce<(Fight & { bossPercentage: number })[]>((acc, curr) => {
      curr.fights
        .filter((f) => f.bossPercentage != null)
        .forEach((x) =>
          acc.push({
            ...x,
            bossPercentage: 100 - x.bossPercentage,
            startTime: x.startTime + curr.startTime,
          })
        );
      return acc;
    }, [])
    .sort((a, b) => a.startTime - b.startTime)
    .map((f, i) => [
      i,
      +(
        (f.lastPhaseAsAbsoluteIndex * 100 + f.bossPercentage) /
        DSR_PHASES
      ).toFixed(2),
    ]);
}
