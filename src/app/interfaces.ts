export interface Fight {
  id: number;
  startTime: number;
  bossPercentage: number | null | undefined; // Lower is better
  lastPhaseAsAbsoluteIndex: number;
}

export type CleanFight = Fight & { bossPercentage: number };

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
