<template>
  <div>
    <iframe
      :src="src"
      id="iframemain"
      scrolling="yes"
      frameborder="0"
      :style="style"
    ></iframe>
  </div>
</template>
 
<script>
export default {
  props: {
    props: {
      type: Object,
      default() {
        return {};
      },
    },
    src: {
      type: String,
      default() {
        return {};
      },
    },
    style: {
      type: String,
      default() {
        return "position:absolute;";
      },
    },
  },
  data() {
    return {};
  },
  mounted() {
    function isMobile() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      return flag;
    }
    /**
     * iframe-宽高自适应显示
     */
    function changeMobsfIframe() {
      const mobsf = document.getElementById("iframemain");
      const deviceWidth = document.body.clientWidth;
      const deviceHeight = document.body.clientHeight;
      if (isMobile()) {
        mobsf.style.width = Number(deviceWidth) - 10 + "px"; //数字是页面布局宽度差值
        mobsf.style.height = Number(deviceHeight) - 10 + "px"; //数字是页面布局高度差
      } else {
        //mobsf.style.width = Number(deviceWidth) - 120 + "px"; //数字是页面布局宽度差值
        //mobsf.style.height = Number(deviceHeight) - 80 + "px"; //数字是页面布局高度差
        mobsf.style.width = "100%"; //数字是页面布局宽度差值
        mobsf.style.height = "100%"; //数字是页面布局高度差
      }
    }

    changeMobsfIframe();

    window.onresize = function () {
      changeMobsfIframe();
    };

    /*
    //报表服务特别处理
    function fixReportServiceToolbar() {
      console.log("iframemain", document.getElementById("iframemain"));
      var reportserviceToolbar = document
        .getElementById("iframemain")
        .contentWindow.document.getElementById(
          "ParameterTable_ReportViewerControl_ctl04"
        );
      //判断此元素是否存在
      if (reportserviceToolbar != null) {
        //设置该元素的样式或其他属性
        reportserviceToolbar.width = "90%";
      }
    }

    document.getElementById("iframemain").onload = function () {
      fixReportServiceToolbar();
    };
    */
  },
};
</script>