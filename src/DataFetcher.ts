import { Logs } from "./interfaces";

export default class DataFetcher {
  fetch = async (): Promise<Logs> => {
    return require("../data/logs.json");
  };
}
