<template>
	<div class="wrapper">
		<mu-appbar title="登录"></mu-appbar>
		 <div class="login_box">
		 	<mu-text-field label="Access Token" v-model='val' :errorText='error' labelFloat/><br/>
		 	<mu-flat-button  @click='login' label="登录" class="register" primary/>
		 </div>
		 <tabbar></tabbar>
	</div>
</template>

<script>
	import tabbar from '../components/tabbar'
	export default{
		data(){
			return {
				val:'',
				error:''
			}
		},
		methods:{
			login(){
				var that=this
				this.$http.post('https://www.vue-js.com/api/v1/accesstoken',{
					accesstoken:that.val
				}).then(function(response){
//					错误提示文字
					that.error='';
//					把用户信息存储在本地
					localStorage.setItem('accesstoken',that.val);
					localStorage.setItem('id',response.data.id);
					localStorage.setItem('name',response.data.loginname);
					localStorage.setItem('img',response.data.avatar_url);
					that.$router.push('my')
				}).catch(function(error){
					that.error='请正确输入accesstoken',
					that.$router.push(that.$route.matched[0].name)
				})
			}
		},
		components:{
			tabbar
		}
	}
</script>

<style scoped="scoped">
	.login_box{
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: center;
    	align-items: center;	
    	margin-top: 1.5rem;
	}
	.register{
		background-color: #009688;
		width: 60%;
		color: white;
	}
</style>