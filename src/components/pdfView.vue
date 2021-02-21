<template>
  <div class="pdf-box">
    <pdf :src='src' :page="currentPage" @num-pages="pageCount=$event" @page-loaded="pageLoaded" @progress='progress' @loaded="loadPdfHandler" @error="pdfError"></pdf>
    <div class="pages">
      <div class="btn prev" :class="{disable:currentPage<=1}" @click.stop.prevent='changeCurrentPage(-1)'>上一页</div>
      <span>{{currentPage}}/{{pageCount}}</span>
      <div class="btn next" :class="{disable:currentPage>=pageCount}" @click.stop.prevent='changeCurrentPage(1)'>下一页</div>
    </div>
    <div class="loading" v-if="progressNum<100">
      <div>
        <img src="../assets/loading.png" alt="">
        <p> {{progressNum}}%</p>
      </div>
    </div>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
export default {
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  components: { pdf },
  data: () => ({
    currentPage: 1,
    pageCount: 0,
    progressNum: 0
  }),
  computed: {
    createLoadingTask() {
      return (src) => {
        return pdf.createLoadingTask(src)
      }
    }
  },
  methods: {
    loadPdfHandler(e) {
      this.currentPage = 1;
    },
    pageLoaded(e) {
      
    },
    changeCurrentPage(val) {
      let currentPage = this.currentPage + val;
      this.currentPage = currentPage <= 1 ? 1 : currentPage >= this.pageCount ? this.pageCount : currentPage
    },
    progress(e) {
      this.progressNum = parseInt(e * 100);
    },
    pdfError(e) {
      this.$toast('PDF文件加载失败，请刷新重试')
    }
  }
}
</script>

<style lang="less" scoped>
.pdf-box {
  margin-top: 30px;
  border: 1px solid #eee /* no */;
  position: relative;
  .pages {
    display: flex;
    align-items: center;
    padding: 20px 30px 40px;
    .btn {
      width: 160px;
      font-size: 26px;
      text-align: center;
      background: #ff7300;
      color: #fff;
      line-height: 48px;
      border-radius: 10px;
      &.disable {
        background: #999;
      }
    }
    span {
      flex: 1;
      text-align: center;
      font-size: 26px;
    }
  }
  .loading {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.4);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    img {
      width: 80px;
      animation: loading 1.5s ease-in-out infinite;
    }
    p {
      font-size: 24px;
      color: #fff;
      margin-top: 10px;
      text-align: center;
    }
  }
}

@keyframes loading {
  0% {
    transform: rotateZ(0);
  }
  100% {
    transform: rotateZ(360deg);
  }
}
</style>