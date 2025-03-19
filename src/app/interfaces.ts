export type Fight = {
  id: number;
  startTime: number;
  bossPercentage: number | null | undefined; // Lower is better
  lastPhaseAsAbsoluteIndex: number;
};

export type CleanFight = {
  id: number;
  startTime: number;
  bossPercentage: number;
  lastPhaseAsAbsoluteIndex: number;
}

export type GraphingData = {
  title: string;
  points: number[][];
  first: Map<string, number>;
  startTimes: number[];
};

export type LogsFile = {
  data: {
    reportData: {
      reports: {
        data: LogData[];
      };
    };
  };
};

export type LogData = {
  code: string;
  startTime: number;
  fights: Fight[];
}