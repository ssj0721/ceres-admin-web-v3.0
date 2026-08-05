<!-- D005-查詢聯營業務聚水潭數據差異 -->
<template>
  <div>
    <x-iframe :src="publicPath + src"></x-iframe>
  </div>
</template>
 
 
<script>
export default {
  data() {
    return {
      src: "ReportServer/Pages/ReportViewer.aspx?%2fEShopReports%2fD005-%e6%9f%a5%e8%a9%a2%e8%81%af%e7%87%9f%e6%a5%ad%e5%8b%99%e8%81%9a%e6%b0%b4%e6%bd%ad%e6%95%b8%e6%93%9a%e5%b7%ae%e7%95%b0&rs:Command=Render",
      publicPath: import.meta.env.VITE_BASE_PREFIX
    };
  },
  created() {
    // this.query()
  },
};
</script>

