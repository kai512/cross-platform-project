import appAjax from "_libs/app-ajax"
export const login = ({ userName, password }) => {

}

/**
 * 绑定手机
 */
export const bindUserPhone = (phone) => {
	
	return appAjax.postJson({
		service: "BIND_PHONE",
		data: {
			phone : phone
		}
	})
}

/**
 * 小程序登录
 */
export const miniLogin = ({authCode, encryptedData, ...otherParams) => {
	
	return appAjax.postJson({
		service: "LOGIN",
		data: {
			authCode: data.code,
			encryptedData : res.encryptedData,
			...otherParams
		}
	});
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

