const btnEle5 = document.getElementById("btnEle5");
const progress5 = document.getElementById("progress5");

let chunks = null;
let progress = 0;
let aborter = null;
let total = 0;

const cacheChunk = async () => {
  btnEle5.textContent = `暂停`;

  if (!chunks) {
    chunks = [];
    progress = 0;
    total = 0;
  }

  aborter = new AbortController();
  const headers = progress
    ? {
        Range: `bytes=${progress}-`,
      }
    : {};
  try {
    response = await fetch("api/file/test.txt", {
      headers,
      signal: aborter.signal,
    });
  } catch (error) {
    console.log("接口出错", error);
    return;
  }

  if (!chunks.length) {
    total = response.headers.get("content-length");
  }

  // 根据原来的流重新构建个流
  const stream = response.body;

  const newStream = generateReadableStreamFromAnother(
    stream,
    (chunk) => {
      chunks.push(chunk);
      progress += chunk.length;
      if (progress === total) {
        console.log(`Downloaded ${total}`);
      } else {
        const tip = `Downloaded ${progress} of ${total} (${(
          (progress / total) *
          100
        ).toFixed(2)}%)`;
        console.log(tip);
        progress5.textContent = tip;
      }
    },
    (undefined, controller) => {
      let chunk;
      while ((chunk = chunks.shift())) {
        controller.enqueue(chunk);
      }
    }
  );

  //然后再重新构建个响应返回
  const newResponse = generateReponseFromAnother(response, newStream);

  try {
    const res = await newResponse.arrayBuffer();
    btnEle5.textContent = `下载完成，总大小${res.byteLength}`;
    console.log(res);
    chunks = null;
  } catch (error) {
    console.log("未知错误", error);
  } finally {
    aborter = null;
  }
};

btnEle5.addEventListener("click", () => {
  if (aborter) {
    aborter.abort();
  } else {
    cacheChunk();
  }
});
