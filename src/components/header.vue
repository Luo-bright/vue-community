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
			<img src="https://user-images.githubusercontent.com/9276376/30367105-de95534e-989f-11e7-8c43-039222352121.png" />
			<p>
				Vue中文社区 独家公众号
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
				dialog: false
			}
		},
		methods: {
			handleChange(val) {
				this.value = val
				switch(val) {
					case '1':
						this.dialog = true
						break;
					case '2':

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