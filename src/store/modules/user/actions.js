import { UserActionEnum, UserStoreEnum } from './state';
import { login, logout, resetPassword } from '@/api/user'
import {
  setToken,
  setReportKey,
  removeToken,
  setName,
  setUserName,
  setUserId,
  setUserAvatar,
} from '@/utils/auth'
import { resetRouter } from '@/router'

export const actions = {
  [UserActionEnum.LOGIN] ({ commit }, userInfo) {
    const { username, password, code, rememberMe, maxkey } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: password,
        code: code,
        rememberMe: rememberMe,
        maxkey: maxkey,
      })
        .then((response) => {
          const { data } = response
          // debugger;
          console.log('登录data',data);
          setName(data.name)
          setUserName(data.username)
          setUserId(data.platformUserId)
          setUserAvatar(data.avatar)
          setToken(data.token)
          setReportKey(data.reportSvrAuth)
          console.log("iiiiii");
          

          // localStorage.setItem("iRetailToken", data.iretailToken)
          // localStorage.setItem("iRetailPermission", JSON.stringify(data.iretailPermission))
          // localStorage.setItem("userInfo", JSON.stringify(data.iretailUserInfo))


          // 存储用户信息到 sessionStorage
          sessionStorage.setItem('username', username)

          commit(UserStoreEnum.TOKEN, data.token)
          // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
          commit('SET_LOAD', true)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  [UserActionEnum.LOGOUT] ({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken() // must remove  token  first
          // 清除 sessionStorage 中的用户信息
          sessionStorage.removeItem('username')
          // 如果有etds用户，则清除etds用户信息
          if (localStorage.getItem('storage_key_etds')) {
            localStorage.removeItem('storage_key_etds')
            localStorage.removeItem('token_etds')
          }
          // 路由重置
          resetRouter()
          commit('SET_LOAD', false)
          // -
          commit(UserStoreEnum.RESET_USER)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  [UserActionEnum.RESET_PASSWORD] ({ commit }, authForm) {
    const { phone, password, newPassword, code } = authForm
    return new Promise((resolve, reject) => {
      resetPassword({
        username: phone.trim(),
        password: password,
        newPassword: newPassword,
        code: code,
      })
        .then((response) => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  [UserActionEnum.RESET_TOKEN] ({ commit }) {
    return new Promise((resolve) => {
      removeToken() // must remove  token  first
      commit(UserStoreEnum.RESET_USER)
      resolve()
    })
  }
}
