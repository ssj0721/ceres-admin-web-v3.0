<!--R835-供應商銷售補貨快返報表 -->
<template>
  <div>
    <x-iframe :src="publicPath + src"></x-iframe>
  </div>
</template>
 
 
<script>
export default {
  data() {
    return {
      src: "ReportServer/Pages/ReportViewer.aspx?%2fEShopReports%2fR835-%e4%be%9b%e6%87%89%e5%95%86%e9%8a%b7%e5%94%ae%e8%a3%9c%e8%b2%a8%e5%bf%ab%e8%bf%94%e5%a0%b1%e8%a1%a8&rs:Command=Render",
      publicPath: import.meta.env.VITE_BASE_PREFIX
    };
  },
  created() {
    // this.query()
  },
};
</script>

