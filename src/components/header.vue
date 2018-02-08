<template>
	<div class="hello">
		<mu-appbar class="title" title="Vue.js 中文社区">
			<mu-icon-button slot="left">
				<img class="logo" src="https://www.vue-js.com/public/images/vue.png">
			</mu-icon-button>
			<mu-icon-menu icon="more_vert" slot='right' @change="handleChange" :value='value'>
				<mu-menu-item value='1' title="微信公众号" />
				<mu-menu-item value='2' title="参考资料" />
				<mu-menu-item value='3' title="关于" />
			</mu-icon-menu>
		</mu-appbar>
		<mu-dialog :open="dialog" @close="close">
			<img :src="img_url" />
			<p>
				{{text_explain}}
			</p>
			<mu-flat-button slot="actions" primary @click="close" label="确定" />
		</mu-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				value: null,
				dialog: false,
				text_explain: '',
				img_url: ''
			}
		},
		methods: {
			handleChange(val) {
				this.value = val
				if(this.value == '1') {
					this.dialog = true;
					this.text_explain = "欢迎关注vue中文社区";
					this.img_url = "https://user-images.githubusercontent.com/9276376/30367105-de95534e-989f-11e7-8c43-039222352121.png"
				}
				if(this.value == '2') {
					this.dialog = true;
					this.text_explain = "公用api地址：https://www.vue-js.com/api/";
					this.img_url = "https://user-images.githubusercontent.com/9276376/30367105-de95534e-989f-11e7-8c43-039222352121.png"
				}
				if(this.value == '3'){
					this.dialog = true;
					this.text_explain = "是基于对vue所开发的。不足之处还请";
					this.img_url = "http://musicugc.cdn.qianqian.com/ugcdiy/pic/f1405bbdedcc0914ee99cb139c0324be.jpg@o_1%7Cs_2,w_192,h_192%7Cc_1,w_192,h_192"
				}
			},
			close(position) {
				this[position + 'Popup'] = false

			},
			close() {
				this.dialog = false
			}
		}
	}
</script>

<style scoped="scoped">
	.hello {
		color: white;
	}
	
	.title {
		width: 100%;
		background-color: #009688;
		height: 0.5rem;
		text-align: center;
	}
	
	.mu-popup-bottom {
		top: 50%;
		transform: translate(-50%, -50%);
	}
</style>