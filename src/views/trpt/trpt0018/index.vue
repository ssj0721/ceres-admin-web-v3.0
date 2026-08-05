<!-- R847-聯營業務分季度存銷分析 -->
<template>
  <div>
    <x-iframe :src="publicPath + src"></x-iframe>
  </div>
</template>
 
 
<script>
export default {
  data() {
    return {
      src: "ReportServer/Pages/ReportViewer.aspx?%2fEShopReports%2fR847-%e8%81%af%e7%87%9f%e6%a5%ad%e5%8b%99%e5%88%86%e5%ad%a3%e5%ba%a6%e5%ad%98%e9%8a%b7%e5%88%86%e6%9e%90&rs:Command=Render",
      publicPath: import.meta.env.VITE_BASE_PREFIX
    };
  },
  created() {
    // this.query()
  },
};
</script>

