import { WorkerMessage } from './shared/worker-message.model';
import { WORKER_COMMAND} from './shared/worker-command.constants';


export class AppWorkers {
  workerCtx: any;
  created: Date;
  counter: number;
  state : string;

  STATE_ENUM = {
    RUNNING : "RUNNING",
    STOPPED : "STOPPED",
    PAUSED  : "PAUSED"
  };

  constructor(workerCtx: any) {
    this.workerCtx = workerCtx;
    this.created = new Date();
    this.counter = 0;
    this.state = this.STATE_ENUM.STOPPED;
  }

  workerBroker($event: MessageEvent): void {
    const { topic, data } = $event.data as WorkerMessage;
    const workerMessage = new WorkerMessage(topic, data);

    switch (topic) {
      case WORKER_COMMAND.PLAY:
        this.run(workerMessage);
        break;
      case WORKER_COMMAND.PAUSE:
        this.state = this.STATE_ENUM.PAUSED;
        break;
      case WORKER_COMMAND.RESUME:
        this.state = this.STATE_ENUM.RUNNING;
        break;
      case WORKER_COMMAND.STOP:
        this.state = this.STATE_ENUM.STOPPED;
        break;
      case WORKER_COMMAND.VALUE:
        this.returnCounter(workerMessage);
        break;
      default:  // Add support for more workers here
        console.error('Topic Does Not Match');
    }
  };


  run(workerMessage: WorkerMessage){
    while(true){
      if(this.state == this.STATE_ENUM.STOPPED) {
          break;
      }
      if(this.state == this.STATE_ENUM.PAUSED) {
          continue;
      }
      this.returnCounter(workerMessage);
   }
  }

  returnCounter(workerMessage : WorkerMessage){
    this.returnWorkResults(new WorkerMessage(workerMessage.topic, this.counter++));
  }

  /**
   * Posts results back through to the worker
   * @param {WorkerMessage} message
   */
  private returnWorkResults(message: WorkerMessage): void {
    this.workerCtx.postMessage(message);
  }

}