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
    .reduce<CleanFight[]>((acc, curr) => {
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
    .reduce<GraphingData>(
      (acc, currentFight, i) => {
        const phasef = phaseMap.get(currentFight.lastPhaseAsAbsoluteIndex)!;
        const totalFightPercentage = this.fightToPercentage(currentFight);

        if (!acc.first.has(phasef)) {
          acc.first.set(phasef, totalFightPercentage);
        }

        acc.points.push([i, totalFightPercentage]);
        return acc;
      },
      {
        points: [],
        first: new Map(),
      }
    );

  private fightToPercentage(fight: CleanFight): number {
    return +(
      (fight.lastPhaseAsAbsoluteIndex * 100 + fight.bossPercentage) /
      DSR_PHASES
    ).toFixed(2);
  }
}
