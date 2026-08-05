<!-- R849-聯營業務店鋪庫存報表 -->
<template>
  <div>
    <x-iframe :src="publicPath + src"></x-iframe>
  </div>
</template>
 
 
<script>
export default {
  data() {
    return {
      src: "ReportServer/Pages/ReportViewer.aspx?%2fEShopReports%2fR849-%e8%81%af%e7%87%9f%e6%a5%ad%e5%8b%99%e5%ba%97%e9%8b%aa%e5%ba%ab%e5%ad%98%e5%a0%b1%e8%a1%a8&rs:Command=Render",
      publicPath: import.meta.env.VITE_BASE_PREFIX
    };
  },
  created() {
    // this.query()
  },
};
</script>

