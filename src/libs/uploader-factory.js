import config from '@/config'
const OSS_UPLOADER_URL = config.OSS_UPLOADER_URL;
import underscore from './underscore-extend';
import { getOssParams } from "@/api/oss";

import { chooseImage, uploadFile } from "linewell-api"
/**
 * fast
 */
var FastDfs = function(tempFilePaths, successCallback, failCallback){
	this.serviceUrl = config.serviceBaseUrl.baseUrl + '/zuul/tongplatform/common/third-party-extranet/v1/attachment/upload-pics';
	
	this.successCallback = successCallback;
	
	this.failCallback = failCallback;
	
	this.uploader(tempFilePaths);
};

FastDfs.prototype.uploader = function(tempFilePaths){
	var that = this;
	uploadFile({
  		url: this.serviceUrl,
  		filePath: tempFilePaths[0],
  		name: 'files',
  		success : function(data){
  			if(!data){
  				return;
  			}
  			var res = data = JSON.parse(data.data);
  			
			if(!res.content || res.content.length <= 0){
				return;
			}
			
			that.successCallback && that.successCallback(res.content);
 		},
 		fail : function(){
 			that.failCallback && that.failCallback();
 		}
	});
};

/**
 * oss
 */
var OssUploader = function(tempFilePaths, successCallback, failCallback){
	this.successCallback = successCallback;
	
	this.failCallback = failCallback;
	
	this.uploader(tempFilePaths);
	
};

/**
 * 获取参数
 * @param {Object} tempFilePaths
 */
OssUploader.prototype.getOssParams = function(tempFilePaths, callback){
	var that = this;
	getOssParams(tempFilePaths).then((data) => {
		
		callback && callback(data);
	})
};

/**
 * 
 * @param {Object} tempFilePaths
 */
OssUploader.prototype.uploader = function(tempFilePaths){
	var that = this;
	
	// 目前只支持单张图片
	//for(let i=0, len=){
		this.getOssParams(tempFilePaths[0], function(data){
			
			uploadFile({
		  		url: OSS_UPLOADER_URL,
		  		filePath: tempFilePaths[0],
		  		name: 'file',
		  		formData : data,
		  		success : function(){
		  			
					var res = [{
						fileId : data.key,
						filePath : OSS_UPLOADER_URL + "/" + data.key
					}];
					that.successCallback && that.successCallback(res);
		 		},
		 		fail : function(){
		 			that.failCallback && that.failCallback();
		 		}
			});
		});
	//}
	
};

/**
 * 上传工厂
 */
var Uploader = function(options){
	
	var defaultOptions = {
		count : 1,
		sizeType : ['original', 'compressed'],
		sourceType : ['album', 'camera']
	};
	
	this.options = underscore.deepExtend(true, defaultOptions, options);
	
	this.init();
};

Uploader.prototype.produce = function(tempFilePaths){
	var that = this;
	
	if(OSS_UPLOADER_URL){
		
		new OssUploader(tempFilePaths, that.options.successCallback, function(){
		
			that.options.failCallback && that.options.failCallback();
		
		});
		
		return;
	}
	
	// fastdfs上传
	new FastDfs(tempFilePaths, that.options.successCallback, function(){
		
		that.options.failCallback && that.options.failCallback();
		
	});
};

Uploader.prototype.init = function(){
	var that = this;
	
	chooseImage({
      	count: this.options.count, // 最多可以选择的图片张数，默认9
  		sizeType: this.options.sizeType, // original 原图，compressed 压缩图，默认二者都有
  		sourceType: this.options.sourceType, // album 从相册选图，camera 使用相机，默认二者都有
  		success: function(res){
			const tempFilePaths = res.tempFilePaths
			
			that.produce(tempFilePaths);
  		}
  		
	});
	
};

module.exports = Uploader;