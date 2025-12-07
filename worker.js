self.onmessage = function (event) {
  const num = event.data;
  let result = 0;

  // heavy CPU task
  for (let i = 0; i < num; i++) {
    result += i;
  }

  // send result back to main thread
  postMessage(result);
};