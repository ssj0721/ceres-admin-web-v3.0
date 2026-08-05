import { ref, toRefs, reactive, onMounted } from 'vue';
import { getSKtoken, getEtdsIframeUrl } from '@/api/user';

export default async function completeIframeUrl () {
  const res1 = await getEtdsIframeUrl();
  return res1.data;
}