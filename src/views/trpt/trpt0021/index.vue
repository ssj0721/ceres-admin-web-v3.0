<!-- R850-聯營業務季度貨品上架報表-->
<template>
  <div>
    <x-iframe :src="publicPath + src"></x-iframe>
  </div>
</template>
 
 
<script>
export default {
  data() {
    return {
      src: "ReportServer/Pages/ReportViewer.aspx?%2fEShopReports%2fR850-%e8%81%af%e7%87%9f%e6%a5%ad%e5%8b%99%e5%ad%a3%e5%ba%a6%e8%b2%a8%e5%93%81%e4%b8%8a%e6%9e%b6%e5%a0%b1%e8%a1%a8&rs:Command=Render",
      publicPath: import.meta.env.VITE_BASE_PREFIX
    };
  },
  created() {
    // this.query()
  },
};
</script>

