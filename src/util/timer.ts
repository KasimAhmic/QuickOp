export interface TimerResult {
  startTime: number;
  endTime: number;
}

export class Timer {
  results: Record<number, TimerResult>;

  constructor() {
    this.results = {};
  }

  start(id: number): Timer {
    this.results[id] = {
      startTime: performance.now(),
      endTime: 0,
    };

    return this;
  }

  end(id: number): Timer {
    this.results[id].endTime = performance.now();

    return this;
  }

  getResult(id: number): TimerResult {
    return this.results[id] || { startTime: 0, endTime: 0 };
  }

  elapsedMilliseconds(id: number): number {
    const { startTime, endTime } = this.getResult(id);

    return endTime - startTime;
  }

  elapsedSeconds(id: number): number {
    const { startTime, endTime } = this.getResult(id);

    return (endTime - startTime) / 1000;
  }
}
