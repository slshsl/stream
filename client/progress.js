const btnEle2 = document.getElementById("btnEle2");
const progress2 = document.getElementById("progress2");
btnEle2.addEventListener("click", async () => {
  btnEle2.disabled = true;

  let response;
  try {
    response = await fetch("api/file/test.txt");
  } catch (error) {
    console.log("接口出错", error);
    btnEle2.disabled = false;
    return;
  }

  const total = response.headers.get("content-length");
  let progress = 0;

  const stream = response.body;

  await readStream(stream, (chunk) => {
    progress += chunk.length;
    if (progress === total) {
      console.log(`Downloaded ${total}`);
    } else {
      const tip = `Downloaded ${progress} of ${total} (${(
        (progress / total) *
        100
      ).toFixed(2)}%)`;
      console.log(tip);
      progress2.textContent = tip;
    }
  });

  btnEle2.textContent = `下载完成，总大小${progress}`;
  btnEle2.disabled = false;
  console.log(progress);

  // 该流已被读取，无法再使用，解决方式看progressTogether.js与tee.js
  // response.arrayBuffer().then((res) => {
  //   console.log(res);
  // });
});
