import { FileGraphRenderer, Point } from "./graph";
import { Fight, Logs } from "./interfaces";

const data = require("../data/logs.json") as Logs;
const DSR_PHASES = 8;

const fights = data.data.reportData.reports.data
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
  .sort((a, b) => a.startTime - b.startTime);

const points: Point[] = fights.map((f, i) => ({
  x: i,
  y: ((f.lastPhase - 1) * 100 + f.bossPercentage) / DSR_PHASES,
}));

const grapher = new FileGraphRenderer();
grapher.render(points, "out.svg");
