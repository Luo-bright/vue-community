<template>
	<div>
		<mu-appbar class="title" title="文章详情">
			<mu-icon-button slot="left" @click='superior' icon="arrow_back"></mu-icon-button>
		</mu-appbar>
		<div class="headline">
			<!--标题区域-->
			<h1 class='headline_h1'>
				<span class="headline_span" v-if="data.top">置顶</span>
				 <span class="headline_span" v-else-if="data.good">精华</span>
				{{data.title}}</h1>
			<mu-checkbox :label="alter" v-if='collect_hide' v-model='collect' class="demo-checkbox collect" uncheckIcon="favorite_border" checkedIcon="favorite" />
			<div class="label">
				<span>发布于：{{data.create_at | timeago}}</span>
				<span>作者：{{data.author.loginname}}</span>
				<span> {{data.visit_count}}次浏览</span>
				<span>来自：分享</span>
			</div>
			<!--内容展示区域-->
			<article class="md_content" v-html="data.content"></article>
			<!--评论区域-->
			<div class="comment">
				<p class='comment_quantity'>
					{{data.replies.length}}条回复
				</p>
				<ul>
					<li v-for="(item,index) in data.replies">
						<section class="msg">
							<div class="lnformationAbout">
								<img class="head_portrait" :src="item.author.avatar_url" />
								<span class='name'>{{item.author.loginname}}</span>
								<span class="time">{{index+1}}楼·{{item.create_at | timeago}}</span>
							</div>
							<div class="like">
								<mu-icon value="thumb_up" @click='like(index)' :size="16" />
								<span>{{item.ups.length}}</span>
								<mu-icon value="textsms" @click="review(index)" :size="16" />
							</div>
							<div class="clear"></div>
							<p class="comment_content" v-html="item.content"></p>
							<div class="clear"></div>
							<div class="content" v-if="item.reply_show">
								<textarea class="reply" rows="5" v-model="single_reply" placeholder='请输入回复内容...'></textarea>
								<mu-raised-button @click='reply(index)' label="回复" class="demo-raised-button" primary/>
								<mu-raised-button @click='cancel(index)' label="取消" class="demo-raised-button" primary/>
							</div>
						</section>
					</li>
				</ul>
				<div>
					<p class="add_a_reply">添加回复</p>
					<textarea class="reply" rows="5" v-model='reply_hf' placeholder='请输入回复内容...'></textarea>
					<mu-raised-button label="回复" @click='revert' class="demo-raised-button" primary/>
				</div>
			</div>
		</div>
		<mu-dialog :open="dialog" title="提示">
			{{hint}}
			<mu-flat-button slot="actions" @click="close" primary label="取消" />
			<mu-flat-button slot="actions" to='/login' primary @click="close" label="确定" />
		</mu-dialog>
	</div>
</template>

<script>
	import timeago from 'timeago.js'
	export default {
		data() {
			return {
				accesstoken: '',
				dialog: false,
				single_reply: '',
				reply_hf: '',
				loginname: '',
				collect_hide: false,
				collect: false,
				alter: '收藏文章',
				hint: '',
				data: {
					replies: {},
					author: {}
				}
			}
		},
		created() {
			this.accesstoken = localStorage.getItem('accesstoken');
			this.loginname = localStorage.getItem('name');
			this.getArticleData();
			this.hide();
		},
		watch: {
			collect: function(val) {
				if(val) {
					this.collect_article();
					this.alter = '取消收藏'
				} else {
					this.cancel_collect()
					this.alter = '收藏文章'
				}
			}
		},

		filters: {
			timeago(val) {
				let time = new Date(val);
				var thistime = timeago();
				return thistime.format(time, 'zh_CN');
			},
			comeFrom(val) {
				if(val === "share") {
					return '分享'
				}
				if(val == 'weex') {
					return 'weex'
				}
				if(val == 'ask') {
					return '问答'
				}
				if(val == 'job') {
					return '招聘'
				}
			}
		},
		methods: {
			superior() {
				this.$router.go(-1)
			},
			close() {
				this.dialog = false;
			},
			hide() {
				if(this.accesstoken) {
					this.collect_hide = true;
				} else {
					this.collect_hide = false;
				}
			},
			//发送文章详情请求
			getArticleData() {
				let id = this.$route.query.id;
				let that = this;
				var url = 'https://www.vue-js.com/api/v1/topic/' + id
				this.$http.get(url).then(function(response) {
					that.data = response.data.data
					that.judge_collect()
				})
			},
			review(index) {
				if(this.accesstoken) {
					//显示文本域
					let that = this
					let arr = this.data.replies
					arr.map(function(item, i) {
						//给每一项添加一个reply_show字段用来判断文本域的显示和隐藏
						index === i ? that.$set(item, 'reply_show', true) : that.$set(item, 'reply_show', false);
					});
					this.single_reply = '@' + this.data.replies[index].author.loginname + ' '
				} else {
					this.dialog = true
					this.hint = '亲。评论需要登录哦！'
				}
			},
			reply(index) {
				//对评论进行回复
				let arr = this.data.replies;
				let id = this.$route.query.id;
				let that = this;
				console.log(arr[index].id)
				this.$http.post('https://www.vue-js.com/api/v1/topic/' + id + '/replies', {
					accesstoken: that.accesstoken,
					content: that.single_reply,
					reply_id: arr[index].id
				}).then(function(response) {
					that.dialog = true;
					that.hint = '已留言'
					setTimeout(function() {
						that.dialog = false;
						that.getArticleData()
					}, 1000)
				})
			},
			revert() {
				//对文章进行回复
				if(this.accesstoken) {
					let that = this;
					let id = this.$route.query.id;
					console.log(id)
					this.$http.post('https://www.vue-js.com/api/v1/topic/' + id + '/replies', {
						accesstoken: that.accesstoken,
						content: that.reply_hf
					}).then(function(response) {
						that.dialog = true;
						that.hint = '已留下你的足迹'
						setTimeout(function() {
							that.dialog = false;
							that.getArticleData()
						}, 1000)
					})
				} else {
					this.dialog = true
					this.hint = '大侠。请登录'
				}
			},
			cancel(index) {
				//隐藏文本域评论
				let arr = this.data.replies;
				arr[index].reply_show = false
			},
			like(index) {
				//对评论内容进行点赞
				if(this.accesstoken) {
					let that = this;
					let id = this.data.replies[index].id;
					this.$http.post('https://www.vue-js.com/api/v1/reply/' + id + '/ups', {
						accesstoken: that.accesstoken
					}).then(function(response) {
						that.reply_hf = ''
						that.getArticleData()
					})
				} else {
					this.dialog = true
					this.hint = '亲。登录后可点赞哦'
				}

			},
			collect_article() {
				//收藏文章
				let that = this;
				let id = this.$route.query.id;
				this.$http.post('https://www.vue-js.com/api/v1/topic/collect', {
					accesstoken: that.accesstoken,
					topic_id: id
				}).then(function(response) {
					that.getArticleData()
				})
			},
			cancel_collect() {
				//取消收藏文章
				let that = this;
				let id = this.$route.query.id;
				this.$http.post('https://www.vue-js.com/api/v1/topic/de_collect', {
					accesstoken: that.accesstoken,
					topic_id: id
				}).then(function(response) {
					that.getArticleData()
				})
			},
			judge_collect() {
				let that = this;
				this.$http.get('https://www.vue-js.com/api/v1/user/' + that.loginname).then(function(response) {
					let arr = response.data.data.collect_topics;
					let articleID = that.data.id;
					arr.find(function(item) {
						if(item.id === articleID) {
							that.collect = true;
							that.alter = '取消收藏'
						}
					})
				})
			}
		}

	}
