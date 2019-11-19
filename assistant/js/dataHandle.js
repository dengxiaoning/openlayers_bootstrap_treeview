function DataHandle(map, VectorHandle, cacheVector, eventHandle, popup) {
	this.map = map;
	this.VectorHandle = VectorHandle;
	this.cacheVector = cacheVector;
	this.eventHandle = eventHandle;
	this.popup = popup;
}

DataHandle.prototype = {
	_getData(callback) {
		$.getJSON("assistant/json/testGeo.json", function(data) {
			callback && callback(data);
		});
	},
	createList() {
		var menuUi = document.getElementById('menuUi');
		let idNum;
		this._getData((data) => {
			var coordinateArr = []; //缓存所有 坐标数据
			var featureName = [];
			var idArray = [];
			var levelArray = [];
			data.forEach((obj, index) => {
				idNum = State.drawFeatureAll.length + 1;
				var coordinateChild = [];
				var menuChild = document.createElement('li');
				menuChild.setAttribute('class', 'list-group-item');
				menuChild.setAttribute('data-fId', idNum);
				menuChild.setAttribute('data-fType', 'icon');
				menuChild.innerHTML = obj.name;
				// menuUi.appendChild(menuChild);				
				coordinateChild.push(+obj.lng);
				coordinateChild.push(+obj.lat);
				coordinateArr.push(coordinateChild);
				featureName.push(obj.name);
				idArray.push(idNum);
				levelArray.push(obj.level);
				State.drawFeatureAll.push({
					idNum: idNum,
					type: 'icon'
				});
			});
			this._showVectorAll(coordinateArr, featureName, idArray, levelArray);
		});
	},
	_showVectorAll(coordinateArr, featureName, idArray, levelArray,featureImgType) { //渲染所有 矢量图标
		this.VectorHandle.setCoordinate(coordinateArr);
		this.VectorHandle.setFeatureName(featureName);
		this.VectorHandle.setIdArray(idArray);
		this.VectorHandle.setLevelArray(levelArray);
		this.VectorHandle.setFeatureImgType(featureImgType);
		this.cacheVector.push(this.VectorHandle.createVector());
		State.cacheVector = this.cacheVector;
	},
	create_features(obj) {
		let idNum;
		var coordinateArr = []; //缓存所有 坐标数据
		var featureName = [];
		var featureImgType = [];
		var idArray = [];
		var levelArray = [];
		var temparr = eval('([' + obj.coordinates + '])');

		idNum = State.drawFeatureAll.length + 1;


		coordinateArr.push(temparr);
		featureName.push(obj.text);
		featureImgType.push(obj.type);
		idArray.push(idNum);
		levelArray.push(obj.level);
		State.drawFeatureAll.push({
			idNum: idNum,
			type: 'icon'
		});
		this._showVectorAll(coordinateArr, featureName, idArray, levelArray,featureImgType);
	},
	/*根据interactionHandle中绘制图形结束后获取绘制区域坐标，在地图绘制点*/
	create_features_by_arrobj(arrobj) {
		let idNum;
		var coordinateArr = []; //缓存所有 坐标数据
		var featureName = [];
		var featureImgType = [];
		var idArray = [];
		var levelArray = [];
		arrobj.forEach((obj, index) => {
			idNum = State.drawFeatureAll.length + 1;

			coordinateArr.push(obj.coordinates);
			featureName.push(obj.text);
			featureImgType.push(obj.type);
			idArray.push(idNum);
			levelArray.push(obj.level);
			State.drawFeatureAll.push({
				idNum: idNum,
				type: 'icon'
			});
		});
		this._showVectorAll(coordinateArr, featureName, idArray, levelArray,featureImgType);


	},

	/**
	 * 
	 * 删除 feature
	 * coordinateArr 坐标数组
	 */
	delete_fature(coordinateArr) {
		this.VectorHandle.setCoordinate(coordinateArr);
		this.VectorHandle.delFeature(this.cacheVector);
	}
}
