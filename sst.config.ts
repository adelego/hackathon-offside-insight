import { SSTConfig } from "sst";
import { Core } from "./stacks/Core";

export default {
  config(_input) {
    return {
      name: "hackathon-rugby-is-easy",
      region: "eu-west-1",
    };
  },
  stacks(app) {
    app.stack(Core);
  },
} satisfies SSTConfig;
