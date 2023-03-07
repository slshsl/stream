const btnEle1 = document.getElementById("btnEle1");

btnEle1.addEventListener("click", async () => {
  btnEle1.disabled = true;

  const response = await fetch("api/file/test.txt");

  let total = 0;

  const stream = response.body;

  await readStream(stream, (chunk) => {
    total += chunk.length;
  });

  btnEle1.textContent = `下载完成，总大小${total}`;
  btnEle1.disabled = false;
});
