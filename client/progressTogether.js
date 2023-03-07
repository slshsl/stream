const btnEle3 = document.getElementById("btnEle3");
const progress3 = document.getElementById("progress3");
btnEle3.addEventListener("click", async () => {
  btnEle3.disabled = true;

  let response;
  try {
    response = await fetch("api/file/test.txt");
  } catch (error) {
    console.log("接口出错", error);
    btnEle3.disabled = false;
    return;
  }

  const total = response.headers.get("content-length");
  let progress = 0;

  // 根据原来的流重新构建个流
  const stream = response.body;

  const newStream = generateReadableStreamFromAnother(
    stream,
    (chunk, controller) => {
      controller.enqueue(chunk);
      progress += chunk.length;
      if (progress === total) {
        console.log(`Downloaded ${total}`);
      } else {
        const tip = `Downloaded ${progress} of ${total} (${(
          (progress / total) *
          100
        ).toFixed(2)}%)`;
        console.log(tip);
        progress3.textContent = tip;
      }
    }
  );

  //然后再重新构建个响应返回
  const newResponse = generateReponseFromAnother(response, newStream);

  try {
    const res = await newResponse.arrayBuffer();
    btnEle3.textContent = `下载完成，总大小${res.byteLength}`;
    console.log(res);
  } catch (error) {
    console.log("未知错误", error);
  } finally {
    btnEle3.disabled = false;
  }
});
