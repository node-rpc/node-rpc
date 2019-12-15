import commander from "commander";
import os from "os";
import path from "path";
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
