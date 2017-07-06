// 注册对话框组件
Vue.component('dialog-component', {
	props:['message'],
  template: '#dialog-modal'
})

new Vue({
  el: '#dialog-div',
  data: {
    showModal: false,
    message : "hello ls"
  },
	methods:{
		showDialog: function(text){
			this.message = text;
			this.showModal = true;
		}
	}
})