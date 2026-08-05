<!--R827-聯營業務分款銷售分析報表 -->
<template>
  <div>
    <x-iframe :src="publicPath + src"></x-iframe>
  </div>
</template>
 
 
<script>
export default {
  data() {
    return {
      src: "ReportServer/Pages/ReportViewer.aspx?%2fEShopReports%2fR827-%e8%81%af%e7%87%9f%e6%a5%ad%e5%8b%99%e5%88%86%e6%ac%be%e9%8a%b7%e5%94%ae%e5%88%86%e6%9e%90%e5%a0%b1%e8%a1%a8&rs:Command=Render",
      publicPath: import.meta.env.VITE_BASE_PREFIX
    };
  },
  created() {
    // this.query()
  },
};
</script>

