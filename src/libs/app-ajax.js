/**
 * axios的工具类 -- rest接口
 * @author jliangliang@linewell.com
 * @since 2018-07-03
 */
import underscore from './underscore-extend'
import config from '@/config'
import { request, showLoading, hideLoading, showToast } from "linewell-api";
import { getAppInfo, getToken } from "./util";

/* 基础通信参数  */
var _authClient = function() {
	
	let {areaCode, appId} = getAppInfo();
	
	// #ifdef H5
	let deviceId = 'H5';
	let os = "H5";
	// #endif
	
	// #ifndef H5
	let deviceId = 'miniprogram';
	let os = "mini";
	// #endif
	
	var auth = {
		clientParams: {
			os: os,
			network: '',
			deviceId: deviceId,
			appVersion: ''
		},
		areaCode: areaCode,
		appId: appId,
		miniId: config.MINI_ID
	}

	return auth
}


/**
 * 提交表单数据
 * @param {Object} params
 */
var _postJson = function(params) {
	var authClient = _authClient()

	// 默认参数
	var defaultParams = {
		service: '', // 服务的配置名称
		data: {}, // 发送的data
		params: {},
		autoShowWait: false, // 自动显示菊花
		loadingText: '正在加载', // 加载的提示语
		type : 'POST',
		showErrorMsg : true,
		headers: {
			'base-params': JSON.stringify(authClient),
			'token': unescape(getToken() || '')
			// "token" : "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpblRpbWUiOjE1Njc3NTQ5Nzg5ODIsInBob25lIjoiMTUwNjA2OTA1MjIiLCJpZGVudGl0eVR5cGUiOm51bGwsImFwcElkIjoiZjg0NzEwMzM5ZDdkNGM5ZWJjNTYyMWVhM2I1OGE0ZmEiLCJvc3R5cGUiOiJhbmRyb2lkIiwidXNlclR5cGUiOjEsInVzZXJJZCI6IjIxNWE4OTQ3ZmVjZTQzNDI4YTc3NGZmNGRiZjBiYmJiIiwiZGV2aWNlSWQiOiIwMDAwMDAwMC03ZGVkLTM4MmQtZmZmZi1mZmZmZjg5ZGY4YjYiLCJhY2NvdW50VXNlcklkIjoiMjE1YTg5NDdmZWNlNDM0MjhhNzc0ZmY0ZGJmMGJiYmIiLCJsb2dpblRlcm1pbmFsIjoxfQ.IxWzLW-nsSd7CZzFQof4oqlJfraBujizCBFdJUSl0wuSO8VNCuMUliBx_5LPYCC2KrHt0Dl6oyCNitdqxRmzs4ojFTuaniV4x-zIVjXwgocRJAX6VBbnCh9M_XFWx2TdGyt0phCaf8vV0ZfNmYboqszQoxPmYraB_JMHj_hfp-uOks9MRnEZ_Qn7RFMEvdPJZZ8cOX44QMpN6_bO5rlA43z0GDl27R4NoC-zKbi6Jjd6MBhovLwGbdPHX1VAQgATYs3xLKEzjBvrg2vdvabkrefIELJ6abMvgu1WTPtnQH3GIr38UurIjRs7QfZcHsmYcpsHy55Xa6ZuPaS3ytLSXg"
		}
	}

	var ajaxParams = underscore.deepExtend(defaultParams, params)
	
	// #ifdef H5
	const baseUrl = config.serviceBaseUrl.base
	// #endif
	
	// #ifndef H5
	const baseUrl = config.serviceBaseUrl.baseUrl;
	// #endif
	
	// rest请求路径
	ajaxParams['url'] = baseUrl + params.service

	try {
		
		// 是否展示loading
		ajaxParams.autoShowWait && showLoading({
			title : ajaxParams.loadingText
		});
		
		return new Promise((resolve, reject) => {
			
			// 交互方法
			request({
				url : ajaxParams.url,
				header : ajaxParams.headers,
				method : ajaxParams["type"],
				data : ajaxParams.data,
				success: function( res ) {
					
					if(!res || !res.data){
						return;
					}
					
					var data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
					
					if(data.status == 1){
						
						resolve(data.content, data);
						
					}else{
						var message = data.message ? data.message : "有点忙开个小差，稍后再试~";
						
						if(ajaxParams.showErrorMsg) {
							showToast({
								title: message,
								icon : "none",
								duration: 3000,
								position : "bottom"
							});
						}
							
						return reject(message, data)
					}
				},
				fail(res) {
					var message = res.data && (res.data.message ? res.data.message : "有点忙开个小差，稍后再试~");
					
					if(ajaxParams.showErrorMsg) {
						showToast({
							title: message || "有点忙开个小差，稍后再试~",
							icon : "none",
							duration: 3000,
							position : "bottom"
						});
					}
						
					return reject(message, res)
					
				},
				complete() {
					
					// 关闭loading
					if(ajaxParams.autoShowWait) {
						hideLoading();
					}
				},
			})
			
		})
		
		
	} catch(e) {
		
		// 去除加载状态
		ajaxParams['autoShowWait'] && hideLoading();
	}
}

var exportsMethods = {
	/**
	 * 提交Json对象
	 * @param {Object} params 配置定义的key
	 */
	postJson: function(params) {
		return _postJson(params)
	},

	/**
	 * 获取用户登录信息封装对象
	 */
	getAuthClient: function() {
		return {
			'base-params': JSON.stringify(_authClient()),
			'token': unescape(getToken() || "")
		}
	}
}

export default exportsMethods