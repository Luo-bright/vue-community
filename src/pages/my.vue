<template>
	<div>
		<mu-appbar class='information_box' title="个人中心"></mu-appbar>
		<div class="portrait">
			<img :src="user_particulars.avatar_url" />
			<p class="user_name">{{user_particulars.loginname}}</p>
			<p>积分：<span>{{user_particulars.score}}</span>&nbsp;&nbsp;&nbsp;&nbsp;注册时间：<span>{{user_particulars.create_at | timeago}}</span></p>
			<mu-list :value="value" @change="handleChange" class='theme' >
				<mu-list-item :value="1" title="最近主题" inset toggleNested :open='false'>
					<mu-icon class="icon" slot="left" value="insert_drive_file" />
					<mu-list-item :value="3" v-for='(item,index) in user_particulars.recent_topics' :to='{path:"/particulars",query:{id:item.id}}' :title="item.title" slot="nested">
						<mu-icon class="icon" slot="left" value="description" />
					</mu-list-item>
					
					<span class="number">{{user_particulars.recent_topics.length}}个</span>
				</mu-list-item>
				<mu-list-item :value="2" title="最近回复" inset toggleNested :open='false'>
					<mu-icon class="icon" slot="left" value="drafts" />
					<mu-list-item :value="3" v-for='(item,index) in user_particulars.recent_replies' :to='{path:"/particulars",query:{id:item.id}}'  :title="item.title" slot="nested">
						<mu-icon class="icon" slot="left" value="insert_comment" />
					</mu-list-item>
					<span class="number">{{user_particulars.recent_replies.length}}个</span>
				</mu-list-item>
				<mu-list-item :value="3" title="收藏主题" inset toggleNested :open='false'>
					<mu-icon class="icon" slot="left" value="folder" />
					<mu-list-item :value="3"  v-for='(item,index) in user_particulars.collect_topics' :to='{path:"/particulars",query:{id:item.id}}' :title="item.title" slot="nested">
						<mu-icon class="icon" slot="left" value="folder_open" />
					</mu-list-item>
					<span class="number">{{user_particulars.collect_topics.length}}个</span>
				</mu-list-item>
			</mu-list>
			<mu-flat-button label="退出登录" class="bon" @click='quit'  primary/>
		</div>
		<tabbar></tabbar>
	</div>
</template>

<script>
	import tabbar from '../components/tabbar'
	import timeago from 'timeago.js'
	export default {
		data() {
			return {
				value: 1,
				accesstoken:'',
				user:{},
				user_particulars:{}
			}
		},
		created(){
			this.accesstoken=localStorage.getItem("accesstoken");
			this.getData();
			
		},
		
		methods: {
			handleChange(val) {
				this.value = val
			},
			
			getData(){
				let that=this
				this.$http.post('https://www.vue-js.com/api/v1/accesstoken',{
					accesstoken:that.accesstoken
				}).then(function(response){
					that.user=response.data;
					that.getUserData()
				})
			},
			getUserData(){
				let that=this
				this.$http.get('https://www.vue-js.com/api/v1/user/'+that.user.loginname).then(function(response){
					that.user_particulars=response.data.data;
				})
			},
			quit(){
				localStorage.removeItem('accesstoken');
				localStorage.removeItem('id');
				localStorage.removeItem('name');
				this.$router.push({
					path:'/login'
				})
			}
		},
		filters:{
			timeago(val){
				let time=new Date(val);
				var thistime = timeago();
				return thistime.format(time, 'zh_CN');
			}
		},
		components: {
			tabbar
		}
	}
</script>

<style scoped="scoped">
	.portrait {
		margin: 0.5rem 0;
		text-align: center;
	}
	.user_name{
		font-size: 0.2rem;
		color: #009688;
	}
	.theme{
		height: 2.2rem;
		overflow: auto;
	}
	.portrait>img {
		width: 75px;
		height: 75px;
		border-radius: 50%;
	}
	.number{
		color: white;
		background-color: #009688;
		padding: 0 0.05rem;
		border-radius: 0.03rem;
		position: relative;
		left: -0.15rem;
	}
	.bon {
		margin-top: 0.15rem;
		width: 100%;
		color: white;
		background-color: #009688;
	}
</style>