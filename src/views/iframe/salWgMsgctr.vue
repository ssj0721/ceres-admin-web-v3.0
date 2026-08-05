<template>
  <div>
    <x-iframe :src="finalurl" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ireIframe from '@/utils/ireIframe';

const finalurl = ref('');
const url = ref('/wg/Msgctr');

async function completeIframeUrl () {
  finalurl.value = await ireIframe(url.value);
}

onMounted(() => {
  completeIframeUrl();
});
</script>
