<template>
	<div>
		<mu-appbar class='information_box' title="用户中心"></mu-appbar>
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
			<mu-flat-button label="返回" class="bon" @click='goBack'  primary/>
		</div>
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
			this.getData();
			
		},
		
		methods: {
			handleChange(val){
				this.value=val
			},
			getData(){
				let that=this;
				let user=this.$route.query.user;
				let url = 'https://www.vue-js.com/api/v1/user/' + user
				this.$http.get(url).then(function(response){
					that.user_particulars=response.data.data
				})
			},
			goBack(){
				this.$router.go(-1)
			}
		},
		filters:{
			timeago(val){
				let time=new Date(val);
				var thistime = timeago();
				return thistime.format(time, 'zh_CN');
			}
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
		margin-top: 0.2rem;
		width: 100%;
		color: white;
		background-color: #009688;
	}
</style>