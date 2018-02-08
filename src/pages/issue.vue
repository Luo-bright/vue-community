<template>
	<div>
		<div>
			<mu-appbar title="发布话题"></mu-appbar>
			<div class="select_box">
				<mu-select-field v-model="list" :labelFocusClass="['label-foucs']" label="选择模块" class='select'>
					<mu-menu-item v-for="(text,index) in lists" :key="index" :value="index" :title="text" />
				</mu-select-field>
				<mu-auto-complete v-model='title' hintText="标题字数10字以上" labelFloat label="标题" fullWidth />
				<mu-text-field v-model='content' class='content' hintText="输入文本，支持markdown格式" multiLine :rows="5" :rowsMax='5' :underlineShow="false" />
				<mu-flat-button label="发布话题" class="bon" @click='setData' icon="near_me" primary/>
			</div>
			<mu-dialog :open="dialog" title="提示">
				请登录
				<mu-flat-button slot="actions" to='/home' @click="close" primary label="取消" />
				<mu-flat-button slot="actions" to='/login' primary @click="close" label="确定" />
			</mu-dialog>
			<mu-dialog :open="content_dialog" title="提示">
				{{mistake}}
				<mu-flat-button slot="actions" to='/issue' @click="conten_close" primary label="确定" />
			</mu-dialog>
		</div>
		<tabbar></tabbar>
	</div>
</template>

<script>
	import tabbar from '../components/tabbar'
	import marked from 'marked'
	export default {

		data() {
			return {
				dialog: false,
				content_dialog:false,
				accesstoken:'',
				title: '',
				content: '',
				tab:null,
				mistake:'请输入正确格式',
				list: 0,
				lists: ['分享', '问答', '招聘']
			}
		},
		created() {
			this.accesstoken = localStorage.getItem("accesstoken");
			this.getJurisdiction()
		},
		methods: {
			close() {
				this.dialog=false;
			},
			setData(){
				var that=this;
				let content = marked(that.content);
				if(this.list===0){
					this.tab='share'
				}if(this.list===1){
					this.tab='ask'
				}if(this.list===2){
					this.tab='job'
				}
				this.$http.post('https://www.vue-js.com/api/v1/topics',{
					accesstoken:this.accesstoken,
					title:this.title,
					tab:this.tab,
					content:content
				}).then(function(response){
					that.mistake='发布成功'
					that.content_dialog=true;
					console.log(response.data)
				}).catch(function(error){
					that.mistake='请输入正确格式';
					that.content_dialog=true;
					that.title="";
					that.content="";
					
				})
				
			},
			conten_close(){
				this.content_dialog=false;
			},
			getJurisdiction(){
				if(this.accesstoken){
					this.dialog= false
				}else{
					this.dialog=true;
				}
			},
			
		},
		components: {
			tabbar
		}
	}
</script>

<style scoped="scoped">
	.select_box {
		padding: 0 0.3rem;
	}
	
	.select {
		margin: 0.2rem 0;
	}
	
	.content {
		flex: 1;
		background-color: #f7f7f7;
		padding: 0.05rem;
	}
	
	.bon {
		width: 100%;
		color: white;
		background-color: #009688;
	}
</style>