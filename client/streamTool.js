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

async function readStream(stream, each = () => {}, finish = () => {}) {
  let chunks = [];
  for await (const chunk of streamAsyncIterator(stream)) {
    chunks.push(chunk);
    each(chunk);
    await sleep(10); // 测试
  }
  return finish(chunks);
}

async function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

function generateReadableStreamFromAnother(
  stream,
  each = () => {},
  finish = () => {}
) {
  return new ReadableStream({
    async start(controller) {
      await readStream(
        stream,
        (chunk) => {
          each(chunk, controller);
        },
        (chunks) => {
          finish(chunks, controller);
          controller.close();
        }
      );
    },
  });
}

function generateReponseFromAnother(response, stream) {
  const newStream = stream || response.body;
  return new Response(newStream, { headers: response.headers });
}
