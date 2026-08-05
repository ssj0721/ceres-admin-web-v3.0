// import { Message, MessageBox, Loading } from "element-ui"

// export const dialog = {
//   Loading: (text) => {
//     const loading = Loading.service({
//       lock: true,
//       text: text,
//       spinner: "el-icon-loading",
//     });
//     if (!text) loading.close();
//   },
//   // Message方式(信息会自动关闭)
//   showMessage: (message) => {
//     Message({
//       showClose: true,
//       message: message
//     });
//   },
//   showSuccess: (message) => {
//     Message({
//       showClose: true,
//       message: message,
//       type: "success"
//     });
//   },
//   showError: (message) => {
//     Message({
//       showClose: true,
//       message: message,
//       type: "error"
//     });
//   },
//   showWarning: (message) => {
//     Message({
//       showClose: true,
//       message: message,
//       type: "warning"
//     });
//   },
//   // MessageBox.alert方式(信息不会自动关闭，建议优先使用，特别是错误信息)
//   info: (message) => {
//     MessageBox.alert(message, { type: "info", dangerouslyUseHTMLString: true });
//   },
//   success: (message) => {
//     MessageBox.alert(message, { type: "success", dangerouslyUseHTMLString: true });
//   },
//   error: (message, err) => {
//     if (err !== undefined) {
//       let extMsg = "";
//       if (err.data !== undefined && err.data.message !== undefined) {
//         extMsg = err.data.message;
//       }
//       message = message + "<br>错误信息：" + extMsg;
//     }
//     MessageBox.alert(message, { type: "error", dangerouslyUseHTMLString: true });
//   },
//   warning: (message) => {
//     MessageBox.alert(message, { type: "warning", dangerouslyUseHTMLString: true });
//   },
//   // 确认对话框
//   showConfirm: (message) => {
//     return this.showDialog({ title: "确认", message });
//   },
//   showPrompt: (message, inputPattern, inputErrorMessage, inputValue) => {
//     return MessageBox.prompt(message, "提示", {
//       confirmButtonText: "确定",
//       cancelButtonText: "取消",
//       inputPattern: inputPattern,
//       inputErrorMessage: inputErrorMessage,
//       inputValue: inputValue
//     });
//   },
//   // 参数例子：config: {title: '确认', message: '是否继续?', ok: '是', cancel: '返回', type: 'info'}
//   showDialog: async (config) => {
//     return await MessageBox.confirm(config.message,
//       config.title == undefined ? "确认" : config.title, {
//       confirmButtonText: config.ok == undefined ? "确认" : config.ok,
//       cancelButtonText: config.cancel == undefined ? "取消" : config.cancel,
//       type: config.type == undefined ? "info" : config.type
//     });
//     /*
//     try {
//       await MessageBox.confirm(config.message,
//         config.title == undefined ? '确认' : config.title, {
//           confirmButtonText: config.ok == undefined ? '确认' : config.ok,
//           cancelButtonText: config.cancel == undefined ? '取消' : config.cancel,
//           type: config.type == undefined ? 'info' : config.type
//         }).then(() => {
//           return true;
//         }).catch(() => {
//           return false;
//         })
//       return true;
//       // 用户选择"OK"
//     }
//     catch (err) {
//       // 选择"Cancel"或作了关闭操作
//       return false;
//     }
//     */
//   }
// }

// // export default ({ Vue }) => {
// //   Vue.prototype.$dlg = dialog
// // }
// export default {
//     install(app) {
//       app.config.globalProperties.$dlg = dialog;
//     }
//   }

// dialog.js
import { ElMessage, ElMessageBox, ElLoading } from "element-plus";

export const dialog = {
  Loading(text) {
    const loadingInstance = ElLoading.service({
      lock: true,
      text,
      spinner: "el-icon-loading",
    });
    if (!text) loadingInstance.close();
    return loadingInstance;
  },

  showMessage(message) {
    ElMessage({
      showClose: true,
      message,
    });
  },

  showSuccess(message) {
    ElMessage({
      showClose: true,
      message,
      type: "success",
    });
  },

  showError(message) {
    ElMessage({
      showClose: true,
      message,
      type: "error",
    });
  },

  showWarning(message) {
    ElMessage({
      showClose: true,
      message,
      type: "warning",
    });
  },

  info(message) {
    ElMessageBox.alert(message, "提示", {
      type: "info",
      dangerouslyUseHTMLString: true,
    });
  },

  success(message) {
    ElMessageBox.alert(message, "成功", {
      type: "success",
      dangerouslyUseHTMLString: true,
    });
  },

  error(message, err) {
    let extMsg = "";
    if (err?.data?.message) {
      extMsg = err.data.message;
    }
    const fullMessage = `${message}<br>错误信息：${extMsg}`;
    ElMessageBox.alert(fullMessage, "错误", {
      type: "error",
      dangerouslyUseHTMLString: true,
    });
  },

  warning(message) {
    ElMessageBox.alert(message, "警告", {
      type: "warning",
      dangerouslyUseHTMLString: true,
    });
  },

  showConfirm(message) {
    return dialog.showDialog({ title: "确认", message });
  },

  showPrompt(message, inputPattern, inputErrorMessage, inputValue) {
    return ElMessageBox.prompt(message, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputPattern,
      inputErrorMessage,
      inputValue,
    });
  },

  async showDialog(config) {
    return await ElMessageBox.confirm(
      config.message,
      config.title ?? "确认",
      {
        confirmButtonText: config.ok ?? "确认",
        cancelButtonText: config.cancel ?? "取消",
        type: config.type ?? "info",
      }
    );
  },
};

// 注册为 Vue 插件
export default {
  install(app) {
    app.config.globalProperties.$dlg = dialog;
  },
};
