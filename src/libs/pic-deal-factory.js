/**
 * oss大小，旋转操作
 * @author jliangliang
 * @since 2017/9/26
 */
import config from '@/config'
const OSS_UPLOADER_URL = config.UPLOAD_URL

/**
 * fastdfs实例
 */
var FastDfsInstance = function() {

}

/**
 * fastdfs质量处理
 * @param {Object} url
 * @param {Object} w
 * @param {Object} h
 * @param {Object} quality
 */
FastDfsInstance.prototype.buildResizeUrl = function(url, w, h, quality) {
	// TODO
	return url
}

/**
 * fastdfs多文件质量压缩处理
 * @param {Object} picList
 * @param {Object} w
 * @param {Object} h
 * @param {Object} quality
 */
FastDfsInstance.prototype.getPicList = function(picList, w, h, quality) {
	var imgZipArr = []
	if(!picList || picList.length <= 0) {
		return
	}
	if(typeof(picList) !== 'object') {
		return this.buildResizeUrl(picList, w, h, quality)
	}

	for(var i = 0, len = picList.length; i < len; i++) {
		if(typeof(picList[i]) === 'object') {
			picList[i].imgZip = this.buildResizeUrl(picList[i].filePath, w, h, quality)
		} else {
			picList[i] = {
				imgZip: this.buildResizeUrl(picList[i], w, h, quality),
				filePath: picList[i]
			}
		}
	}

	return picList
}

/**
 * oss实例
 */
var OssInstance = function() {

}

/**
 * oss图片质量处理
 * @param {Object} url
 * @param {Object} w
 * @param {Object} h
 * @param {Object} quality
 */
OssInstance.prototype.buildResizeUrl = function(url, w, h, quality) {
	if(!url || url.indexOf('x-oss-process=image') >= 0 && url.indexOf('/resize,') >= 0) {
		return this.buildAutoOrientUrl(url)
	}

	if(url.indexOf('x-oss-process=image') >= 0) {
		return this.buildAutoOrientUrl(url + '/resize,m_lfit,limit_1,w_' + (w || 4096) + ',h_' + (h || 4096) + '/format,jpg/quality,Q_' + quality)
	} else {
		return this.buildAutoOrientUrl(url + '?x-oss-process=image/resize,m_lfit,limit_1,w_' + (w || 4096) + ',h_' + (h || 4096) + '/format,jpg/quality,Q_' + quality)
	}
}

/**
 * oss旋转处理
 * @param {Object} url
 */
OssInstance.prototype.buildAutoOrientUrl = function(url) {
	if(!url || url.indexOf('x-oss-process=image') >= 0 && url.indexOf('/auto-orient,') >= 0) {
		return url
	}
	if(url.indexOf('x-oss-process=image') >= 0) {
		return url + '/auto-orient,1'
	} else {
		return url + '?x-oss-process=image/auto-orient,1'
	}
}

/**
 * oss多文件质量压缩处理
 * @param {Object} picList
 * @param {Object} w
 * @param {Object} h
 * @param {Object} quality
 */
OssInstance.prototype.getPicList = function(picList, w, h, quality) {
	var imgZipArr = []
	if(!picList || picList.length <= 0) {
		return
	}
	if(typeof(picList) !== 'object') {
		return this.buildResizeUrl(picList, w, h, quality)
	}

	for(var i = 0, len = picList.length; i < len; i++) {
		if(typeof(picList[i]) === 'object') {
			picList[i].imgZip = this.buildResizeUrl(picList[i].filePath, w, h, quality)
		} else {
			picList[i] = {
				imgZip: this.buildResizeUrl(picList[i], w, h, quality),
				filePath: picList[i]
			}
		}
	}

	return picList
}

/**
 * 初始化
 */
var PicFactory = function() {
	if(OSS_UPLOADER_URL) {
		// this.uploaderType = "Oss";
		this.picInstance = new OssInstance()

		return
	}

	this.picInstance = new FastDfsInstance()
}

/**
 * 图片自定义大小
 * @param {Object} url
 * @param {Object} w
 * @param {Object} h
 * @param {Object} quality
 */
PicFactory.prototype.buildResizeUrl = function(url, w, h, quality) {
	try {
		return this.picInstance.buildResizeUrl(url, w, h, quality)
	} catch(e) {
		return url
	}
}

/**
 * 图片自动旋转
 * @param {Object} url
 */
PicFactory.prototype.buildAutoOrientUrl = function(url) {
	try {
		return this.picInstance.buildAutoOrientUrl(url)
	} catch(e) {
		return url
	}
}

/**
 * 多图转换
 * @param {Object} picList
 * @param {Object} w
 * @param {Object} h
 * @param {Object} quality
 */
PicFactory.prototype.getPicList = function(picList, w, h, quality) {
	try {
		return this.picInstance.getPicList(picList, w, h, quality)
	} catch(e) {
		return picList
	}
}

export default PicFactory