</script>

<style scoped="scoped">
	.clear {
		clear: both;
		height: 0;
		line-height: 0;
		font-size: 0;
	}
	
	.headline {
		padding: 0.2rem 0.15rem;
	}
	
	.headline_h1 {
		color: #000;
		font-size: 0.2rem;
	}
	
	.headline_span {
		background-color: #009688;
		color: white;
		padding: 0.02rem 0.05rem;
		border-radius: 0.05rem;
	}
	
	.collect {
		color: #009688 !important;
	}
	
	.label>span {
		color: #838383;
	}
	
	.label>span:before {
		content: '•';
		padding: 0 0.05rem;
	}
	
	.content_box {
		margin-top: 0.15rem;
		padding-top: 0.15rem;
		border-top: 1px solid #e5e5e5;
	}
	
	.md_content {
		padding: 0.1rem;
		border-top: 1px solid #e5e5e5;
		margin-bottom: 0.2rem;
	}
	
	.md_content h1,
	.md_content h2,
	.md_content h3,
	.md_content h4,
	.md_content h5,
	.md_content h6 {
		font-weight: 700;
	}
	
	.md_content p {
		font-size: 15px;
		line-height: 1.7em;
		overflow: auto;
	}
	
	.md_content h2 {
		font-size: 26px;
		margin: 30px 0 15px;
		border-bottom: 1px solid #eee;
	}
	
	.md_content h3 {
		margin: 30px 0 15px;
		border-bottom: 1px solid #eee;
		font-size: 24.5px;
	}
	
	.md_content pre {
		font-family: Monaco, Menlo, Consolas, "Courier New", monospace;
		font-size: 14px;
		border-radius: 0;
		padding: 0.1rem;
		border: 0;
		margin: 0.1rem 0;
		border-width: 1px 0;
		background: #f7f7f7;
	}
	
	.md_content ul {
		list-style-type: disc;
		margin: 0 0 0.1rem 0.2rem;
	}
	
	.md_content ol {
		list-style: decimal;
		margin-left: 0.2em;
	}
	
	.md_content li {
		line-height: 0.25rem;
	}
	
	.md_content a {
		display: block;
	}
	
	.md_content img {
		height: auto;
		max-width: 100%;
		vertical-align: middle;
		border: 0;
	}
	
	.comment {
		margin: 0;
		padding: 0 !important;
	}
	
	.comment>ul>li {
		border-bottom: 1px solid #999999;
		margin-top: 0.2rem;
	}
	
	.comment_quantity {
		width: 100%;
		height: 0.5rem;
		line-height: 0.5rem;
		padding-left: 15px;
		margin: 0.2rem 0;
		background-color: #f6f6f6;
	}
	
	.msg {
		/*display: flex;*/
		/*justify-content: space-between ;*/
	}
	
	.lnformationAbout {
		width: 75%;
		float: left;
		position: relative;
		height: 48px;
	}
	
	.name {
		position: absolute;
		top: 0;
		font-size: 17px;
	}
	
	.time {
		position: absolute;
		bottom: 0;
		font-size: 10px;
		color: #08c;
	}
	
	.like {
		float: left;
		width: 25%;
		height: 48px;
		line-height: 48px;
		color: #009688;
	}
	
	.like>span {
		margin: 0 0.07rem;
		line-height: 100%;
	}
	
	.content {
		width: 100%;
		margin-bottom: 0.2rem;
	}
	
	.comment_content {
		padding: 0.25rem 0 0.3rem 0;
	}
	
	.head_portrait {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		line-height: 48px;
		margin-right: 10px;
	}
	
	.add_a_reply {
		padding: 16px;
		background-color: #F6F6F6;
		margin: 16px 0;
	}
	
	.reply {
		width: 100%;
	}
</style>