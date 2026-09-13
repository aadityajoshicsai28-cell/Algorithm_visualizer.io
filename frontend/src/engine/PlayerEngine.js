export class CancellationError extends Error {
  constructor(message = 'Algorithm execution cancelled') {
    super(message);
    this.name = 'CancellationError';
  }
}

export class PlayerEngine {
  constructor({ defaultDelay = 120 } = {}) {
    this.delay = defaultDelay;
    this.paused = false;
    this.running = false;
    this.stepResolvers = [];
    this.activeToken = null;
    this.tokenIdCounter = 0;
    this.onStateChange = null;
  }

  notify() {
    if (this.onStateChange) {
      this.onStateChange({
        paused: this.paused,
        running: this.running,
        delay: this.delay,
      });
    }
  }

  createToken() {
    // Invalidate previous token
    if (this.activeToken) {
      this.activeToken.cancelled = true;
    }
    // Clear any dangling step resolvers
    this.stepResolvers.forEach(resolve => resolve(false));
    this.stepResolvers = [];

    this.tokenIdCounter += 1;
    this.activeToken = {
      id: this.tokenIdCounter,
      cancelled: false
    };
    this.running = true;
    this.notify();
    return this.activeToken;
  }

  cancel() {
    if (this.activeToken) {
      this.activeToken.cancelled = true;
      this.activeToken = null;
    }
    this.stepResolvers.forEach(resolve => resolve(false));
    this.stepResolvers = [];
    this.running = false;
    this.paused = false;
    this.notify();
  }

  pause() {
    this.paused = true;
    this.notify();
  }

  play() {
    this.paused = false;
    // Release any pending step waiters to resume normal flow
    const resolvers = this.stepResolvers;
    this.stepResolvers = [];
    resolvers.forEach(resolve => resolve(true));
    this.notify();
  }

  step() {
    if (!this.running) return;
    this.paused = true;
    if (this.stepResolvers.length > 0) {
      const resolve = this.stepResolvers.shift();
      resolve(true);
    }
    this.notify();
  }

  setDelay(ms) {
    this.delay = Math.max(5, ms);
    this.notify();
  }

  async wait(token) {
    if (!token || token.cancelled) {
      throw new CancellationError();
    }

    // If currently paused, wait until step() or play() is triggered
    if (this.paused) {
      await new Promise(resolve => {
        this.stepResolvers.push(resolve);
      });
      if (!token || token.cancelled) {
        throw new CancellationError();
      }
      return;
    }

    // Normal play mode: wait for delay ms
    await new Promise(resolve => {
      const timer = setTimeout(() => {
        resolve();
      }, this.delay);

      // If cancelled while sleeping
      const checkCancelInterval = setInterval(() => {
        if (!token || token.cancelled) {
          clearTimeout(timer);
          clearInterval(checkCancelInterval);
          resolve();
        }
      }, Math.min(25, this.delay));

      // Clear interval when timeout finishes
      setTimeout(() => clearInterval(checkCancelInterval), this.delay + 10);
    });

    if (!token || token.cancelled) {
      throw new CancellationError();
    }
  }

  finish() {
    this.running = false;
    this.paused = false;
    this.stepResolvers = [];
    this.activeToken = null;
    this.notify();
  }
}
