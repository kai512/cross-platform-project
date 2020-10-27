import appAjax from "_libs/app-ajax"
export const login = ({ userName, password }) => {

}

/**
 * 获取用户信息 
 */
export const getUserInfo = () => {
	
	return appAjax.postJson({
        service : "/tongplatform/base/user-sso/v1/user/isLoginWithoutSdToken",
        type : "get",
        showErrorMsg : false, 
    }).then(result => {
        if(result) {
            return Promise.resolve(result);
        }
        return Promise.reject();

    })
}

/**
 * 判断是否微信授权
 */
export const wechatAuthCheck = () => {
	
	return appAjax.postJson({
        service : "/tongplatform/base/user-sso/v1/user-third-info/third-auth-check",
        type : "get",
        showErrorMsg : false, 
    }).then(result => {
        if(result) {
            return Promise.resolve(result);
        }
        return Promise.reject();

    })
}

