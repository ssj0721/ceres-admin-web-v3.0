import Cookies from 'js-cookie'
import store from '@/store/';
// import router from '@/router/router'

const TokenKey = 'x-access-token'
export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    var inFifteenMinutes = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    return Cookies.set(TokenKey, token, { expires: inFifteenMinutes })
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}

function processError(rsp) {
    console.log("processError...");
    if (rsp != undefined && rsp.data != undefined && (rsp.data.code == -1 || rsp.data.code == -9)) {
        console.log("logout.rsp", rsp);
        window.location.reload();
    }
}

// export function logout() {
//     console.log("后台注销登录...");
//     store.dispatch("LogOut")
//         .then(() => {
//             router.push({ path: "/login" });
//         })
//         .catch(rsp => {
//             processError(rsp);
//         });
//     console.log("后台注销登录结束...");
// }

// export function fedLogout() {
//     console.log("前台注销登录...");
//     store.dispatch("FedLogOut")
//         .then(() => {
//             router.push({ path: "/login" });
//         })
//         .catch(rsp => {
//             processError(rsp);
//         });
//     console.log("前台注销登录结束...");
// }