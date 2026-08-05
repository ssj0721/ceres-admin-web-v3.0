import { login, loginWithoutPassword } from '@/api/etds'

/**
 * ETDS系统专用登录方法
 * @param {object} params 登录参数
 * @returns {Promise<{success: boolean, data?: any, message?: string}>}
 */
export async function loginETDS (params) {
  try {
    const { userId, lic_status = true } = params

    if (!userId) {
      return {
        success: false,
        message: '用户账号或密码不能为空!'
      }
    }
    // 2025.05.27 新增无密码登录

    // 调用登录接口
    const requestBody = {
      user: userId,
      lic_status: 'true'
    }

    const res = await loginWithoutPassword(requestBody)

    const passWord = res.data?.result.Example.password
    const user = res.data?.result.Example.usr_login

    // 拿到免密的账号密码后再调用登录接口
    const requestBody1 = {
      userId: user,
      userPassword: passWord
    }

    const res1 = await login(requestBody1)

    const userData = res1.data?.result.Example
    const token = res1.data?.token

    if (!userData || userData.stuate === 0) {
      return {
        success: false,
        message: '用户账号或密码错误!'
      }
    }

    if (userData.stuate === 1) {
      // 存储用户信息
      const sessionData = {
        roleId: userData.roleId,
        userId: userData.userId,
        sq_factid: userData.fact_id,
        oid: userData.oid,
        ismj: userData.roleId === 1 ? (userData.gc_confirmsstatus === 'N' ? 1 : 2) : 0,
        gc_confirmsstatus: userData.gc_confirmsstatus,
        employeename: userData.employeename,
        is_sqs: userData.is_sqs === 1 ? '1' : '0',
        cmp_id: userData.cmpId,
        post_type: userData.post_type
      }

      // 存储会话信息到 sessionStorage
      Object.entries(sessionData).forEach(([key, value]) => {
        sessionStorage.setItem(key, JSON.stringify(value))
      })

      // 存储登录凭证
      localStorage.setItem('token_etds', token)
      localStorage.setItem('storage_key_etds', JSON.stringify(userData))
      localStorage.setItem('login_credentials_etds', JSON.stringify({
        username: userId,
        password: passWord
      }))

      return {
        success: true,
        data: {
          ...userData,
          lic_status
        },
        message: '登录成功'
      }
    }

    return {
      success: false,
      message: '登录失败'
    }
  } catch (error) {
    console.error('ETDS登录失败:', error)
    return {
      success: false,
      message: error.message || '登录异常'
    }
  }
}