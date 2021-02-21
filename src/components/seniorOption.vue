<template>
  <div class="filter">
    <div class="selected-filter-box" v-if="selected.keyWord || selected.selectedBrand.name || selected.selectedChexi.seriesName || selected.selectedPrice.name && selected.selectedPrice.name != '不限' || selected.selectedYear.name && selected.selectedYear.name != '不限' || selected.selectedMile.name && selected.selectedMile.name != '不限' || selected.selectedLevels.length && selected.selectedLevels[0].name !='不限' || selected.selectedStandard.name && selected.selectedStandard.name != '不限' || selected.gearboxType.name && selected.gearboxType.name !='不限'">
      <div class="left-box">
        <!-- keyWord -->
        <van-tag v-if="selected.keyWord" size="large" class="select-tag" plain closeable @close="deleteItem('keyWord')">{{selected.keyWord}}</van-tag>
        <!-- 品牌 -->
        <van-tag v-if="selected.selectedBrand.name" class="select-tag" plain closeable @close="deleteItem('selectedBrand')">{{selected.selectedBrand.name}}</van-tag>
        <!-- 车系 -->
        <van-tag v-if="selected.selectedChexi.seriesName" class="select-tag" plain closeable @close="deleteItem('selectedChexi')">{{selected.selectedChexi.seriesName}}</van-tag>
        <!-- 价格 -->
        <van-tag v-if="selected.selectedPrice.name && selected.selectedPrice.name != '不限'" class="select-tag" plain closeable @close="deleteItem('selectedPrice')">{{selected.selectedPrice.name}}</van-tag>
        <!-- 车龄 -->
        <van-tag v-if="selected.selectedYear.name && selected.selectedYear.name != '不限'" class="select-tag" plain closeable @close="deleteItem('selectedYear')">{{selected.selectedYear.name}}</van-tag>
        <!-- 里程 -->
        <van-tag v-if="selected.selectedMile.name && selected.selectedMile.name != '不限'" class="select-tag" plain closeable @close="deleteItem('selectedMile')">{{selected.selectedMile.name}}</van-tag>
        <!-- 级别 -->
        <van-tag v-if="selected.selectedLevels.length && item.name !='不限'" v-for="(item,index) in selected.selectedLevels" class="select-tag" :key="index" plain closeable @close="deleteItem('selectedLevels',index)">{{item.name}}</van-tag>
        <!-- 级别 -->
        <van-tag v-if="selected.gearboxType.name && selected.gearboxType.name !='不限'" class="select-tag" plain closeable @close="deleteItem('gearboxType')">{{selected.gearboxType.name}}</van-tag>
        <!-- 排放标准 -->
        <van-tag v-if="selected.selectedStandard.name && selected.selectedStandard.name != '不限'" class="select-tag" plain closeable @close="deleteItem('selectedStandard')">{{selected.selectedStandard.name}}</van-tag>
      </div>
      <div class='reset' @click='reset'>
        <div>
          <i class="iconfont icon-reset"></i>
          <span>重置</span>
        </div>
      </div>
    </div>
    <div class="filter-header" ref="filterHeader">
      <div class="search">
        <van-search placeholder="搜索品牌/车型" v-model="keyWord" maxlength='30' @search='search' @clear='clear' />
        <span class="search-btn" @click="search">搜索</span>
        <img src="../assets/style-list.png" class="search-style" v-if="styleType == 'list'" alt="" @click="changeViewStyle" />
        <img src="../assets/style-card.png" class="search-style" v-else alt="" @click="changeViewStyle" />
      </div>
      <ul>
        <li @click="toggleFilter('sort')" :class="showFilterItem=='sort'&&'active'">
          <span>{{selected.selectedSort.name}}</span>
          <i class="iconfont icon-jt-bottom"></i>
          <i class="iconfont icon-jt-top"></i>
        </li>
        <li @click="toggleFilter('pinpai')" :class="showFilterItem=='pinpai'&&'active'">
          <span>品牌</span>
          <i class="iconfont icon-jt-bottom"></i>
          <i class="iconfont icon-jt-top"></i>
        </li>
        <li @click="toggleFilter('price')" :class="showFilterItem=='price'&&'active'">
          <span>价格</span>
          <i class="iconfont icon-jt-bottom"></i>
          <i class="iconfont icon-jt-top"></i>
        </li>
        <li @click="toggleFilter('gaoji')" :class="showFilterItem=='gaoji'&&'active'">
          <span>高级</span>
          <i class="iconfont icon-jt-bottom"></i>
          <i class="iconfont icon-jt-top"></i>
        </li>
      </ul>
    </div>
    <!-- 排序 -->
    <van-popup v-model="shows.sort" position='top' :close-on-popstate='true' :safe-area-inset-bottom='true' class="filter-popup filter-popup-top sort">
      <ul class="filter-item sort">
        <li class="between" v-for="item in filter.sortList" @click="selectSort(item)" :class="selected.selectedSort.name==item.name&&'active'">
          <span>{{item.name}}</span>
          <i class="iconfont icon-ok"></i>
        </li>
      </ul>
    </van-popup>
    <!-- 品牌 -->
    <van-popup v-model="shows.pinpai" position='top' id='pinpai' :close-on-popstate='true' :safe-area-inset-bottom='true' class="filter-popup filter-popup-top pinpai tab-bottom">
      <van-index-bar :index-list='indexList'>
        <div v-for="(brand,index) in filter.carBrand" :index="brand.initials" :key="index">
          <van-index-anchor :index="brand.initials">{{brand.initials}}</van-index-anchor>
          <p class="pinpai-item" v-for="item in brand.carBrands" :class="selected.selectedBrand.value == item.id && 'active'" @click="selectBrand(item)">
            <img v-lazy="item.icon" alt="">
            <span>{{item.brandName}}</span>
          </p>
        </div>
      </van-index-bar>
    </van-popup>
    <!-- 车系 -->
    <van-popup v-model="shows.chexi" position='right' :close-on-popstate='true' :safe-area-inset-bottom='true' class="filter-popup filter-popup-chexi tab-bottom">
      <div class="sub-popup-header">
        <img :src="selected.selectedBrand.icon" alt="">
        <span>{{selected.selectedBrand.name}}</span>
        <i class="iconfont icon-close" @click="shows.chexi = false;selected.selectedChexi={}"></i>
      </div>
      <div class="flex-1">
        <p class="buxian" @click="selectCheXi({})">不限车系</p>
        <!-- 车系 -->
        <!-- <p class="buxian" v-for="(item,idx) in filter.chexiData" :class="selected.selectedChexi.id==item.id&&item.id&&'active'" @click="selectCheXi(item)">
          {{item.seriesName}}
        </p> -->
        <div class="chexi-list" v-for="(series,index) in filter.chexiData">
          <!-- 车系 -->
          <div class="van-index-anchor">{{series.carManufacturer}}</div>
          <p v-for="(item,idx) in series.carSeriesItems" :class="selected.selectedChexi.id==item.id&&item.id&&'active'" @click="selectCheXi(item)">
            {{item.seriesName}}
          </p>
        </div>
      </div>
    </van-popup>

    <!-- 价格 -->
    <van-popup v-model="shows.price" position='top' id='price' :close-on-popstate='true' :safe-area-inset-bottom='true' class="filter-popup filter-popup-top price">
      <!-- <div class="custom">
        <p>自定义</p>
        <div class="custom-input">
          <div class="input-box">
            <input type="number" v-model="selected.selectedPrice.min">
            <span>万</span>
          </div>
          <div class="input-box">
            <input type="number" v-model="selected.selectedPrice.max">
            <span>万</span>
          </div>
          <div class="submit-btn" @click="confirmPrice()">确定</div>
        </div>
      </div> -->
      <div class="options-box">
        <div class="option" v-for="item in filter.priceList" @click="selectPrice(item)" :class="selected.selectedPrice.name==item.name&&'active'">
          {{item.name}}
        </div>
      </div>
    </van-popup>

    <!-- 高级筛选 -->
    <van-popup v-model="shows.gaoji" position='top' id='gaoji' :close-on-popstate='true' :safe-area-inset-bottom='true' class="filter-popup filter-popup-top gaoji tab-bottom">
      <div class="gaoji-main">
        <div class="brand-open between" @click="shows.pinpai = true;">
          <span>品牌</span>
          <span class="brand-open-r">
            {{selected.selectedBrand.name}} {{selected.selectedChexi.seriesName}}
            <i class="iconfont icon-jt-right"></i>
          </span>
        </div>
        <div class="gaoji-item">
          <p class="com-title">
            <span>级别</span>/可多选
          </p>
          <div class="options-box">
            <div class="option option-level" v-for="item in filter.allSellCarLevels" @click="selectLevels(item)" :class="isLevelsActive(item)&&'active'">
              <img :src="allSellCarLevelsIcons[item.name]" alt="">
              <p>{{item.name}}</p>
            </div>
          </div>
        </div>
        <div class="gaoji-item">
          <p class="com-title">
            <span>价格</span>
          </p>
          <div class="options-box">
            <div class="option" v-for="item in filter.priceList" @click="selectPrice(item)" :class="selected.selectedPrice.name==item.name&&'active'">
              {{item.name}}
            </div>
          </div>
          <!-- <div class="custom">
            <p>自定义</p>
            <div class="custom-input">
              <div class="input-box">
                <input type="number" v-model="selected.selectedPrice.min">
                <span>万</span>
              </div>
              <div class="input-box">
                <input type="number" v-model="selected.selectedPrice.max">
                <span>万</span>
              </div>
              <div class="submit-btn" @click="confirmPrice('gaoji')">确定</div>
            </div>
          </div> -->
        </div>
        <div class="gaoji-item">
          <p class="com-title">
            <span>车龄</span>
          </p>
          <div class="options-box">
            <div class="option" v-for="item in filter.yearList" :class="selected.selectedYear.name==item.name&&'active'" @click="selectYear(item)">
              {{item.name}}
            </div>
          </div>
        </div>
        <div class="gaoji-item">
          <p class="com-title">
            <span>里程</span>
          </p>
          <div class="options-box">
            <div class="option" v-for="item in filter.mileList" :class="selected.selectedMile.name==item.name&&'active'" @click="selectMile(item)">
              {{item.name}}
            </div>
          </div>
        </div>
        <div class="gaoji-item">
          <p class="com-title">
            <span>变速箱</span>
          </p>
          <div class="options-box">
            <div class="option" v-for="(item,index) in filter.gearboxType" :class="item.value == selected.gearboxType.value &&'active'" @click="selectgearboxType(item,index)">
              {{item.name}}
            </div>
          </div>
        </div>
        <div class="gaoji-item">
          <p class="com-title">
            <span>排放标准</span>
          </p>
          <div class="options-box">
            <div class="option" v-for="item in filter.allStandards" :class="selected.selectedStandard.name==item.name&&'active'" @click="selectStandard(item)">
              {{item.name}}
            </div>
          </div>
        </div>
      </div>
      <div class="filter-footer">
        <div class='filter-reset' @click='reset'>重置</div>
        <div class='filter-confirm' @click='confirmGaoji'>{{count?`查看${count}条车源`:'暂无车源'}}</div>
      </div>
    </van-popup>

  </div>
