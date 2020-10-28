import underscore from './underscore-extend'
import appAjax from './app-ajax'
import { stopPullDownRefresh, showToast } from "linewell-api"

var privateMethods = {
	
	/**
	 * 获取列表
	 * @param {Object} callback
	 */
	getList(callback, failCallback){
		var that = this;
		appAjax.postJson({
			service : this.options.serviceUrl,
			data : this.options.sendData,
			otherParams : this.options.otherParams,
			type : this.options.type
		}).then(() => {
			if(!data || data.length < that.options.sendData.pageSize){
				
				that.options.sendData.type == "UP" ? that.isNoMore = true : that.isNoMore = false;
				
			}else{
				that.isNoMore = false;
			}
			
			callback && callback(data);
			
			that.vm.setData({
				pullMessage : that.isNoMore = true ? this.options.contentText.contentnomore : this.options.contentText.contentup
			})
			
		}).catch(() => {
			
			failCallback && failCallback();
		})
	}
};

var Scroller = function(vm, options){
	this.vm = vm;
	
	this.list = null;
	
	this.options = {
		contentText : {
			contentup : "上拉显示更多",
			contentrefresh : "正在加载...",
			contentnomore : "没有更多数据了"
		},
		sendData : {
			lastdate : 0,
			pageSize : 20,
			type : "DOWN" // DOWN UP
		},
		type : "get",
		serviceUrl : "",
		useAutoRefresh : true,
		otherParams : null,
		emptyTips : "暂无数据",
		dataKey : ""
	}
	
	this.options = underscore.deepExtend(this.options, this.postData);
	
	if(this.options.useAutoRefresh){
		this.refresh();
	}
}

/**
 * 下拉刷新
 */
Scroller.prototype.refresh = function(){
	
	this.options.sendData.type = "DOWN";
	this.options.sendData.lastdate = 0;
	
	// 正在加载数据
	!this.list && this.vm.setData({
		pullMessage : this.options.contentText.contentrefresh
	});
	
	privateMethods.getList.call(this, (data = [])=>{
		this.list = data;
		
		this.options.successCallback && this.options.successCallback(this.list);
		
		stopPullDownRefresh();
		
		// 设置是否显示空界面
		this.vm.setData({
			isShowEmpty : this.list.length <= 0 ? true : false
		})
	
	}, ()=>{
		this.options.failCallback && this.options.failCallback();
		
		stopPullDownRefresh();
		
	});
}

/**
 * 上拉刷新
 */
Scroller.prototype.loadMore = function(){
	this.options.sendData.type = "UP"; 
	
	// 没有数据不再请求
	if(this.isNoMore) {
		return;
	}
	
	// 正在加载数据
	this.vm.setData({
		pullMessage : this.options.contentText.contentrefresh
	});
	
	this.list.length > 0 && (this.options.sendData.lastdate = this.list[this.list.length - 1].lastdate || 0);
	
	privateMethods.getList.call(this, (data)=>{
		
		if(data && data.length > 0){
			var ret = this.list.concat(data);
			
			this.list = ret;
			this.options.successCallback && this.options.successCallback(ret);
		}
	
	}, ()=>{
		this.options.failCallback && this.options.failCallback();
		
	});
}

/**
 * 过滤
 */
Scroller.prototype.filterData = function(data = {}){
	
	this.options.sendData = underscore.deepExtend(this.options.sendData, data);
	this.refresh();
}