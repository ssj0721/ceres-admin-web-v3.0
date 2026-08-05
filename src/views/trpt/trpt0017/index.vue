<!-- R846-聯營業務分品種新舊貨報表 -->
<template>
  <div>
    <x-iframe :src="publicPath + src"></x-iframe>
  </div>
</template>
 
 
<script>
export default {
  data() {
    return {
      src: "ReportServer/Pages/ReportViewer.aspx?%2fEShopReports%2fR846-%e8%81%af%e7%87%9f%e6%a5%ad%e5%8b%99%e5%88%86%e5%93%81%e7%a8%ae%e6%96%b0%e8%88%8a%e8%b2%a8%e5%a0%b1%e8%a1%a8&rs:Command=Render",
      publicPath: import.meta.env.VITE_BASE_PREFIX
    };
  },
  created() {
    // this.query()
  },
};
</script>

