import Vue from 'vue'
import VueRouter from 'vue-router'
import layout from 'views/layout'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
NProgress.configure({ showSpinner: false });

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '首页 ',
    redirect: '/index'
  },
  {
    path: '/404',
    name: '404',
    component: () => import('views/404.vue')
  },
  {
    path: '/tab',
    component:layout,
    meta:{ keepAlive: true },
    children:[
      { path:'/index',name:'首页',component:() => import('views/index.vue') },
      { path:'/cars',name:'买车', meta: { keepAlive:true }, component:() => import('views/cars.vue') },
      { path:'/sell',name:'卖车',component:() => import('views/sell.vue') },
      { path:'/custom',name:'帮我找车',component:() => import('views/custom.vue') },
    ]
  },
  {
    path: '/carDetail',
    name: '车源详情',
    component: () => import('views/carDetail.vue') 
  },
  {
    path: '/loveList',
    name: '收藏夹',
    component: () => import('views/loveList.vue') 
  },
  {
    path: '/finance',
    name: '金融方案',
    component: () => import('views/finance.vue') 
  },
  {
    path: '/subject',
    name: '汽车专题',
    component: () => import('views/subject.vue') 
  },
  {
    path: '*',
    redirect: '/index'
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next)=>{
  NProgress.start()
  if(to.name != '404' && !(to.query.sId && (to.query.dId || to.query.mId))){
    next({path:'/404'})
  }else{
    next()
  }
})

router.afterEach(()=>{
  NProgress.done()
})

const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

export default router
