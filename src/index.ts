import DataFetcher from "./DataFetcher";
import LogFilter from "./LogFilter";
import { FileGraphRenderer } from "./graph";

const DSR_PHASES = 8;

new DataFetcher()
  .fetch()
  .then((data) => new LogFilter(data).asOrderedPoints(DSR_PHASES))
  .then((points) => {
    const grapher = new FileGraphRenderer();
    grapher.render(points, "out.svg");
  });
