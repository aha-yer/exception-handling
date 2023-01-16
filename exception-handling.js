/*
 * @Author: yer
 * @Date: 2023-01-13 23:59:36
 * @LastEditors: yer
 * @LastEditTime: 2023-01-16 17:33:41
 * @FilePath: /exception-handling/exception-handling.js
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
// function myFetch3(handleError, callback) {
//   setTimeout(() => {
//     handleError("请求失败");
//   });
// }
// myFetch3(
//   (msg) => {
//     console.log(msg ?? "失败处理");
//   },
//   () => {
//     console.log("请求处理");
//   }
// );

/**
 * 4. Promise 捕获异常
 * reject & throw Error 都会被catch or onReject捕获
 */
// function myFetch4() {
//   return new Promise((resolve, reject) => {
//     throw new Error("throw error");
//   });
// }
// myFetch4()
//   .then((result) => {
//     console.log("请求处理", result);
//   })
//   .catch((error) => {
//     console.log("请求处理异常", error)m
//   });

/**
 * 5. Promise 无法捕获的异常: 异步回调中抛出的异常无法被捕获
 *   该问题其实类似 问题2, promise内部使用了try-catch, try-catch无法捕获异步异常
 */
// function myFetch5() {
//   return new Promise((resolve, reject) => {
//     // setTimeout(() => {
//     //   throw new Error("throw error");
//     //   // reject("no"); // 请求处理异常 no
//     // });

//     queueMicrotask(() => {
//       // resolve("ok"); // 处理请求 ok
//       // reject("no");  // 请求处理异常 no
//       throw new Error("throw error"); // throw new Error
//     });
//   });
// }
// myFetch5()
//   .then((result) => {
//     console.log("处理请求", result);
//   })
//   .catch((error) => {
//     console.log("请求处理异常", error);
//   });

/**
 * 6. Async-Await 中发生异常, 如果没有捕获, 则会自动中断 async 函数, 不会影响其他代码的运行
 *
 * 如果要捕获async-await异常, 可以使用 try-catch
 */

/**
 * 7. 业务场景
 */
// // 类级别装饰器
// const asyncClass = (errorHandler) => (target) => {
//   Object.getOwnPropertyNames(target.prototype).forEach((key) => {
//     const func = target.prototype[key];
//     target.prototype[key] = async (...args) => {
//       try {
//         await func.apply(this, args);
//       } catch (error) {
//         errorHandler && errorHandler(error);
//       }
//     };
//   });
//   return target;
// };
// // 方法级别装饰器
// const asyncMethod = (errorHandler) => (target, propertyKey, descriptor) => {
//   const func = descriptor.value;
//   return {
//     get() {
//       return (...args) => {
//         return Promise.resolve(func.apply(this, args)).catch((error) => {
//           errorHandler && errorHandler(error);
//         });
//       };
//     },
//     set(newValue) {
//       return newValue;
//     },
//   };
// };
// const successRequest = () => Promise.resolve("a");
// const failRequest = () => Promise.reject("b");

// const iAsyncClass = asyncClass((error) => {
//   console.log("统一异常处理", error); // 统一异常处理 b
// });

// @iAsyncClass
// class Action {
//   async successReuqest() {
//     const result = await successRequest();
//     console.log("successReuqest", "处理返回值", result);
//   }

//   async failReuqest() {
//     const result = await failRequest();
//     console.log("failReuqest", "处理返回值", result); // 永远不会执行
//   }

//   async allReuqest() {
//     const result1 = await successRequest();
//     console.log("allReuqest", "处理返回值 success", result1);
//     const result2 = await failRequest();
//     console.log("allReuqest", "处理返回值 success", result2); // 永远不会执行
//   }
// }

// // const asyncAction = asyncMethod(error => {
// //     console.log('统一异常处理', error) // 统一异常处理 b
// // })

// // class Action {
// //     @asyncAction async successReuqest() {
// //         const result = await successRequest()
// //         console.log('successReuqest', '处理返回值', result)
// //     }

// //     @asyncAction async failReuqest() {
// //         const result = await failRequest()
// //         console.log('failReuqest', '处理返回值', result) // 永远不会执行
// //     }

// //     @asyncAction async allReuqest() {
// //         const result1 = await successRequest()
// //         console.log('allReuqest', '处理返回值 success', result1)
// //         const result2 = await failRequest()
// //         console.log('allReuqest', '处理返回值 success', result2) // 永远不会执行
// //     }
// // }

// const action = new Action();
// action.successReuqest();
// action.failReuqest();
// action.allReuqest();
