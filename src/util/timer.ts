export interface TimerResult {
  startTime: bigint;
  endTime: bigint;
}

export class Timer {
  private static readonly NS_IN_MS = 1e6;
  private static readonly NS_IN_SEC = 1e9;

  results: Record<number, TimerResult>;

  constructor() {
    this.results = {};
  }

  start(id: number): Timer {
    this.results[id] = {
      startTime: process.hrtime.bigint(),
      endTime: 0n,
    };

    return this;
  }

  end(id: number): Timer {
    this.results[id].endTime = process.hrtime.bigint();

    return this;
  }

  getResult(id: number): TimerResult {
    return this.results[id] || { startTime: 0n, endTime: 0n };
  }

  elapsedMilliseconds(id: number): number {
    const { startTime, endTime } = this.getResult(id);

    return Number(endTime - startTime) / Timer.NS_IN_MS;
  }

  elapsedSeconds(id: number): number {
    const { startTime, endTime } = this.getResult(id);

    return Number(endTime - startTime) / Timer.NS_IN_SEC;
  }
}
