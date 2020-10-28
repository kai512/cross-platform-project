import { bindUserPhone, miniLogin } from '@/api/user'
import appSession from "@/libs/app-session"
import config from "@/config"

import * as lw from 'linewell-api'

var app = getApp();

var remote = {

	/**
	 * 绑定手机
	 * @param {Object} phone
	 * @param {Object} _callback
	 */
	_bindUserPhone : function(phone, _callback) {
		
		bindUserPhone(phone).then((ret) => {
			_callback && _callback(ret);
			
		})
	}
};

var privateMethods = {
	
	/**
	 * 登录
	 * @param {Object} callback
	 */
	_login: function(callback) {
		
		
	    lw.showToast({
	     	title: "登录中",
	      	icon: "loading",
	      	mask: true
	    });

   		lw.login({
   			success : function(data){
				
   				lw.getUserInfo({
	        		success: function (res) {
	        			
	          			miniLogin({
	          				authCode: data.code,
	          				encryptedData : res.encryptedData,
	          				iv:res.iv,
	          				thirdLoginType :4
	          			}).then((result) => {
	          				
	          				// 缓存用户信息
	          				appUser.saveLoginInfo(result || {});
	          				
	          				// 回调
	          				callback && callback(result.dto || {});
	          			})
		       		}, 
		       		fail: function (e) {
		          		lw.hideToast();
		        	}
	     		});
   			}
   			
   		})
	}
}

var appUser = {

  /**
   * 需要登录的跳转
   * page为空不能传null 要 ""
   */
  	loginRedirect: function (page, callback) {

    	// 是否有登录
    	if (!appSession.loginCheck()) {
     		appUser.login(function (result) {
	        	if (result && !result.phone) {
	        		lw.navigateTo({
	            		url: '../register/bind-phone?page=' + page
	          		})
	        	} else {
		           	lw.navigateTo({
		             	url: page
		           	})
	        	}
	
	        	// 支持回调
	        	callback && callback();
	      	});
	    } else {
	      	lw.navigateTo({
	        	url: page
	      	})
	    }
	},

  /**
   * 需要登录的操作
   * @param page  操作页 page为空不能传null 要 ""
   * @param callback
   */
  	loginHandle: function (page, callback) {

    	// 是否有登录
    	if (!appSession.loginCheck()) {
      		appUser.login(function (result) {

		        if (result && !result.phone) {
		           	lw.navigateTo({
		             	url: "../register/bind-phone?page=" + page
		           	});
		        } else {
		           callback && callback();
		        }
     	 	});
    	} else {
     		callback && callback();
    	}
  	},
	
	bindPhone : remote._bindUserPhone,

	/**
	 * 登录
	 * @param {Object} successCallback
	 * @param {Object} failCallback
	 */
	login : function(callback, failCallback) {
		var that = this;
    
	    // 查看是否授权
	    lw.getSetting({
	      	success: function (res) {
	        	if (res.authSetting['scope.userInfo']) {
	        		
	         	 	// 已经授权，可以直接调用 getUserInfo 获取头像昵称
	          		privateMethods._login(callback);
	        	} else {
		          	app.loginCallback = function() {
		            	privateMethods._login(callback);
		          	};
		          	lw.navigateTo({
			            url: '/pages/auth/authorized-login'
			        });
		        }
	      	}
	    });
	},
	
	/**
	 * 退出登录
	 */
	logOut : function(callback) {
		var that = this;
		lw.showModal({
			title: '',
			content: '确定要退出您的账号？',
			success: function(res) {
				if(res.confirm) {
					
          			// 清理用户信息
          			appSession.clearUserInfo();
          			callback && callback();
				}
			}
		});
	},

	/**
	 * 获取地址
	 * @param {Object} callback 回调
	 */
	getAddress: function(self, callback) {
		lw.getSetting({
			success(res) {
				var status = res.authSetting['scope.address'];
				if(status == undefined) {
					lw.authorize({
						scope: 'scope.address',
						success() {

							// 用户已经同意小程序使用地址功能，后续调用地址接口不会弹窗询问
							lw.chooseAddress({
								success: function(result) {
									callback && callback(result);
								}
							});
						},
						fail() {
							self.setData({
								addressShow: true
							});
						}
					});
				} 
				else if(status) { // 已获取权限
					lw.chooseAddress({
						success: function(result) {
							callback && callback(result);
						}
					});
				}
			}
		});
	},
	
	/**
	 * 登录
	 * @param {Object} callback
	 * @param {Object} failCallback
	 */
	lwLogin : function(callback, failCallback){
		
		appUser.login(function(result){
			if (result && !result.phone) {
        		lw.navigateTo({
            		url: '../register/bind-phone'
          		})
        		return;
        	}
			
			callback && callback(result || {});
		}, failCallback);
	},
	
	/**
	 * 保存用户信息
	 * @param {Object} result
	 */
	saveLoginInfo : function(result){
		
		var data = result.userBaseDTO || {};
		
		// 用户头像
		if(!data.photoUrl) {
			result.thirdInfoDTO && result.thirdInfoDTO.headimgurl && (data.photoUrl = result.thirdInfoDTO.headimgurl);
		}
		
		result.dto && result.dto.userTokenId && (data.userTokenId = result.dto.userTokenId);
					
        result.thirdUnid && (data.thirdUnid = result.thirdUnid);

       	result.openId && (data.openId = result.openId);

        lw.setStorageSync(config.APP_USERINFO_SESSION, data);
	}
};

module.exports = appUser;