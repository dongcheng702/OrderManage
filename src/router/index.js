import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'ManageView',
    component: () => import('../views/ManageView.vue'),
    //重定向
    redirect: '/user',
    children: [
      { path: 'user', name: "User", component: () => import('../views/User.vue'), props: true },
      { 
        path: 'neworder', 
        name: "NewOrder", 
        component: () => import('../views/NewOrder.vue'),
        redirect: 'neworder/orderlist',
        // 添加子路由
        children: [
          { path: 'orderlist', name: "OrderList", component: () => import('../views/ProductSelection.vue'), props: true },
          { path: 'shippingandbilling', name: "ShippingAndBilling", component: () => import('../views/ShippingAndBilling.vue'), props: true },
          { path: 'orderconfirmation', name: "OrderConfirmation", component: () => import('../views/OrderConfirmation.vue'), props: true }
        ]
      }
      
    ]
  }
]    

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
