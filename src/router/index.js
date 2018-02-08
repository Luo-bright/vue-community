import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const home= resolve=>require(['@/pages/home'],resolve)
const my= resolve=>require(['@/pages/my'],resolve)
const issue= resolve=>require(['@/pages/issue'],resolve)
const particulars= resolve=>require(['@/pages/particulars'],resolve)
const information= resolve=>require(['@/pages/information'],resolve)
const login= resolve=>require(['@/pages/login'],resolve)
const user= resolve=>require(['@/pages/user'],resolve)

export default new Router({
	 mode: 'history',
  routes: [
    {
      path: '/home',
      name: 'home',
      component: home
    },
     {
      path: '/my',
      name: 'my',
      component: my
    },
    {
      path: '/issue',
      name: 'issue',
      component: issue
    },
     {
      path: '/particulars',
      name: 'particulars',
      component: particulars
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
	 {
      path: '/user',
      name: 'user',
      component: user
    },
     {
      path: '/information',
      name: 'information',
      component: information
    }
  ]
})
