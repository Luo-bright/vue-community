<template>
	<div>
		<mu-appbar class='information_box' title="个人消息"></mu-appbar>
		<mu-tabs :value="activeTab" @change="handleTabChange" class='activeTab_box'>
			<mu-tab value="hasnot_read" title="未读消息" />
			<mu-tab value="has_read" title="已读消息" />
			<span class="news">{{count}}</span>
		</mu-tabs>
		<p class="login_prompt" v-if='!accesstoken'>登录解开更多秘密</p>
		<mu-list v-show="activeTab==='hasnot_read'" class='alert'>
			<mu-list-item v-for='(item,index) in hasnot_read_messages' :to="{path:'/particulars',query:{id:item.topic.id}}" :title="item.author.loginname">
				<mu-avatar :src="item.author.avatar_url" slot="leftAvatar" />
				<span slot="describe">
       			 <span style="color: rgba(0, 0, 0, .87)">来自:《{{item.topic.title}}》</span><br />内容：{{item.reply.content}}
				</span>
				<span>时间：{{item.reply.create_at | timeago}}</span>
			</mu-list-item>
			<p v-if="!hasnot_read_messages.length" v-show="accesstoken">暂无消息</p>
		</mu-list>
		<mu-list v-show="activeTab==='has_read'" class='alert'>
			<mu-list-item v-for='(item,index) in has_read_messages' :to="{path:'/particulars',query:{id:item.topic.id}}" :title="item.author.loginname">
				<mu-avatar :src="item.author.avatar_url" slot="leftAvatar" />
				<span slot="describe">
       			 <span style="color: rgba(0, 0, 0, .87)">来自:《{{item.topic.title}}》</span><br /> {{item.reply.content}}
				</span>
				<span>时间：{{item.reply.create_at | timeago}}</span>
			</mu-list-item>
			<p v-if="!has_read_messages.length" v-show="accesstoken">暂无消息</p>
		</mu-list>
		
		<mu-raised-button class="btn" @click='markRead' v-if='count' v-show='activeTab==="hasnot_read"' label="标记全部已读" icon="event_note" />
		<tabbar></tabbar>
	</div>
</template>

<script>
	import tabbar from '../components/tabbar'
	import timeago from 'timeago.js'
	export default {
		data() {
			return {
				activeTab: 'hasnot_read',
				informationObj: {},
				accesstoken: '',
				count: 0,
				hasnot_read_messages: [],
				has_read_messages: []
			}
		},
		created() {
			this.accesstoken = localStorage.getItem("accesstoken")
			if(this.accesstoken) {
				this.getInformation()
			}

		},
		methods: {
			handleTabChange(val) {
				this.activeTab = val
			},
			handleActive() {
				window.alert('tab active')
			},
			getInformation() {
				//获取到所有已读和未读信息
				let that = this
				this.accesstoken = localStorage.getItem('accesstoken');
				this.$http.get('https://www.vue-js.com/api/v1/messages?accesstoken=' + this.accesstoken).then(function(response) {
					that.hasnot_read_messages = response.data.data.hasnot_read_messages;
					that.has_read_messages= response.data.data.has_read_messages;
				});
				this.$http.get('https://www.vue-js.com/api/v1//message/count?accesstoken=' + this.accesstoken).then(function(response) {
					that.count = response.data.data
				})
			},
			markRead() {
				//标记全部已读
				let that = this
				this.accesstoken = localStorage.getItem('accesstoken');
				this.$http.post('https://www.vue-js.com/api/v1//message/mark_all?accesstoken=' + this.accesstoken).then(function(response) {
					that.getInformation()
				})
			}
		},
		filters: {
			//调用插件获取在什么时间段之前
			//filters是过滤器接收一个函数参数参数默认是一个参数
			//item.reply.create_at(实参) | timeago
			timeago(val) {
				var time = new Date(val);
				var thistime = timeago()
				return thistime.format(time, 'zh_CN');
			}
		},
		components: {
			tabbar
		}
	}
</script>

<style scoped="scoped">
	.information_box {
		border-bottom: 0.01rem solid rgba(255, 255, 255, .1);
	}
	.login_prompt{
		margin-top: 0.1rem;
	}
	.news {
		position: absolute;
		left: 1.2rem;
		width: 0.2rem;
		height: 0.2rem;
		font-size: 0.12rem;
		text-align: center;
		line-height: 0.2rem;
		background-color: red;
		display: inline-block;
		border-radius: 50%;
	}
	
	.alert {
		margin-top: 0.1rem;
		/*margin-bottom: 0.5rem;*/
		height: 3.5rem;
	}
	
	.btn {
		width: 60%;
		color: white;
		margin: 0 auto;
		display: inherit;
		background-color: #009688;
	}
</style>