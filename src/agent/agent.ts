import cluster from "cluster";
import signale from "signale";

export interface IAgentConfig {
    script: string;
    args: string[];
    slient: boolean;
    workerNumber: number;
}

let childWorkers: cluster.Worker[] = [];
const RESTARTDURATION = 60;

export default function start(config: IAgentConfig) {

    const masterConfig = {
        args: config.args,
        exec: config.script,
        slient: config.slient,
    };
    // build default master config
    cluster.setupMaster(masterConfig);

    const workerNumber: number = config.workerNumber;

    for (let i = 0; i < workerNumber; i++) {
        const worker: cluster.Worker =  cluster.fork();
        childWorkers.push(worker);
    }

    process.on("exit", () => killAllWorker());
    childWorkers.forEach((worker: cluster.Worker) => {
        doListenWork(worker);
    });
}


function doListenWork(childWorker: cluster.Worker) {
    childWorker.on("exit", handleWorkerExit);
    childWorker.on("error", handleWorkerError);
    childWorker.on("message", handleMessageFromWork);
}

function handleWorkerExit(exitCode: number, signal: string) {
    const liveWorkers: cluster.Worker[] = [];
    childWorkers.forEach((childWorker: cluster.Worker) => {
        if (!childWorker.isDead()) {
            liveWorkers.push(childWorker);
        }
    });

    childWorkers = liveWorkers;
    // resart
    setTimeout(() => {
        const newWorker = cluster.fork();
        liveWorkers.push(newWorker);
        // register event
        doListenWork(newWorker);
    }, RESTARTDURATION);
}

function handleWorkerError(err: Error) {
    let jsonErr = "";
    try {
        jsonErr = JSON.stringify(err);
    } catch (e) {
        // do nothing
    }
    signale.debug(jsonErr);
}

function handleMessageFromWork(message: object) {
    let msg = "";
    try {
        msg =  JSON.stringify(message);
    } catch (e) {
        //
    }
    signale.debug(msg);
}

/**
 * when node exit, kill all sub worker
 * @param childWorkers
 */
function killAllWorker() {
    for (const worker of childWorkers) {
        worker.kill();
    }
}
