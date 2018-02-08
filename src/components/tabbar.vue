<template>
	<div>
		<mu-paper class='tabbar_box'>
			<mu-bottom-nav :value="bottomNav" @change="handleChange">
            <mu-bottom-nav-item to="/home" value="首页" title="首页" icon="home" />
            <mu-bottom-nav-item to="/issue" value="发布" title="发布" icon="subject" />
            <mu-bottom-nav-item to="/information" value="消息" title="消息" icon="message" />
            <mu-bottom-nav-item :to="person_path" value="我的" title="我的" icon="person" />
        </mu-bottom-nav>
		</mu-paper>	
	</div>
</template>

<script>
	export default {
		data() {
			return {
				bottomNav: '首页',
				person_path:'/login'
			}
		},
		created(){
			this.facthData()
		},
//		watch监控对应的是键值对对应的键可以对应相对应的值（或回调函数）
		 watch: {
            '$route': 'facthData'
        },
		methods: {
			handleChange(val) {
				this.bottomNav = val
			},
			facthData(){
				let accesstoken = localStorage.getItem("accesstoken")
				if(accesstoken){
					this.person_path='/my'
				}else{
					this.person_path='/login'
				}
				if(this.$route.path==='/home'){
					this.bottomNav='首页'
				}
				if(this.$route.path==='/issue'){
					this.bottomNav='发布'
				}
				if(this.$route.path==='/information'){
					this.bottomNav='消息'
				}
				if (this.$route.path === '/login' || this.$route.path === '/my') {
                    this.bottomNav = '我的'
                }
			}
		}
	}
</script>

<style scoped="scoped">
	.tabbar_box {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
	}
	.tabbar_box  .mu-bottom-nav-shift-wrapper {
    display: flex;
    justify-content: space-around;
}
</style>