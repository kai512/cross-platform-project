var appAjax = require('./app-ajax.js');
var appSession = require("./app-session.js");
var constants = require("../config/constants")
var app = getApp();

var remote = {

	/**
	 * 绑定手机
	 * @param {Object} phone
	 * @param {Object} _callback
	 */
	_bindUserPhone : function(phone, _callback) {
		appAjax.postJson({
			service: "BIND_PHONE",
			data: {
				phone : phone
			},
			success: function(ret) {
				_callback && _callback(ret);
			}
		});
	}
};

var privateMethods = {
	
	/**
	 * 登录
	 * @param {Object} callback
	 */
	_login: function(callback) {
		
		
	    wx.showToast({
	     	title: "登录中",
	      	icon: "loading",
	      	mask: true
	    });

   		wx.login({
   			success : function(data){
   				
   				wx.getUserInfo({
	        		success: function (res) {
	        			
	          			// 登录
	          			appAjax.postJson({
							service: "LOGIN",
							data: {
								authCode: data.code,
		            			encryptedData : res.encryptedData,
		            			iv:res.iv,
		            			thirdLoginType :4
							},
							success: function(result) {
			
								// 缓存用户信息
								appUser.saveLoginInfo(result || {});
								
					            // 回调
					            callback && callback(result.dto || {});
		          		
							}
						});
		       		}, 
		       		fail: function (e) {
		          		wx.hideToast();
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
	        		wx.navigateTo({
	            		url: '../register/bind-phone?page=' + page
	          		})
	        	} else {
		           	wx.navigateTo({
		             	url: page
		           	})
	        	}
	
	        	// 支持回调
	        	callback && callback();
	      	});
	    } else {
	      	wx.navigateTo({
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
		           	wx.navigateTo({
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
	    wx.getSetting({
	      	success: function (res) {
	        	if (res.authSetting['scope.userInfo']) {
	        		
	         	 	// 已经授权，可以直接调用 getUserInfo 获取头像昵称
	          		privateMethods._login(callback);
	        	} else {
		          	app.loginCallback = function() {
		            	privateMethods._login(callback);
		          	};
		          	wx.navigateTo({
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
		wx.showModal({
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
	 * 获取微信地址
	 * @param {Object} callback 回调
	 */
	getWxAddress: function(self, callback) {
		wx.getSetting({
			success(res) {
				var status = res.authSetting['scope.address'];
				if(status == undefined) {
					wx.authorize({
						scope: 'scope.address',
						success() {

							// 用户已经同意小程序使用地址功能，后续调用地址接口不会弹窗询问
							wx.chooseAddress({
								success: function(result) {
									callback && callback(result);
								}
							});
						},
						fail() {
							self.setData({
								wxAddressShow: true
							});
						}
					});
				} 
				else if(status) { // 已获取权限
					wx.chooseAddress({
						success: function(result) {
							callback && callback(result);
						}
					});
				}
			}
		});
	},
	
	/**
	 * 微信登录
	 * @param {Object} callback
	 * @param {Object} failCallback
	 */
	wxLogin : function(callback, failCallback){
		
		appUser.login(function(result){
			if (result && !result.phone) {
        		wx.navigateTo({
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

        wx.setStorageSync(constants.APP_USERINFO_SESSION, data);
	}
};

module.exports = appUser;