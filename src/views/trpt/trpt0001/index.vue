<!--R811-聯營業務日銷售報表(供應商版) -->
<template>
  <div>
    <x-iframe :src="publicPath + src"></x-iframe>
  </div>
</template>
 
 
<script>
export default {
  data() {
    return {
      //审款的src里的ReportServer前面是没有‘/’的，但是在供应链里前面要加上‘/’，不然就会把路由'/trpt'给拼上去，导致后面识别不到。
      src: "ReportServer/Pages/ReportViewer.aspx?%2fEShopReports%2fR811-%e8%81%af%e7%87%9f%e6%a5%ad%e5%8b%99%e6%97%a5%e9%8a%b7%e5%94%ae%e5%a0%b1%e8%a1%a8(%e4%be%9b%e6%87%89%e5%95%86%e7%89%88)&rs:Command=Render",
      publicPath: import.meta.env.VITE_BASE_PREFIX
    };
  },
  created() {
    // this.query()
  },
};
</script>

