import { setToken, getCstoonUA, addUrlParam} from '@/libs/util'
import { isWechat } from '@/libs/tools'
import cst from "@/libs/h5/cstoon-jssdk.js"
import config from '@/config'
import { wechatAuthType } from '@/config/auth-config'

import { wechatAuthCheck, getUserInfo } from '@/api/user'
console.log(location)
/**
 * 微信授权
 */
export const redirectWechatAuthorize = (service, wechatAuthObj) => {
	var redirectUrl = encodeURIComponent(location.origin + process.env.BASE_URL + (wechatAuthObj.REDIRECT_URL || "wechat/wechatauth") + "?service=" + encodeURIComponent(service));
	var href = "https://open.weixin.qq.com/connect/oauth2/authorize";
	href = addUrlParam(href, "appid", wechatAuthObj.APP_ID);
	href = addUrlParam(href, "redirect_uri", redirectUrl);
	href = addUrlParam(href, "response_type", "code");
	href = addUrlParam(href, "scope", wechatAuthObj.SCOPE || "snsapi_base");
	href = addUrlParam(href, "state", "123");
	href += "#wechat_redirect";
	
	location.href = href;
    return;
}

/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (to, from) => {
	
	let cstoonAppInfo = getCstoonUA();
	let needLogin = to.meta && to.meta.loginCheck;
	
	return new Promise((resolve, reject) => {
		
		// 如果不需要登录
		if(!needLogin || needLogin.length <= 0){
			
			resolve();
		}
		
		// 在城市通内且需要在城市通授权
		if(cstoonAppInfo && needLogin.indexOf("cstoon") > -1){ // 城市通授权
			
			if(!cstoonAppInfo.token){
				cst.openLoginWithCallback(function(){
					
					setToken(escape(cstoonAppInfo.token));
					resolve();
				});
				
				return;
			}
			
			// 设置cookie
			setToken(escape(cstoonAppInfo.token));
			
			resolve();
			
		}else if(isWechat() && needLogin.indexOf("wechat") > -1){ // 微信授权
			wechatAuthCheck().then(() => {
				resolve();
			}).catch(() => {
				redirectWechatAuthorize(to.fullPath, wechatAuthType[to.path.split("\/")[1]]);
				
			})
			resolve();
		}else if(needLogin.indexOf("nlogin") > -1){ // 普通浏览器
			
			getUserInfo().then(() => {
				resolve();
			}).catch(() => {
				reject();
			})
		}else{
			resolve();
		}
		
	})
	
	

}