<!-- D008-查詢聯營業務店鋪預算-->
<template>
  <div>
    <x-iframe :src="publicPath + src"></x-iframe>
  </div>
</template>
 
 
<script>
export default {
  data() {
    return {
      src: "ReportServer/Pages/ReportViewer.aspx?%2fEShopReports%2fD008-%e6%9f%a5%e8%a9%a2%e8%81%af%e7%87%9f%e6%a5%ad%e5%8b%99%e5%ba%97%e9%8b%aa%e9%a0%90%e7%ae%97&rs:Command=Render",
      publicPath: import.meta.env.VITE_BASE_PREFIX
    };
  },
  created() {
    // this.query()
  },
};
</script>

