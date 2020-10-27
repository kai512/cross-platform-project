import appAjax from "@/libs/app-ajax"

/**
 * 获取oss上传参数
 */
export const getUploadParams = () => {
	
	return appAjax.postJson({
        service: '/tongplatform/common/third-party-extranet/v1/alioss/token-for-pc',
        type: 'GET',
        data: {
            size: 1
        },
        showErrorMsg : false
    })
}