</template>

<script>
import { getCarBrandList, getCarSeriesList4Dealer, allLevelsAndStandards, getCarBrandListByDealerId, getSellCarCount, getCarBrandListByCityCode, getCarSeriesList4City } from 'api'
import { filterParams, priceArray } from 'utils/utils'
var timer;
export default {
  props: {
    styleType: {
      type: String,
      default: 'list'
    }
  },
  data() {
    return {
      filter: {
        // 排序
        sortList: [
          {
            name: "智能排序",
            value: "f_last_update_date DESC"
          },
          {
            name: "价格最低",
            value: "f_retail_price ASC"
          },
          {
            name: "价格最高",
            value: "f_retail_price DESC"
          },
          {
            name: "车龄最短",
            value: "f_plate_year DESC"
          },
          {
            name: "里程最少",
            value: "f_kilometres ASC"
          }
        ],
        // 价格
        priceList: priceArray,
        yearList: [
          { name: "不限", min: "", max: "" },
          { name: "2年以下", min: 0, max: 2 },
          { name: "2-4年", min: 2, max: 4 },
          { name: "4-6年", min: 4, max: 6 },
          { name: "6-10年", min: 6, max: 10 },
          { name: "10年以上", min: 10, max: '' },
        ],
        mileList: [
          { name: "不限", min: "", max: "" },
          { name: "2万公里以下", min: 0, max: 2 },
          { name: "2-4万公里", min: 2, max: 4 },
          { name: "4-6万公里", min: 4, max: 6 },
          { name: "6-10万公里", min: 6, max: 10 },
          { name: "10万公里以上", min: 10, max: '' },
        ],
        // 品牌
        carBrand: [],
        chexiData: [], // 车系
        allSellCarLevels: [], //售卖车辆级别
        allStandards: [], //车辆环保标准
        gearboxType: [
          { name: '不限', value: '' },
          { name: '手动', value: 'manual' },
          { name: '自动', value: 'auto' }
        ]
      },
      // 选中的
      selected: {
        keyWord: '',
        // 排序
        selectedSort: {
          name: "智能排序",
          value: "f_last_update_date DESC"
        },
        selectedCarType: {},
        // 品牌
        selectedBrand: {},
        // 车系
        selectedChexi: {},
        // 级别
        selectedLevels: [],
        // 环保标准
        selectedStandard: {},
        // 价格
        selectedPrice: {},
        // 里程
        selectedMile: {},
        // 车龄
        selectedYear: {},
        // 变速箱
        gearboxType: {}
      },
      // 价格输入
      price: {
        min: "",
        max: ""
      },
      shows: {
        sort: false,
        pinpai: false,
        chexi: false,
        price: false,
        gaoji: false
      },
      keyWord: '', // 关键词
      indexList: [],
      allSellCarLevelsIcons: { '不限': require('../assets/car-level-all.png'), '轿车': require('../assets/car-level-jc.png'), 'SUV': require('../assets/car-level-suv.png'), 'MPV': require('../assets/car-level-mpv.png'), '跑车': require('../assets/car-level-pc.png'), '面包车': require('../assets/car-level-mbc.png'), '商务': require('../assets/car-level-swc.png') },
      showFilterItem: '',
      count: 0
    }
  },
  computed: {
    isLevelsActive() {
      return (item) => {
        let flag = false
        for (let i = 0; i < this.selected.selectedLevels.length; i++) {
          if (item.name == this.selected.selectedLevels[i].name) {
            return true
          }
        }
        return false
      }
    }
  },
  created() {
    this.getCarBrandList();
    this.allLevelsAndStandards();

  },
  activated() {
    let params = this.$route.params;
    if (JSON.stringify(params) !== '{}') {
      let { max, min, keyWord, carLevels, brandId, brandName } = params;
      if (carLevels) {
        this.selected.selectedLevels = [{
          name: carLevels,
          active: true,
          type: "allStandards"
        }]
      }
      if (keyWord) {
        this.selected.keyWord = keyWord
      }
      if (brandId && brandName) {
        this.selected.selectedBrand = {
          name: brandName,
          value: brandId
        }
      }
      if (min || max) {
        this.selected.selectedPrice = {
          name: min <= 0 ? max + "万以下" : min > 0 && !max ? min + '万以上' : min + "-" + max + "万",
          min,
          max
        };
      }
      this.emitParams()
    }
  },
  methods: {
    // 获取车辆数量
    async getSellCarCount() {
      clearTimeout(timer)
      timer = setTimeout(async () => {
        let carLevels = [];
        if (this.selected.selectedLevels.length > 0) {
          this.selected.selectedLevels.forEach(ele => {
            if (ele.name != '不限') { carLevels.push(ele.name); }
          });
        }
        let params = {
          brandId: this.selected.selectedBrand.value, // 品牌
          catenaId: this.selected.selectedChexi.id, // 车系
          retailPriceMin: this.selected.selectedPrice.min, // 价格
          retailPriceMax: this.selected.selectedPrice.max, // 价格
          driverYearsMin: this.selected.selectedYear.min, // 车龄
          driverYearsMax: this.selected.selectedYear.max, // 车龄
          kilometresMin: this.selected.selectedMile.min, // 里程
          kilometresMax: this.selected.selectedMile.max, // 里程
          standard: this.selected.selectedStandard.name == '不限'? '': this.selected.selectedStandard.name, // 排放标准
          carLevels: carLevels, // 级别
          keyWord: this.selected.keyWord,
          cityId: this.$route.query.city,
          gearboxType: this.selected.gearboxType.value
        }
        params.dealerId = this.$route.query.dId;
        let res = await getSellCarCount(filterParams(params));
        if (res.code == 0) {
          this.count = res.data
        }
      }, 200);

    },
    // 显示隐藏选项
    toggleFilter(type) {
      if (type != this.showFilterItem) {
        this.shows[this.showFilterItem] = false;
        if (this.showFilterItem == 'pinpai') {
          this.shows.chexi = false
        }
      }
      this.shows[type] = !this.shows[type]
      this.showFilterItem = this.shows[type] ? type : '';
      if (type == 'gaoji' && !this.shows[type]) {
        this.emitParams()
      }
      if (this.showFilterItem == 'gaoji') {
        this.getSellCarCount();
      }
    },
    // 获取车辆级别和排放标准，用于高级查询
    async allLevelsAndStandards() {
      let _this = this;
      function initResData(res) {
        let levels = [],
          standards = [];
        res.allSellCarLevels.forEach(item => {
          let obj = {
            name: item,
            active: false,
            type: "allSellCarLevels"
          };
          if (_this.$route.query.carLevels == item) {
            _this.selected.selectedLevels.push(obj)
          }
          levels.push(obj);
        });
        res.allStandards.forEach(item => {
          standards.push({
            name: item,
            active: false,
            type: "allStandards"
          });
        });
        _this.filter.allSellCarLevels = levels;
        _this.filter.allStandards = standards;
      }
      try {
        let sessionAllLevel = sessionStorage.getItem('allLevelsAndStandards');
        if (sessionAllLevel) {
          initResData(JSON.parse(sessionAllLevel))
        } else {
          let res = await allLevelsAndStandards({});
          if (res.code == 0) {
            initResData(res.data);
            sessionStorage.setItem('allLevelsAndStandards', JSON.stringify(res.data))
          }
        }
      } catch (error) {

      }
    },
    // 获取品牌列表
    async getCarBrandList() {
      let res;
      if (this.$store.state.isMidShop) {
        res = await getCarBrandListByCityCode({ cityCode: this.$route.query.city })
      } else {
        res = await getCarBrandListByDealerId({ dealerId: this.$route.query.dId, employeeId: this.$route.query.sId })
      }
      if (res.code == 0) {
        let data = res.data;
        this.filter.carBrand = data
        data.forEach(ele => {
          this.indexList.push(ele.initials)
        });
      }
    },
    // 获取车系列表
    async getCarSeriesList(brandId) {
      let res;
      if (this.$store.state.isMidShop) {
        res = await getCarSeriesList4City({ brandId, cityCode: this.$route.query.city });
      } else {
        res = await getCarSeriesList4Dealer({ brandId, dealerId: this.$route.query.dId });
      }
      if (res.code == 0) {
        var chexiArr = [];
        this.filter.chexiData = res.data;
        this.shows.chexi = true;
      }
    },
    // 选择品牌
    selectBrand(item) {
      this.selected.selectedBrand = { name: item.brandName, value: item.id, icon: item.icon };
      this.getCarSeriesList(item.id);
      if (this.showFilterItem == 'gaoji') {
        this.getSellCarCount();
      }
    },
    // 选择车系
    selectCheXi(item) {
      this.selected.selectedChexi = item;
      this.shows.chexi = false;
      this.shows.pinpai = false;
      this.emitParams();
      if (this.showFilterItem == 'gaoji') {
        this.getSellCarCount()
        return;
      }
      this.showFilterItem = '';
    },
    // 选择排序
    selectSort(item) {
      this.selected.selectedSort = item;
      this.showFilterItem = '';
      this.shows.sort = false;
      this.emitParams();
    },
    // 选择价格
    selectPrice(item) {
      this.selected.selectedPrice = item;
      if (this.showFilterItem == "price") {
        this.shows.price = false;
        this.showFilterItem = '';
        this.emitParams();
      } else if (this.showFilterItem == 'gaoji') {
        this.getSellCarCount();
      }
    },
    // 选择车龄
    selectYear(item) {
      this.selected.selectedYear = item;
      this.getSellCarCount();
    },
    // 选择里程
    selectMile(item) {
      this.selected.selectedMile = item;
      this.getSellCarCount();
    },
    // 选择排放标准
    selectStandard(item) {
      this.selected.selectedStandard = item;
      this.getSellCarCount();
    },
    // 选择级别
    selectLevels(item) {
      if (item.name == "不限") {
        this.selected.selectedLevels = [item];
        this.getSellCarCount();
        return;
      }
      if (this.selected.selectedLevels.length >= 1 && this.selected.selectedLevels[0].name == '不限') {
        this.selected.selectedLevels.splice(0, 1)
      }
      let index = -1;
      for (let i = 0; i < this.selected.selectedLevels.length; i++) {
        if (item.name == this.selected.selectedLevels[i].name) {
          index = i
          break
        }
      }
      if (index < 0) {
        this.selected.selectedLevels.push(item);
      } else {
        this.selected.selectedLevels.splice(index, 1);
      }
      this.getSellCarCount();
    },
    // 选变速箱
    selectgearboxType(item, index) {
      this.selected.gearboxType = item;
      this.getSellCarCount();
    },
    // 价格输入确定
    confirmPrice(type) {
      let min = parseFloat(this.selected.selectedPrice.min) || 0;
      let max = parseFloat(this.selected.selectedPrice.max) || 0;
      if (min || max) {
        if (min >= max && min && max) {
          [min, max] = [max, min];
        }
        this.selected.selectedPrice = {
          name: min <= 0 ? max + "万以下" : min > 0 && !max ? min + '万以上' : min + "-" + max + "万",
          min,
          max
        };
      }
      this.shows.price = false;
      this.showFilterItem = '';
      if (!type) {
        this.emitParams();
      }
    },
    // keyword
    search() {
      this.selected.keyWord = this.keyWord;
      this.showFilterItem = '';
      this.emitParams();
    },
    clear() {
      this.selected.keyWord = '';
      this.keyWord = '';
      this.emitParams();
    },
    // 重置
    reset() {
      this.selected = {
        // 排序
        selectedSort: this.selected.selectedSort,
        selectedCarType: {},
        // 品牌
        selectedBrand: {},
        // 车系
        selectedChexi: {},
        // 级别
        selectedLevels: [],
        // 环保标准
        selectedStandard: {},
        // 价格
        selectedPrice: {},
        // 里程
        selectedMile: {},
        // 车龄
        selectedYear: {},
        // 变速箱
        gearboxType: {},
        // 密码
        keyWord: ''
      }
      this.keyWord = '';
      this.emitParams()
      this.getSellCarCount();
    },
    // 高级 确定
    confirmGaoji() {
      this.toggleFilter('gaoji')
    },
    // emitSelected
    emitParams() {
      let carLevels = [];
      this.selected.selectedLevels.forEach(ele => {
        if (ele.name != '不限') { carLevels.push(ele.name); }
      });
      let params = {
        brandId: this.selected.selectedBrand.value, // 品牌
        catenaId: this.selected.selectedChexi.id, // 车系
        retailPriceMin: this.selected.selectedPrice.min, // 价格
        retailPriceMax: this.selected.selectedPrice.max, // 价格
        driverYearsMin: this.selected.selectedYear.min, // 车龄
        driverYearsMax: this.selected.selectedYear.max, // 车龄
        kilometresMin: this.selected.selectedMile.min, // 里程
        kilometresMax: this.selected.selectedMile.max, // 里程
        standard: this.selected.selectedStandard.name == '不限'? '': this.selected.selectedStandard.name, // 排放标准
        carLevels: carLevels, // 级别
        keyWord: this.selected.keyWord,
        sortStr: this.selected.selectedSort.value,
        gearboxType: this.selected.gearboxType.value
      }
      if (!params.carLevels.length) delete params.carLevels
      this.$emit('emitParams', filterParams(params));
    },
    // 改变样式
    changeViewStyle() {
      this.$emit('changeViewStyle');
    },
    deleteItem(key, index) {
      if (key == 'selectedLevels') {
        this.selected[key].splice(index, 1);
      } else if (key == 'keyWord') {
        this.keyWord = ''
      } else {
        this.selected[key] = {};
      }
      this.emitParams()
    }
  }
}
</script>

