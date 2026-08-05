import { ref, toRefs, reactive, onMounted } from 'vue';
import { getSKtoken, getIframeUrl } from '@/api/user';

export default async function completeIframeUrl(url) {
    const res1 = await getIframeUrl()
    let wholeurl = res1.data + url
    let token = ""
    const res2 = await getSKtoken()
    console.log('获取审款token的res',res2);
    token = res2.data;
    wholeurl = wholeurl + "&maxkey=" + token;
    console.log('嵌套的url',wholeurl);
    return wholeurl
}