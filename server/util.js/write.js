const fs = require("fs");
const path = require("path");
const testPath = path.resolve(__dirname, "../files/test.txt");

const ws = fs.createWriteStream(testPath);

for (let index = 0; index < 1024 * 1024; index++) {
  ws.write("a");
}
let i = 0;
const write = () => {
  let flag = true;
  while (i < 1024 * 1024 * 10 && flag) {
    flag = ws.write("a");
    i++;
  }
};

ws.on("drain", () => {
  write();
});
