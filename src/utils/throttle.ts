function throttle<A extends unknown[], R>(
  func: (...args: A) => R,
  timeFrame: number
) {
  let lastTime = 0;
  let timeoutId: number | null = null;

  return function (...args: A) {
    const now = new Date().getTime();

    const timeElapsed = now - lastTime;

    if (timeElapsed < timeFrame) {
      if (timeoutId) clearTimeout(timeoutId);

      const timeRemaining = timeFrame - timeElapsed;

      timeoutId = window.setTimeout(() => {
        lastTime = new Date().getTime();
        func(...args);
        timeoutId = null;
      }, timeRemaining);
      return;
    }

    func(...args);
    lastTime = now;
  };
}

export { throttle };
