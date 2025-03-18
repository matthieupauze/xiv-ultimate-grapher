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
  points: number[][];
  first: Map<string, number>;
  startTimes: number[];
};

export type Logs = {
  data: {
    reportData: {
      reports: {
        data: {
          code: string;
          startTime: number;
          fights: Fight[];
        }[];
      };
    };
  };
};
