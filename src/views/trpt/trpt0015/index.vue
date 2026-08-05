<!-- R842-聯營業務兩點六點銷售報表(供應商版) -->
<template>
  <div>
    <x-iframe :src="publicPath + src"></x-iframe>
  </div>
</template>
 
 
<script>
export default {
  data() {
    return {
      src: "ReportServer/Pages/ReportViewer.aspx?%2fEShopReports%2fR842-%e8%81%af%e7%87%9f%e6%a5%ad%e5%8b%99%e5%85%a9%e9%bb%9e%e5%85%ad%e9%bb%9e%e9%8a%b7%e5%94%ae%e5%a0%b1%e8%a1%a8(%e4%be%9b%e6%87%89%e5%95%86%e7%89%88)&rs:Command=Render",
      publicPath: import.meta.env.VITE_BASE_PREFIX
    };
  },
  created() {
    // this.query()
  },
};
</script>

