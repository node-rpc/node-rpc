import cluster from "cluster";

export interface IAgentConfig {
    script: string;
    args: string[];
    slient: boolean;
    workerNumber: number;
}

export default function start(config: IAgentConfig) {

    const masterConfig = {
        args: config.args,
        exec: config.script,
        slient: config.slient,
    };
    // config default master config
    cluster.setupMaster(masterConfig);

    const workerNumber: number = config.workerNumber;
    const childWorkers: cluster.Worker[] = [];

    for (let i = 0; i < workerNumber; i++) {
        const worker: cluster.Worker =  cluster.fork();
        childWorkers.push(worker);
    }
}


function doListenWork(workers: cluster.Worker[]) {
    workers.forEach((worker: cluster.Worker) => {
        worker.on("exit", handleWorkerExit);
        worker.on("error", handleWorkerError);
        worker.on("message", handleMessageFromWork);
    });
}

function handleWorkerExit(exitCode: number, signal: string) {
    console.log(exitCode);
    console.log(signal);
}

function handleWorkerError(err: Error) {
    console.log(err);
}

function handleMessageFromWork(message: string) {
    console.log(message);
}
