// 处理错误的中间件
module.exports = (err, req, res, next) => {
  if (err) {
    let message = err;
    if (err instanceof Error) {
      message = err.message;
    }
    const errObj = {
      code: 500,
      msg: message,
    };
    //发生了错误
    res.status(500).send(errObj);
  } else {
    next();
  }
};
