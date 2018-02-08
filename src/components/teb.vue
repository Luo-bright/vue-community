<template>
	<div ref='myElement' class="demo-infinite-container main">
		<mu-tabs class='tabs' :value="activeTab" @change="handleTabChange">
			<mu-tab value="all" title="全部" />
			<mu-tab value="good" title="精华" />
			<mu-tab value="weex" title="weex" />
			<mu-tab value="share" title="分享" />
			<mu-tab value="ask" title="问答" />
			<mu-tab value="job" title="招聘" />
		</mu-tabs>
		<mu-icon-button class='up_box' @click='return_to_top' v-show='scroll_show' icon="navigation" />
		<mu-list>
			<template v-for='(item,index) in items'>
				<section class="list">
					<router-link :to="{path:'/user',query:{user:item.author.loginname}}" :src="item.author.avatar_url" tag="img" alt="user" class='tupian'></router-link>
					<router-link :to="{path:'/particulars',query:{id:item.id}}" tag="div" class="content">
						<div class="list_title">
							<span v-if="item.top">置顶</span>
							<span v-else-if="item.good">精华</span>
							<span v-else-if="item.tab === 'weex'" :style="styleObj">weex</span>
							<span v-else-if="item.tab === 'share'" :style="styleObj">分享</span>
							<span v-else-if="item.tab === 'ask'" :style="styleObj">问答</span>
							<span v-else-if="item.tab === 'job'" :style="styleObj">招聘</span>

							<h3>{{item.title}}</h3>
						</div>
						<div class="timer">
							<span>{{item.reply_count}}/{{item.visit_count}}</span>
							<span>{{item.last_reply_at|timeago}}</span>
						</div>
					</router-link>
				</section>
			</template>
			<p class="hint" v-show='nomore'>没有更多了。。。</p>
		</mu-list>
		<mu-infinite-scroll :scroller="scroller" :loading="loading" loadingText="卖命加载中" @load="loadMore" />
	</div>

</template>

<script>
	import timeago from 'timeago.js'
	export default {
		data() {
			return {
				activeTab: 'all',
				//保存分类数据
				items: [],
				//页数
				page: 1,
				scroller: null,
				loading: false,
				nomore: false,
				scroll_show: false,
				scrollValue: null,
				styleObj: {
					backgroundColor: '#999'
				},
				url: 'https://www.vue-js.com/api/v1/topics?tab=all'
			}
		},
		created() {
			this.getData()
		},
		mounted() {
			//			添加滚动事件
			this.$refs.myElement.addEventListener('scroll', this.getScroll)
			//			获取滚动的元素
			this.scroller = this.$el
		},
		//		过滤器
		filters: {

			timeago(val) {
				let time = new Date(val);
				var thistime = timeago();
				//设置时间并返回对应的过去时间
				return thistime.format(time, 'zh_CN');
			}

		},
		methods: {
			handleTabChange(val) {
				this.page = 1;
				this.nomore = false;
				this.activeTab = val;
				this.url = 'https://www.vue-js.com/api/v1/topics?tab=' + val
				this.getData()
			},
			handleActive() {
				window.alert('tab active')
			},
			loadMore() {
				if(!this.nomore) {
					this.loading = true;
					this.page += 1;
					let url = this.url + '&page=' + this.page;
					let arr = [];
					setTimeout(() => {
						var that = this;
						this.$http.get(url).then(function(response) {
							//每一次发请求都会push到arr当中，当没有数据的时候arr.length的长度就为0
							arr = response.data.data
							if(arr.length === 0) {
								that.loading = false;
								that.nomore = true;
								return
							}
							that.items = [...that.items, ...arr];
							arr = [];
						})
						this.loading = false;
					}, 1000)
				}
			},
			getScroll() {
				this.scrollValue = this.$refs.myElement.scrollTop
				if(this.scrollValue >= 500) {
					this.scroll_show = true;
				} else {
					this.scroll_show = false;
				}
			},
			return_to_top() {
				this.$refs.myElement.scrollTop = 0
			},
			//封装tab切换的数据请求
			getData() {
				let that = this;
				this.$http.get(this.url).then(function(response) {
					that.items = response.data.data;
				})
			}
		}
	}
</script>
<style scoped="scoped">
	.main {
		overflow: auto;
		border: 1px solid #d9d9d9;
	}
	
	.tab .tabs {
		margin-top: 0.5rem;
		height: 0.4rem;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		border-top: 1px solid rgba(255, 255, 255, .1);
		display: flex;
		justify-content: space-around;
	}
	
	.up_box {
		position: fixed;
		bottom: 0.65rem;
		right: 0.2rem;
		display: inline-block;
		z-index: 2;
		background-color: rgba(0, 0, 0, .5);
		color: white;
	}
	
	.mu-list {
		padding: 0;
	}
	
	.mu-tab-link,
	.mu-tab-active {
		white-space: nowrap;
	}
	
	.list {
		display: flex;
		border-bottom: 1px solid #999;
		padding: 0.12rem 0.12rem;
	}
	
	.list>img {
		width: 0.64rem;
		height: 0.64rem;
		margin-right: 0.12rem;
		border-radius: 50%;
	}
	
	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	
	.list_title>span {
		/*white-space:nowrap;*/
		background-color: #009688;
		color: #fff;
		padding: 0.02rem;
		border-radius: 0.03rem;
	}
	
	.list_title>h3 {
		display: inline;
		font-weight: 700;
	}
	
	.timer {
		display: flex;
		justify-content: space-between;
		color: #999;
	}
	
	.hint {
		color: #000000;
		text-align: center;
		margin: 0.2rem 0;
	}
</style>