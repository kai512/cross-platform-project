/**
 * jssdk
 * @since 2017/9/26
 */
(function(factory) {
	'use strict'

	if(typeof define === 'function' && define.amd) {
		define(factory)
	} else if(typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = factory()
	} else if(typeof Package !== 'undefined') {
		cst = factory() // export for Meteor.js
	} else {
		/* jshint sub:true */
		window['cst'] = factory()
	}
})(function() {
	var deviceType
	var MAX_SIZE = '2097152'

	var privateMethods = {

		/**
		 * 判断设备类型
		 */
		getDeviceType: function() {
			var deviceType = 'H5'
			if(typeof(innoPlus) !== 'undefined') {
				deviceType = 'IOS'
			} else if(typeof(android) !== 'undefined') {
				deviceType = 'ANDROID'
			}
			return deviceType
		},

		addParams: function(path, paramsObj) {
			var params = ''

			if(!paramsObj) {
				return
			}

			for(index in paramsObj) {
				if(!paramsObj[index]) {
					continue
				}
				if(!params) {
					params += index + '=' + paramsObj[index]
				} else {
					params += '&' + index + '=' + paramsObj[index]
				}
			}

			if(path.indexOf('?') > -1) {
				path = path + '&' + params
			} else {
				path = path + '?' + params
			}

			return path
		},

		/**
		 * 按钮分享
		 */
		shareHandle: function(shareInfo) {
			if(deviceType == 'IOS') {
				innoPlus.native.showSharePopView(JSON.stringify(shareInfo))
			} else if(deviceType == 'ANDROID') {
				android.share(JSON.stringify(shareInfo))
			}
		},

		/**
		 * 获取APP名称（主要用来判断市民云）
		 */
		getAppName: function() {
			var appName = ''
			if(deviceType == 'ANDROID') {
				appName = android.getAppName()
			} else if(deviceType == 'IOS') {
				appName = innoPlus.device.appname
			}
			return appName.toLocaleLowerCase()
		},

		/**
		 * 打开app页面
		 */
		openAppPage: function(pageId, params) {
			var path = privateMethods.addParams(pageId, params) || pageId

			if(deviceType == 'ANDROID') {
				android.openActivityByRoute(path)
			} else if(deviceType == 'IOS') {
				innoPlus.native.openWindow(path)
			}
		},

		/**
		 * 打开登陆页
		 */
		openLogin: function(url) {
			if(deviceType == 'ANDROID') {
				android.openLogin(url || '')
			} else if(deviceType == 'IOS') {
				innoPlus.native.openLoginPage(true)
			}
		},

		/**
		 * 打开登录带回调
		 */
		openLoginWithCallback: function(callback) {
			window.openLoginWithCallback = function(data) {
				callback && callback()
			}

			if(deviceType == 'ANDROID') {
				android.openLoginWithCallback('openLoginWithCallback')
			} else if(deviceType == 'IOS') {
				innoPlus.native.openLoginPage('false', callback)
			}
		},

		/**
		 * 获取app用户标识
		 */
		getUserId: function() {
			if(deviceType == 'IOS') {
				return innoPlus.session.userId
			} else if(deviceType == 'ANDROID') {
				return android.getUserId()
			}
		},

		/**
		 * 回退
		 */
		back: function() {
			if(deviceType == 'IOS') {
				innoPlus.native.back()
			} else if(deviceType == 'ANDROID') {
				android.back()
			} else {

			}
		},

		/**
		 * 关闭webview
		 */
		close: function() {
			if(deviceType == 'IOS') {
				innoPlus.native.close()
			} else if(deviceType == 'ANDROID') {
				android.close()
			}
		},

		/**
		 * 隐藏头部
		 */
		hideHeader: function() {
			if(deviceType == 'IOS') {
				innoPlus.native.hideNavbar()
			} else if(deviceType == 'ANDROID') {
				android.hideHeader()
			}
		},

		/**
		 * 获取token
		 */
		getToken: function() {
			if(deviceType == 'IOS') {
				return innoPlus.session.token
			} else if(deviceType == 'ANDROID') {
				return android.getToken()
			}
		},

		/**
		 * 获取osType
		 */
		getOsType: function() {
			var osType = ''
			if(deviceType == 'ANDROID') {
				osType = 'Android'
			} else if(deviceType == 'IOS') {
				osType = 'iOS'
			}
			return osType
		},

		/**
		 * 获取token
		 */
		getDeviceId: function() {
			if(deviceType == 'IOS') {
				return innoPlus.device.uuid
			} else if(deviceType == 'ANDROID') {
				return android.getDeviceId()
			}
		},

		/**
		 * 隐藏分享
		 */
		hideShare: function() {
			if(deviceType == 'IOS') {
				innoPlus.native.hideShareBtn()
			} else if(deviceType == 'ANDROID') {
				android.hideShare()
			}
		},

		/**
		 * 设置头部标题
		 */
		setTitle: function(title) {
			if(deviceType == 'IOS') {
				innoPlus.native.setTitle(title)
			} else if(deviceType == 'ANDROID') {
				android.setTitle(title)
			}
		},

		/**
		 * 获取APP地址
		 */
		getAddress: function(callback) {
			window.getAddr = function(data) {
				typeof data === 'string' ? callback(JSON.parse(data)) : callback(data)
			}

			if(deviceType == 'IOS') {
				innoPlus.native.selectAddress(callback)
			} else if(deviceType == 'ANDROID') {
				android.selectAddress('getAddr')
			}
		},

		/**
		 * 选择材料
		 */
		selectMaterial: function(callback) {
			window.selectMaterial = function(data) {
				typeof data === 'string' ? callback(JSON.parse(data)) : callback(data)
			}

			if(deviceType == 'IOS') {
				innoPlus.native.selectMaterial(callback, MAX_SIZE)
			} else if(deviceType == 'ANDROID') {
				android.selectMaterial('selectMaterial', MAX_SIZE)
			}
		},

		/**
		 * 生成材料
		 */
		generateMaterial: function(callback) {
			window.generateMaterial = function(data) {
				typeof data === 'string' ? callback(JSON.parse(data)) : callback(data)
			}

			if(deviceType == 'IOS') {
				innoPlus.native.generateMaterial(callback, MAX_SIZE)
			} else if(deviceType == 'ANDROID') {
				android.generateMaterial('generateMaterial', MAX_SIZE)
			}
		},

		/**
		 * 生成材料（自定义材料名）
		 */
		createMaterial: function(callback) {
			window.createMaterial = function(data) {
				typeof data === 'string' ? callback(JSON.parse(data)) : callback(data)
			}

			if(deviceType == 'IOS') {
				innoPlus.native.createMaterial(callback, MAX_SIZE)
			} else if(deviceType == 'ANDROID') {
				android.createMaterial('createMaterial', MAX_SIZE)
			}
		},

		/**
		 * 复制
		 */
		copyToClipboard: function(str, callback) {
			if(deviceType == 'IOS') {
				innoPlus.native.paste(str)
				callback && callback()
			} else if(deviceType == 'ANDROID') {
				android.copyToClipboard(str)
				callback && callback()
			}
		},

		/**
		 * 拨打电话
		 */
		openDial: function(phoneNumber) {
			if(deviceType == 'IOS') {
				try {
					innoPlus.native.openThirdUrl(function(result) {
						console.log(result)
					}, 'tel:' + phoneNumber)
				} catch(e) {
					// TODO handle the exception
				}
			} else if(deviceType == 'ANDROID') {
				android.openDial(phoneNumber)
			}
		},

		/**
		 * 预览pdf文件
		 */
		previewPDF: function(fileName, fileUrl) {
			if(deviceType == 'IOS') {
				var params = {
					fileName: fileName,
					fileUrl: fileUrl
				}
				innoPlus.native.previewPDF(JSON.stringify(params))
			} else if(deviceType == 'ANDROID') {
				android.openPDF(fileName, fileUrl)
			}
		},

		/**
		 * 选择代理企业列表
		 */
		selectAgentEnterprise: function(callback) {
			window.selectAgentEnterprise = function(data) {
				typeof data === 'string' ? callback(JSON.parse(data)) : callback(data)
			}

			if(deviceType == 'IOS') {
				innoPlus.native.selectAgentEnterprise(function(data) {
					callback && callback(data)
				})
			} else if(deviceType == 'ANDROID') {
				android.selectAgentEnterprise('selectAgentEnterprise')
			}
		},

		/**
		 * 调用APP人脸认证页面
		 */
		appFaceAuth: function(callback) {
			if(deviceType == 'IOS') {
				innoPlus.native.faceAuth(function(data) {
					callback && callback(data)
				})
			} else if(deviceType == 'ANDROID') {
				window.appFaceAuth = function(data) {
					typeof data === 'string' ? callback(JSON.parse(data)) : callback(data)
				}
				android.faceAuth('appFaceAuth')
			}
		},

		/**
		 * 调用app个人认证
		 */
		appPersonalInfo: function(callback) {
			if(deviceType == 'IOS') {
				innoPlus.native.personalInfo(function(data) {
					callback && callback(data)
				})
			} else if(deviceType == 'ANDROID') {
				window.appPersonalInfo = function(data) {
					typeof data === 'string' ? callback(JSON.parse(data)) : callback(data)
				}
				android.personalInfo('appPersonalInfo')
			}
		},

		/**
		 * 调用APP完善企业信息
		 */
		appEnterpriseInfo: function(callback) {
			if(deviceType == 'IOS') {
				innoPlus.native.enterpriseInfo(function(data) {
					callback && callback(data)
				})
			} else if(deviceType == 'ANDROID') {
				window.appEnterpriseInfo = function(data) {
					typeof data === 'string' ? callback(JSON.parse(data)) : callback(data)
				}
				android.enterpriseInfo('appEnterpriseInfo')
			}
		},

		/**
		 * 获取APP基础参数
		 */
		getBaseParams: function() {
			if(deviceType == 'IOS') {
				return innoPlus.baseParam
			} else if(deviceType == 'ANDROID') {
				try {
					var androidObj = android.getBaseParams()
					if(typeof(androidObj) === 'string') {
						androidObj = JSON.parse(androidObj)
					}
					return androidObj
				} catch(e) {
					return undefined
				}
			}
		},

		/**
		 * 导航
		 * @param {Object} obj
		 */
		navigation: function(obj) {
			if(deviceType == 'IOS') {
				innoPlus.map.nav(JSON.stringify(obj))
			} else if(deviceType == 'ANDROID') {
				android.navigation(JSON.stringify(obj))
			}
		},

		/**
		 * 定位获取地理位置信息
		 */
		appGetLocationInfo: function(callback) {
			if(deviceType == 'IOS') {
				innoPlus.native.getLocationInfo(function(data) {
					callback && callback(data)
				})
			} else if(deviceType == 'ANDROID') {
				window.appGetLocationInfo = function(data) {
					typeof data === 'string' ? callback(JSON.parse(data)) : callback(data)
				}

				try {
					android.getLocationInfo('appGetLocationInfo')
					return true
				} catch(e) {
					return false
				}
			}
		},

		/**
		 * 定位获取地理位置经纬度
		 */
		getLocationCoordinate: function(callback) {
			if(deviceType == 'IOS') {
				innoPlus.native.getLocationCoordinate(function(data) {
					callback && callback(data)
				})
			} else if(deviceType == 'ANDROID') {
				window.appGetLocationCoordinate = function(data) {
					typeof data === 'string' ? callback(JSON.parse(data)) : callback(data)
				}

				try {
					android.getLocationCoordinate('appGetLocationCoordinate')
					return true
				} catch(e) {
					return false
				}
			}
		},

		/**
		 * 调用APP企业认证
		 */
		appEnterpeiseAuth: function(callback) {
			if(deviceType == 'IOS') {
				innoPlus.native.enterpeiseAuth(function(data) {
					callback && callback(data)
				})
			} else if(deviceType == 'ANDROID') {
				window.appEnterpriseAuth = function(data) {
					typeof data === 'string' ? callback(JSON.parse(data)) : callback(data)
				}
				android.enterpeiseAuth('appEnterpriseAuth')
			}
		}

	}

	// window.onload = function(){
	deviceType = privateMethods.getDeviceType()
	// }

	return {

		/**
		 * 打开app页面
		 */
		openAppPage: privateMethods.openAppPage,

		/**
		 * 获取设备类型
		 */
		getDeviceType: privateMethods.getDeviceType,

		/**
		 * 回退
		 */
		back: privateMethods.back,

		/**
		 * 关闭
		 */
		close: privateMethods.close,

		/**
		 * 隐藏头部
		 */
		hideHeader: privateMethods.hideHeader,

		/**
		 * 获取app用户表示
		 */
		getUserId: privateMethods.getUserId,

		/**
		 * 获取getToken
		 */
		getToken: privateMethods.getToken,

		/**
		 * 获取osType
		 */
		getOsType: privateMethods.getOsType,

		/**
		 * 获取app设备标识
		 */
		getDeviceId: privateMethods.getDeviceId,

		/**
		 * 设置app头部
		 */
		setTitle: privateMethods.setTitle,

		/**
		 * 隐藏app分享按钮
		 */
		hideShare: privateMethods.hideShare,

		/**
		 * 打开登录页
		 */
		openLogin: privateMethods.openLogin,

		/**
		 * 打开登录页带回调
		 */
		openLoginWithCallback: privateMethods.openLoginWithCallback,

		/**
		 * 获取浏览器所属系统
		 */
		getBrowerType: privateMethods.getBrowerType,

		/**
		 * 获取联系地址
		 */
		getAddress: privateMethods.getAddress,

		/**
		 * 选择材料
		 */
		selectMaterial: privateMethods.selectMaterial,

		/**
		 * 生成材料
		 */
		generateMaterial: privateMethods.generateMaterial,

		/**
		 * 生成材料（自定义材料名）
		 */
		createMaterial: privateMethods.createMaterial,

		/**
		 * 复制
		 */
		copyToClipboard: privateMethods.copyToClipboard,

		/**
		 * 获取APP基础参数
		 */
		getBaseParams: privateMethods.getBaseParams,

		/**
		 * 拨打电话
		 */
		openDial: privateMethods.openDial,

		/**
		 * 预览pdf文件
		 */
		previewPDF: privateMethods.previewPDF,

		/**
		 * 选择代理企业列表
		 */
		selectAgentEnterprise: privateMethods.selectAgentEnterprise,

		/**
		 * app人脸认证
		 */
		appFaceAuth: privateMethods.appFaceAuth,

		/**
		 * app个人认证
		 */
		appPersonalInfo: privateMethods.appPersonalInfo,

		/**
		 * app完善企业信息
		 */
		appEnterpriseInfo: privateMethods.appEnterpriseInfo,

		/**
		 * 手动分享
		 */
		shareHandle: privateMethods.shareHandle,

		/**
		 * 导航
		 */
		navigation: privateMethods.navigation,

		/**
		 * 定位获取地理位置信息
		 */
		appGetLocationInfo: privateMethods.appGetLocationInfo,

		/**
		 * 定位获取地理位置经纬度
		 */
		getLocationCoordinate: privateMethods.getLocationCoordinate,

		/**
		 * 跳转企业认证
		 */
		appEnterpeiseAuth: privateMethods.appEnterpeiseAuth

	}
})