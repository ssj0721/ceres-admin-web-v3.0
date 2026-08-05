<!--R825-聯營業務分店分天運營指標-->
<template>
  <div>
    <x-iframe :src="publicPath + src"></x-iframe>
  </div>
</template>
 
 
<script>
export default {
  data() {
    return {
      src: "ReportServer/Pages/ReportViewer.aspx?%2fEShopReports%2fR825-%e8%81%af%e7%87%9f%e6%a5%ad%e5%8b%99%e5%88%86%e5%ba%97%e5%88%86%e5%a4%a9%e9%81%8b%e7%87%9f%e6%8c%87%e6%a8%99&rs:Command=Render",
      publicPath: import.meta.env.VITE_BASE_PREFIX
    };
  },
  created() {
    // this.query()
  },
};
</script>

