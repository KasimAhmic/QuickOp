export class Timer {
  private static readonly NS_IN_MS = 1e6;
  private static readonly NS_IN_SEC = 1e9;

  private startTime: bigint;
  private endTime: bigint;

  constructor() {
    this.startTime = 0n;
    this.endTime = 0n;
  }

  start(): Timer {
    this.startTime = process.hrtime.bigint();

    return this;
  }

  end(): Timer {
    this.endTime = process.hrtime.bigint();

    return this;
  }

  elapsedMilliseconds(): number {
    return Number(this.endTime - this.startTime) / Timer.NS_IN_MS;
  }

  elapsedSeconds(): number {
    return Number(this.endTime - this.startTime) / Timer.NS_IN_SEC;
  }
}