<style lang="less" scoped>
.filter {
  padding-top: 180px;
  .filter-header {
    border-bottom: 1px solid #e5e5e5;
    background: #fff;
    position: fixed;
    z-index: 2999;
    width: 100%;
    height: 180px;
    overflow: hidden;
    top: 0;
    .search {
      color: #7f7f7f;
      display: flex;
      padding: 20px 30px 0;
      /deep/.van-search {
        flex: 1;
        padding: 0;
        vertical-align: middle;
        .van-icon-search {
          font-size: 32px;
          line-height: 48px;
        }
        .van-cell__value {
          input {
            line-height: 48px;
            font-size: 28px;
            padding: 0;
          }
        }
      }
      .search-btn {
        font-size: 32px;
        padding: 0 20px;
        line-height: 72px;
        vertical-align: middle;
      }
      .search-style {
        width: 56px;
        height: 56px;
        line-height: 72px;
        margin-top: 10px;
      }
    }
    ul {
      display: flex;
      height: 88px;
      overflow: hidden;
      padding: 0 30px;
    }
    li:first-child {
      text-align: left;
    }
    li:last-child {
      flex: 0 0 120px;
      text-align: right;
    }
    li {
      flex: 1;
      text-align: center;
      color: #7f7f7f;
      span {
        font-size: 30px;
        line-height: 88px;
      }
      i {
        font-size: 18px;
        margin-left: 4px;
      }
      .icon-jt-top {
        color: #ff7300;
        display: none;
      }
      .icon-jt-bottom {
        display: inline-block;
      }
    }
    li.active {
      span {
        color: #ff7300;
      }
      .icon-jt-top {
        color: #ff7300;
        display: inline-block;
      }
      .icon-jt-bottom {
        display: none;
      }
    }
  }
  .filter-popup {
    &.price {
      padding: 30px 0;
    }
    &.tab-bottom {
      bottom: 100px;
    }
    &.filter-popup-top {
      top: 180px;
    }
    &.filter-popup-chexi {
      padding-top: 180px;
      width: 60%;
      height: 100%;
      overflow-y: hidden;
      display: flex;
      flex-direction: column;
      .flex-1 {
        flex: 1;
        overflow-y: auto;
      }
      // 车系
      .chexi-list p,
      .buxian {
        height: 90px;
        padding-left: 30px;
        line-height: 90px;
        font-size: 28px;
        flex: 1;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        &:not(:first-child) {
          border-top: 1px solid #e5e5e5;
        }
        &.active {
          color: #ff7300;
        }
      }
      .sub-popup-header {
        padding: 14px 20px;
        border-bottom: 1px solid #e5e5e5;
        display: flex;
        img {
          display: inline-block;
          width: 72px;
          height: 72px;
          margin-right: 20px;
          vertical-align: middle;
        }
        span {
          font-size: 28px;
          vertical-align: middle;
          flex: 1;
          line-height: 72px;
        }
        .icon-close {
          font-size: 40px;
          vertical-align: middle;
          line-height: 72px;
        }
      }
    }
    .filter-item {
      background: #fff;
      max-height: 100%;
      overflow-y: auto;
      position: relative;
      z-index: 100;
    }
    // 选项
    .sort {
      padding: 0 30px;
      li {
        height: 90px;
        overflow: hidden;
        &:not(:first-child) {
          border-top: 1px solid #e5e5e5;
        }
        span {
          font-size: 30px;
          color: #7f7f7f;
          line-height: 90px;
        }
        i {
          color: #ff7300;
          line-height: 90px;
          font-weight: bold;
          display: none;
          font-size: 40px;
        }
      }
      li.active {
        i {
          display: inline-block;
        }
      }
    }
    /deep/.van-index-anchor {
      line-height: 70px;
      background: #f1eff2;
      padding-left: 30px;
      font-size: 24px;
      color: #ff7300;
    }
    // 品牌
    &.pinpai {
      /deep/.van-index-bar__sidebar {
        span {
          font-size: 20px;
          line-height: 30px;
        }
        .van-index-bar__index--active {
          color: #ff7300;
        }
      }
      .pinpai-item {
        margin: 0 30px;
        height: 90px;
        overflow: hidden;
        &:not(:last-child) {
          border-bottom: 1px solid #e5e5e5;
        }
        img {
          width: 48px;
          height: 48px;
          vertical-align: middle;
          margin-right: 20px;
          display: inline-block;
          object-fit: contain;
        }
        span {
          font-size: 30px;
          color: #7f7f7f;
          line-height: 90px;
          vertical-align: middle;
        }
      }
    }

    &.gaoji {
      padding-bottom: 100px;
      bottom: 100px;
      overflow: hidden;
      .gaoji-main {
        height: 100%;
        overflow-y: auto;
      }
      .brand-open {
        padding: 0 30px;
        border-bottom: 1px solid #e5e5e5;
        span {
          font-size: 32px;
          color: #3b3b3b;
          line-height: 90px;
        }
        .brand-open-r {
          color: #7f7f7f;
          line-height: 90px;
          font-size: 28px;
        }
      }
      .gaoji-item {
        .slider-box {
          padding: 10px 24px 60px;
          position: relative;
          .slider-span {
            position: absolute;
            top: -70px;
            right: 0;
            color: #7f7f7f;
            font-size: 30px;
          }
        }
        .com-title {
          color: #b2b2b2;
          font-size: 22px;
          margin: 30px 0;
          padding: 0 30px;
          span {
            color: #3b3b3b;
            font-size: 30px;
          }
        }
        .el-slider {
          width: 90%;
          margin: 0 auto;
        }
        .custom-input {
          border-bottom: 0;
          padding-bottom: 0;
        }
      }
      .filter-footer {
        height: 100px;
        width: 100%;
        background: #fff;
        display: flex;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 9999;
        div {
          width: 224px;
          line-height: 100px;
          text-align: center;
          font-size: 34px;
          color: #3b3b3b;
          border-top: 1px solid #e5e5e5;
        }
        .filter-confirm {
          background: #ff7300;
          color: #fff;
          border-top: 0;
          flex: 1;
        }
      }
    }

    .options-box {
      padding: 0 30px;
      .option {
        width: 216px;
        display: inline-block;
        height: 74px;
        line-height: 72px;
        border: 2px solid #e5e5e5;
        border-radius: 4px;
        text-align: center;
        color: #7f7f7f;
        font-size: 28px;
        margin-right: 20px;
        margin-bottom: 20px;
      }
      .option:nth-child(3n) {
        margin-right: 0;
      }
      .option.active {
        border: 2px solid #ff7300;
        color: #ff7300;
      }
      .option-level {
        border: 0;
        height: auto;
        line-height: 36px;
        text-align: center;
        background: #f6f6f6;
        border: 1px solid #f6f6f6;
        border-radius: 4px;
        padding: 10px 0 20px;
        img {
          width: 168px;
        }
        p {
          font-size: 28px;
          color: #3b3b3b;
          text-align: center;
          line-height: 36px;
          margin-top: -10px;
        }
      }
      .option-level.active {
        border: 1px solid #ff7300;
        background: #fef9f6;
      }
    }
    .custom {
      padding: 30px 30px 0;
      margin-bottom: 40px;
      p {
        color: #7f7f7f;
        font-size: 20px;
      }
      .custom-input {
        padding: 30px 0 40px;
        border-bottom: 1px solid #e5e5e5;
        div {
          display: inline-block;
        }
        .input-box {
          width: 214px;
          border: 2px solid #e5e5e5;
          overflow: hidden;
          vertical-align: middle;
          input {
            width: 170px;
            padding: 0 20px;
            height: 74px;
            line-height: 72px;
            vertical-align: middle;
            font-size: 28px;
          }
          span {
            line-height: 72px;
            vertical-align: middle;
            font-size: 28px;
            color: #7f7f7f;
          }
        }
        .input-box:first-child {
          margin-right: 50px;
          position: relative;
        }
        .input-box:first-child::after {
          content: "";
          position: absolute;
          right: -37px;
          top: 50%;
          width: 24px;
          height: 2px;
          background: #e5e5e5;
        }
        .submit-btn {
          width: 186px;
          height: 74px;
          background: #ff7300;
          vertical-align: middle;
          margin-left: 20px;
          line-height: 74px;
          color: #fff;
          text-align: center;
          font-size: 28px;
          border-radius: 4px;
        }
      }
    }
  }

  .selected-filter-box {
    display: flex;
    padding: 7px 30px;
    border-bottom: 1px solid #e5e5e5;
    .left-box {
      flex: 1;
      white-space: nowrap;
      overflow-x: auto;
      margin-right: 30px;
      padding-left: 4px;
      .select-tag {
        padding: 12px 10px;
        margin: 7px 20px 7px 0;
        font-size: 24px;
        i {
          font-size: 28px;
          margin-top: 4px;
        }
      }
    }
    .reset {
      flex: 0 0 120px;
      display: flex;
      align-items: center;
      > div {
        width: 113px;
        height: 56px;
        background: #e5e5e5;
        border-radius: 4px;
        text-align: center;
        color: #7f7f7f;
        font-size: 24px;
        span {
          line-height: 56px;
          font-size: 24px;
        }
      }
    }
  }
}
</style>