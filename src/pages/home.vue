<template>
	<div class="wrapper">
		<isheader class="header"></isheader>
		<tabs ref='tab' class='tab'></tabs>
		
		<tabbar class='tabbar'></tabbar>
	</div>
</template>

<script>
	import isheader from '../components/header'
	import tabs from '../components/teb'
	import tabbar from '../components/tabbar'
	export default {
		components: {
			isheader,
			tabs,
			tabbar
		},
		data() {
			return {
				msg: 'Welcome to Your Vue.js App'
			}
		},
		methods:{
			return_to_top(){
				console.log(132)
				window.onscroll=function(){
					console.log(document.body.scrollTop)
				}
			}
		}
	}
</script>

<style scoped="scoped">
	.wrapper {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}
	
	.header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1;
	}
	
	.tab {
		flex: 1;
		margin: 0.9rem 0 0 0;
	}
	.tabbar{
		margin-bottom: 0.56rem;
	}
	.up_box{
		background-color: red;
		position: fixed;
		bottom: 0.65rem;
		right: 0.2rem;
		display: inline-block;
		
	}
</style>