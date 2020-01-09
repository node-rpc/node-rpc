import commander from "commander";
import os from "os";
import packageJson from "../../package.json";
import Start, { IAgentConfig } from "./agent";


const numOfCpus = os.cpus().length;
const defaultConfig: IAgentConfig = {
    args: [],
    script: "",
    slient: true,
    workerNumber: numOfCpus,
};

const program = new commander.Command();
program.version(packageJson.version);

program
    .option("-t, --thread <number>", "thread number to start", numOfCpus)
    .requiredOption("-s, --script <type>", "application name to start");

program.parse(process.argv);

// run application
Start(Object.assign({}, defaultConfig, { script: program.script, workerNumber: program.thread }));
