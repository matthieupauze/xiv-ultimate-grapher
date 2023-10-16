export interface Fight {
  id: number;
  startTime: number;
  bossPercentage: number; // Lower is better
  lastPhaseAsAbsoluteIndex: number;
}

export interface Logs {
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
}
