<!-- R845-聯營業務備貨檢查報表 -->
<template>
  <div>
    <x-iframe :src="publicPath + src"></x-iframe>
  </div>
</template>
 
 
<script>
export default {
  data() {
    return {
      src: "ReportServer/Pages/ReportViewer.aspx?%2fEShopReports%2fR845-%e8%81%af%e7%87%9f%e6%a5%ad%e5%8b%99%e5%82%99%e8%b2%a8%e6%aa%a2%e6%9f%a5%e5%a0%b1%e8%a1%a8&rs:Command=Render",
      publicPath: import.meta.env.VITE_BASE_PREFIX
    };
  },
  created() {
    // this.query()
  },
};
</script>

