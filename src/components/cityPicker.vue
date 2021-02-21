<template>
  <div class="city-picker" v-if="visible">
    <mt-picker valueKey="name" :showToolbar="true" :visibleItemCount="visibleItemCount" :slots="slots" @change="onPickerChange">
      <slot>
        <div class="btn cancel" @click="cancel">取消</div>
        <div class="btn confirm" @click="confirm">确认</div>
      </slot>
    </mt-picker>
    <div class="dialog" @click="cancel"></div>
  </div>
</template>

<script>
var timer;
import { getProvinceList, getCityList } from '@/api'
export default {
  props: {
    visible:{
      type: Boolean,
      default:false
    },
    visibleItemCount:{
      type: Number,
      default: 7
    }
  },
  data() {
    return {
      selectedProvince: {},
      selectedCity: {},
      slots: [{
        flex: 1,
        values: [],
        defaultIndex: 0,
        className: 'province'
      }, {
        flex: 1,
        values: [],
        className: 'city'
      }]
    }
  },
  created() {
    this.getProvinceList();
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
    // 获取省份列表
    async getProvinceList() {
      let res = await getProvinceList();
      if (res.code === 0) {
        res.data.forEach((el, index) => {
          this.slots[0].values.push({
            name: el.provinceName,
            code: el.provinceCode,
            index: index,
            type: 'province'
          })
          // this.slots[0].defaultIndex = this.visibleItemCount == 7 ? 3 : 2;
        });
      }
    },
    // 获取城市列表
    async getCityList(provinceId) {
      let params = {
        provinceId
      };
      let res = await getCityList(params);
      if (res.code === 0) {
        this.slots[1].values = [];
        res.data.forEach((el, index) => {
          this.slots[1].values.push({
            name: el.cityName,
            code: el.cityCode,
            type: 'city',
            index: index
          })
        });
      }
    },
    // 监听改变
    onPickerChange(picker, values) {
      timer = setTimeout(() => {
        let select = picker.getSlotValue(0);
        this.selectedCity = picker.getSlotValue(1);
        if (select) {
          if (this.selectedProvince.code != select.code) {
            this.selectedProvince = select;
            this.slots[1].values = [];
            this.getCityList(select.code)
          }
        }
      }, 50)
    },
    cancel() {
      this.$emit('cancel');
    },
    confirm() {
      this.$emit('confirm', this.selectedCity);
    }
  }
}
</script>

<style lang="less">
.city-picker {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2001;

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
