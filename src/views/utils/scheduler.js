/** A simple task scheduler that ensures each task runs after the page `DOMContentLoaded` event has fired. */
export default class OnReadyScheduler {
  queue = [];

  hasLoaded = false;

  constructor() {
    if (document.readyState === "complete" || document.readyState === "interactive") {
      this.hasLoaded = true;
      return;
    }

    window.addEventListener("DOMContentLoaded", () => {
      this.hasLoaded = true;

      this.queue.forEach((fn) => { fn(); });
    });
  }

  schedule(task) {
    if (this.hasLoaded) {
      task();
    } else {
      this.queue.push(task);
    }
  }
}
