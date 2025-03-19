import { Component } from '@angular/core';
import { CleanFight, GraphingData, LogData, LogsFile } from './interfaces';

const encounters = [{
  name: 'DSR',
  logs: readJsonFight('dsr'),
  phases: 8,
  phaseNames: {
    // 0: 'P1',
    1: 'P2',
    2: 'P3',
    3: 'P4',
    4: 'I1',
    5: 'P5',
    6: 'P6',
    7: 'P7',
  }
},
{
  name: 'FRU',
  logs: readJsonFight('fru'),
  phases: 5,
  phaseNames: {
    // 0: 'P1',
    1: 'P2',
    2: 'P3',
    3: 'P4',
    4: 'P5',
  } as Record<number, string>
}]

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  formattedLogs: GraphingData[];

  constructor() {
    this.formattedLogs = this.extractEncounters();
  }

  private extractEncounters(): GraphingData[] {
    const out: GraphingData[] = [];
    for (const encounter of encounters) {
      const val = encounter.logs
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
          const phasef = encounter.phaseNames[currentFight.lastPhaseAsAbsoluteIndex];
          const totalFightPercentage = this.fightToPercentage(currentFight, encounter.phases);

          if (!acc.first.has(phasef)) {
            acc.first.set(phasef, totalFightPercentage);
          }

          acc.points.push([index, totalFightPercentage]);
          return acc;
        },
          {
            title: encounter.name,
            points: [],
            first: new Map(),
            startTimes: this.getStartTimes(encounter.logs),
          }
        );
      out.push(val)
    }
    return out
  }

  private fightToPercentage(fight: CleanFight, phaseCount: number): number {
    return +(
      (fight.lastPhaseAsAbsoluteIndex * 100 + fight.bossPercentage) /
      phaseCount
    ).toFixed(2);
  }

  private getStartTimes(data: LogData[]) {
    const fights = data.sort((a, b) => a.startTime - b.startTime);
    const out = [];
    let pullCounter = 0;

    for (const fight of fights) {
      out.push(pullCounter);
      pullCounter += fight.fights.length;
    }

    return out;
  }
}

function readJsonFight(name: string): LogData[] {
  const f: LogsFile = require(`../assets/${name}.json`)
  return f.data.reportData.reports.data;
}