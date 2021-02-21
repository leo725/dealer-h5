<template>
  <div class="month-picker" v-if="visible">
    <mt-picker :showToolbar="true" :visibleItemCount="visibleItemCount" :slots="slots" @change="onPickerChange">
      <slot>
        <div class="btn cancel" @click="cancel">取消</div>
        <div class="btn confirm" @click="confirm">确认</div>
      </slot>
    </mt-picker>
    <div class="dialog" @click="cancel"></div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    limitYear: {
      default: null
    },
    visibleItemCount:{
      type: Number,
      default: 7
    }
  },
  data() {
    return {
      slots: [{
        flex: 1,
        values: [],
        className: 'year'
      }, {
        flex: 1,
        values: [],
        className: 'month'
      }],
      selectYear: '',
      selectMonth: '',
      defaultYear: ''
    }
  },
  created() {
    this.defaultYear = new Date().getFullYear() - 20
    this.initDate();
  },
  mounted() {
    document.body.addEventListener('focusout', () => {
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        //软键盘收起的事件处理
        setTimeout(() => {
          const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0
          window.scrollTo(0, Math.max(scrollHeight - 1, 0))
        }, 100)
      }
    })
  },
  methods: {
    initDate(minYear, maxYear) {
      minYear = parseInt(minYear) || new Date().getFullYear() - 20;
      maxYear = parseInt(maxYear) || new Date().getFullYear();
      
      let now = new Date();
      let maxMonth = now.getMonth() + 1;
      let years = [], months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      for (let i = 0; i <= (maxYear - minYear); i++) {
        years.push(minYear + i);
      }
      this.slots[0].values = years;
      this.slots[0].defaultIndex = 0;
      this.selectYear = years[0];
      this.slots[1].values = months;
      this.selectMonth = 1;
    },
    cancel() {
      this.$emit('cancel');
    },
    confirm() {
      let now = new Date();
      let maxYear = now.getFullYear();
      let maxMonth = now.getMonth() + 1;
      if (this.selectYear == maxYear && this.selectMonth > maxMonth) {
        this.selectMonth = maxMonth;
      }
      let month = this.selectMonth || 1;
      month = month > 9 ? month : '0' + month;
      this.$emit('confirm', {
        year: this.selectYear || this.defaultYear,
        month: month
      });
    },
    onPickerChange(picker, values) {
      this.selectYear = picker.getSlotValue(0);
      this.selectMonth = picker.getSlotValue(1);
    }
  },
  watch: {
    limitYear: {
      deep: true,
      handler(newV) {
        let { minYear, maxYear } = newV;
        this.defaultYear = minYear;
        this.initDate(minYear, maxYear);
      }
    }
  }
}
</script>

<style lang="less">
.month-picker {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 99;

  .picker {
    position: absolute;
    bottom: 0;
    width: 100%;
    background: #fff;
    z-index: 100;
    .picker-toolbar {
      display: flex;
      .btn {
        flex: 1;
        font-size: 32px;
        color: #333;
        text-align: center;
        line-height: 80px;
        border-bottom: 1px solid #e5e5e5;
        &.confirm {
          color: #ff7300;
        }
      }
    }
  }
  .dialog {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }
}
</style>
