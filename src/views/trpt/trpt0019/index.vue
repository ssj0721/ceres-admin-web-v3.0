<!-- R848-分品種行業對比分析報表 -->
<template>
  <div>
    <x-iframe :src="publicPath + src"></x-iframe>
  </div>
</template>
 
 
<script>
export default {
  data() {
    return {
      src: "ReportServer/Pages/ReportViewer.aspx?%2fEShopReports%2fR848-%e5%88%86%e5%93%81%e7%a8%ae%e8%a1%8c%e6%a5%ad%e5%b0%8d%e6%af%94%e5%88%86%e6%9e%90%e5%a0%b1%e8%a1%a8(%e4%be%9b%e6%87%89%e5%95%86%e7%89%88)&rs:Command=Render",
      publicPath: import.meta.env.VITE_BASE_PREFIX
    };
  },
  created() {
    // this.query()
  },
};
</script>

