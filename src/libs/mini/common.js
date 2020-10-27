/**
 * 所有页面公用脚本
 * @author 	cyixiang@linewell.com
 * @since	2018-06-27
 */
var utils = require("./utils.js");
var appSession = require("./app-session.js");
var constants = require("../config/constants.js");

module.exports = {
	
	/**
	 * 处理第三方url并返回
	 * @param {Object} urlStr
	 */
	getThirdUrl : function(urlStr){
		var urlStr = utils.addUrlParam("T", "XMCITY", urlStr);
		
		return "/pages/common/web-view?url=" + encodeURIComponent(constants.H5_URL + "/mini-auth/mini-auth.html?mpt=" + encodeURIComponent(appSession.getToken()) + "&rUrl=" + encodeURIComponent(urlStr));
		
	},
	
	/**
	 * 截取pageId后面参数
	 * @param {Object} url
	 */
	spliceParameter : function(url){
		var firstParam = url.indexOf("&") || "";
		
		var pageUrl = "";
		if (firstParam > 0){
			pageUrl = "?" + url.substr(firstParam + 1);
		}
		return pageUrl;
	},
	
	/**
	 * 获取内链
	 * @param {Object} pageId
	 */
	getInnerLinkUrl : function(pageId){
		
		var pageParams = this.spliceParameter(pageId);
		pageParams && (pageId = pageId.split("&")[0]);
		
		var configMap = {
			
			// 资讯
			"103" : "/pages/article/detail",
			
			// 随手拍列表
			"10031" : "/pages/snapshot/snapshot-list",
			
			// 随手拍发布
			"10032" : "/pages/snapshot/publish",
			
			// 我的随手拍
			"10033" : "/pages/snapshot/my-snapshot"
		};
		
		return (pageId && pageId in configMap) ? configMap[pageId] + pageParams : "";
	},
	
	/**
	 * 跳转URL
	 * @param {Object} linkType
	 * @param {Object} url
	 * @param {Object} needLogin	1需要登录  	0不需要登录
	 */
	redirectUrl : function(linkType, url, needLogin){
		var pageUrl;
		
		if(!url){
			wx.showToast({
			  title: 'URL为空',
			  icon: 'none',
			  duration: 2000
			})			
			return;
		}
		
		switch(linkType){
			
			// 跳转服务
			case 3:
				if(url.indexOf("pageId=") <= -1){
					(needLogin != 1) && (pageUrl = "/pages/common/web-view?url=" + encodeURIComponent(url));
					(needLogin == 1) && (pageUrl = this.getThirdUrl(url));
				}else{
					pageUrl = this.getInnerLinkUrl(url.split("pageId=")[1]);
				}
					
				break;
			// 跳转外链
			case 2:
			
				pageUrl = "/pages/common/web-view?url=" + encodeURIComponent(url)
				break;
				
			// 跳转资讯
			case 4:
				pageUrl = this.getInnerLinkUrl(url.split("pageId=")[1]);
		}
		
		if(pageUrl){
			wx.navigateTo({
				url: pageUrl
			})
		}
		
	}
};
