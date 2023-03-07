async function* streamAsyncIterator(stream) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

async function readStream(stream, cal = () => {}) {
  for await (const chunk of streamAsyncIterator(stream)) {
    cal(chunk);
    await sleep(10); // 测试
  }
}

async function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

function generateReadableStreamFromAnother(stream, cal = () => {}) {
  return new ReadableStream({
    async start(controller) {
      await readStream(stream, (chunk) => {
        controller.enqueue(chunk);
        cal(chunk);
      });
      controller.close();
    },
  });
}

function generateReponseFromAnother(response, stream) {
  const newStream = stream || response.body;
  return new Response(newStream, { headers: response.headers });
}
