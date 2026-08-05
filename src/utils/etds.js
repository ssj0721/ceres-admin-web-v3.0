import { getUserInfo } from '@/api/user'
import { getUserId } from '@/utils/auth'

export async function checkEtdsRole () {
    const res = await getUserInfo({
      platformUserId: parseInt(getUserId())
    })
    return res.data.data
}