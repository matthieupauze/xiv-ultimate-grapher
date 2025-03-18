import { Component } from '@angular/core';
import { CleanFight, GraphingData, Logs } from './interfaces';

const logs: Logs = require('../assets/logs.json');

const DSR_PHASES = 8;
const phaseMap = new Map([
  // [0, 'P1'],
  [1, 'P2'],
  [2, 'P3'],
  [3, 'P4'],
  [4, 'I1'],
  [5, 'P5'],
  [6, 'P6'],
  [7, 'P7'],
]);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  // TODO(Matt): Pull logs in from API directly, hopefully with caching mechanism
  formattedLogs: GraphingData = logs.data.reportData.reports.data
    .map((x) => ({
      ...x,
      fights: x.fights.filter((x) => x.bossPercentage != null) as CleanFight[],
    }))
    .filter((x) => x.fights.length !== 0)
    .flatMap((curr) => {
      return curr.fights.map((x) => ({
        ...x,
        bossPercentage: 100 - x.bossPercentage,
        startTime: x.startTime + curr.startTime,
      }));
    })
    .sort((a, b) => a.startTime - b.startTime)
    .reduce<GraphingData>((acc, currentFight, index) => {
      const phasef = phaseMap.get(currentFight.lastPhaseAsAbsoluteIndex)!;
      const totalFightPercentage = this.fightToPercentage(currentFight);

      if (!acc.first.has(phasef)) {
        acc.first.set(phasef, totalFightPercentage);
      }

      acc.points.push([index, totalFightPercentage]);
      return acc;
    },
      {
        points: [],
        first: new Map(),
        startTimes: this.getStartTimes(logs)
      }
    );

  private fightToPercentage(fight: CleanFight): number {
    return +(
      (fight.lastPhaseAsAbsoluteIndex * 100 + fight.bossPercentage) /
      DSR_PHASES
    ).toFixed(2);
  }

  private getStartTimes(logs: Logs) {
    const fights = logs.data.reportData.reports.data.sort((a, b) => a.startTime - b.startTime);
    const out = [];
    let pullCounter = 0;

    for (const fight of fights) {
      out.push(pullCounter);
      pullCounter += fight.fights.length;
    }

    return out;
  }
}
