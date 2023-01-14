/*
 * @Author: yer
 * @Date: 2023-01-13 23:59:36
 * @LastEditors: yer
 * @LastEditTime: 2023-01-14 11:46:52
 * @FilePath: /error-catch/exception-handling.js
 * @Description:
 * Copyright (c) 2023 by yer yerb993@gmail.com, All Rights Reserved.
 */

/**
 * 1. 在回调函数中直接处理了异常，是最不明智的选择，因为业务方完全失去了对异常的控制能力
 */

/**
 * 2. 异步函数中, 回调函数的执行栈 与 原函数执行栈分开
 * 导致外部无法捕获异常
 */
// function myFetch2(callback) {
//   setTimeout(() => {
//     throw Error("请求失败");
//   });
// }
// try {
//   myFetch2(() => {
//     console.log("请求处理"); // 永远不会执行
//   });
// } catch (e) {
//   console.log("触发异常", e); // 永远不会执行
// }

/**
 * 3. 回调，不可控异常
 */
function myFetch3(handleError, callback) {
  setTimeout(() => {
    handleError("请求失败");
  });
}
myFetch3(
  (msg) => {
    console.log(msg ?? "失败处理");
  },
  () => {
    console.log("请求处理");
  }
);
