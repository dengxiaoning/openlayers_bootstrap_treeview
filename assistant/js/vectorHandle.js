function VectorHandle(args) {
	this.coordinate = args.coordinate;
	this.featureName = args.featureName;
	this.map = args.map;
	this.eventHandle = args.eventHandle;
	this.popup = args.popup;
}

VectorHandle.prototype = {
	setMap(map) {
		this.map = map;
	},
	setCoordinate(coordinate) {
		this.coordinate = coordinate;
	},
	setFeatureName(featureName) {
		this.featureName = featureName;
	},
	setIdArray(idArray) {
		this.idArray = idArray;
	},
	setLevelArray(levelArray) {
		this.levelArray = levelArray;
	},
	setFeatureImgType(featureImgType){
		this.featureImgType = featureImgType;
	},
	createFeatures() { //构建feature 集合
		let features = [];
		this.coordinate.forEach((obj, index) => {
			features.push(new ol.Feature({
				type: 'icon',
				name: this.featureName[index],
				geometry: new ol.geom.Point(obj)
			}));
			
			features[index].setId(this.idArray[index]);
			features[index].set('level',this.levelArray[index]);
			features[index].set('imgType',this.featureImgType[index]);
			// features.push(new ol.Feature({
			// 	type: 'point',
			// 	name: this.featureName[index],
			// 	geometry: new ol.geom.Point(obj)
			// }))
		});
		return features;
	},
	createFeature() { // 构建单个feature
		let features = [],idNum;
		features.push(new ol.Feature({
			type: 'icon',
			name: this.featureName,
			geometry: new ol.geom.Point(this.coordinate)
		}));
		
		features[0].setId(idNum);
		features[0].set('level',this.levelArray[0]);
		features[0].set('imgType',this.featureImgType[0]);
		State.drawFeatureAll.push({idNum:idNum,type:'icon'});
		return features;
	},
	addFeature(cacheVector){ // 追加单个 feature 到vectore 中
		var source = cacheVector.getSource();
		// var features = source.getFeatures();
		// features.push(new ol.Feature({
		// 	type: 'icon',
		// 	name: this.featureName,
		// 	geometry: new ol.geom.Point(this.coordinate)
		// }));	
		//  cacheVector.setSource(new ol.source.Vector({
		// 	features:features
		// }));
		let fe = new ol.Feature({
			type: 'icon',
			name: this.featureName,
			geometry: new ol.geom.Point(this.coordinate)
		});
		source.addFeature(fe);
	},
	updateFeate(cacheVector){
		var source = cacheVector.getSource();
		var features = source.getFeatures();
		var existfeature = this._getFeatureByCoordinate(features,this.coordinate);
		if(existfeature){ // 存在更新
			existfeature.set('name',this.featureName);
		}else{
			console.log('can not found element in features. ');
		}
	},
	delFeature(cacheVector){
		cacheVector.forEach((item,index) =>{
			var source = item.getSource();
			var features = source.getFeatures();
			var existfeature = this._getFeatureByCoordinate(features,this.coordinate);
			if(existfeature){ // 存在更新
				source.removeFeature(existfeature);
				// cacheVector.splice(1,index);
			}else{
				// console.log('can not found element in features. ');
			}
		})
	
	},
	_getFeatureByCoordinate(features,conditionCoordinate){ // 根据坐标查询feature
		var valBack = null;
		features.forEach((f) => {
			let coordinates = f.getGeometry().A;
			if(conditionCoordinate[0] == coordinates[0] && conditionCoordinate[1] == coordinates[1]){
				valBack = f;
				return false;
			}
		});
		return valBack;
	},
	createVector() {
		// 根据 坐标数组判断是否生成多个feature
		var markers = this.coordinate[0] instanceof Array ? this.createFeatures() : this.createFeature();
		var source = new ol.source.Vector({
			features: markers
		});

		var styleFunction = function(feature) {
			return Conf.setStyleProxy(feature);
      };
		// 创建矢量图层
		var clusters = new ol.layer.Vector({
			source: source,
			style:styleFunction
		});
		this.map.addOverlay(clusters);
		//重置 map 中心点
		//this.map.getView().setCenter(this.coordinate);
		this.coordinate[0] instanceof Array ? this.addListenEventOfOverlay() :'';
		return clusters;
	},
	addListenEventOfOverlay() {
		this.map.addOverlay(this.popup);
		// 绑定地图单击事件
		this.eventHandle.mapSingleClick(this.popup);

	}
}
