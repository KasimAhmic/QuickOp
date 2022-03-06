export interface TimerResult {
  startTime: number;
  endTime: number;
}

export class Timer {
  results: Record<string, TimerResult>;

  constructor() {
    this.results = {};
  }

  start(id: string): Timer {
    this.results[id] = {
      startTime: performance.now(),
      endTime: 0,
    };

    return this;
  }

  end(id: string): Timer {
    this.results[id].endTime = performance.now();

    return this;
  }

  getResult(id: string): TimerResult {
    return this.results[id] || { startTime: 0, endTime: 0 };
  }

  elapsedMilliseconds(id: string): number {
    const { startTime, endTime } = this.getResult(id);

    return endTime - startTime;
  }

  elapsedSeconds(id: string): number {
    const { startTime, endTime } = this.getResult(id);

    return (endTime - startTime) / 1000;
  }
}
