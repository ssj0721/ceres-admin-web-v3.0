<!--R830-聯營業務退貨率分析報表 -->
<template>
  <div>
    <x-iframe :src="publicPath + src"></x-iframe>
  </div>
</template>
 
 
<script>
export default {
  data() {
    return {
      src: "ReportServer/Pages/ReportViewer.aspx?%2fEShopReports%2fR830-%e8%81%af%e7%87%9f%e6%a5%ad%e5%8b%99%e9%80%80%e8%b2%a8%e7%8e%87%e5%88%86%e6%9e%90%e5%a0%b1%e8%a1%a8&rs:Command=Render",
      publicPath: import.meta.env.VITE_BASE_PREFIX
    };
  },
  created() {
    // this.query()
  },
};
</script>

