<template>
    <div>
      <x-iframe :src="finalurl"></x-iframe>
    </div>
</template>
   
<script setup>
import { ref, toRefs, reactive, onMounted,onBeforeMount } from 'vue';
import ireIframe from '@/utils/ireIframe'

const finalurl = ref("")
const url = ref("/po/Pomnt101/'Pomnt129'")

async function completeIframeUrl() {
  finalurl.value = await ireIframe(url.value)
}

onMounted(() => {
  completeIframeUrl()
});
</script>