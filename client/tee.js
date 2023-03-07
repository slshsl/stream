const btnEle4 = document.getElementById("btnEle4");
const progress4 = document.getElementById("progress4");
btnEle4.addEventListener("click", async () => {
  btnEle4.disabled = true;

  let response;
  try {
    response = await fetch("api/file/test.txt");
  } catch (error) {
    console.log("接口出错", error);
    btnEle4.disabled = false;
    return;
  }

  const total = response.headers.get("content-length");
  let progress = 0;

  const [progressStream, returnStream] = response.body.tee();

  const progressPro = readStream(progressStream, (chunk) => {
    progress += chunk.length;
    if (progress === total) {
      console.log(`Downloaded ${total}`);
    } else {
      const tip = `Downloaded ${progress} of ${total} (${(
        (progress / total) *
        100
      ).toFixed(2)}%)`;
      console.log(tip);
      progress4.textContent = tip;
    }
  });

  //然后再重新构建个响应返回
  const newResponse = generateReponseFromAnother(response, returnStream);

  try {
    const [, res] = await Promise.all([progressPro, newResponse.arrayBuffer()]);
    btnEle4.textContent = `下载完成，总大小${res.byteLength}`;
    console.log(res);
  } catch (error) {
    console.log("未知错误", error);
  } finally {
    btnEle4.disabled = false;
  }
});
