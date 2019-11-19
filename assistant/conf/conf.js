class Conf{
	static setStyleProxy(feature){
		let type = feature.get('imgType');
		// 初始化不同类型打印不同图标
		const imgPrintPoint = new Map([["cinema","static/imgs/cinema.png"],["building","static/imgs/building.png"],
		["Attractions","static/imgs/Attractions.png"],["traffic","static/imgs/traffic.png"]])

		return Conf.setStyleByLevel(imgPrintPoint.get(type));
	
	}

	static setStyleByLevel(imgUrl){
			return Conf.getStyle_icon_changeProp({src: imgUrl});
	}
	static changeIconProp(changeObj = {}){ // 根据参数修改原本的icon 配置
		return Object.assign({},Conf.getIcon(),changeObj)
	};
	static getIcon(){ // 基础的icon 配置
		return {
			src: "static/imgs/traffic.png",
			anchor:[10,0.5],
			size: [24, 26],
			offset:[0,0],
			anchorOrigin: 'bottom-left',
			offsetOrigin:'bottom-left',
			anchorXUnits: 'pixels',
			anchorYUnits: 'pixels',
		}
	}
	static getCircle(){
		return {
			radius: 5,
			fill: new ol.style.Fill({
				color: '#ffff00',
			}),
			stroke: new ol.style.Stroke({
				width: 1,
				color: '#00ffff'
			})
		}
	}
	static getStyle_icon(){
		return new ol.style.Style({
			image: new ol.style.Icon(Conf.getIcon()),
			zIndex: 2
		})
	}
	static getStyle_circle(){
		return new ol.style.Style({
			image: new ol.style.Circle(Conf.getCircle()),
			zIndex:1
		})
	}
	static getStyle_icon_changeProp(changeObj = {}){ // 根据参数创建 style
		return new ol.style.Style({
			image: new ol.style.Icon(Conf.changeIconProp(changeObj)),
			zIndex: 2
		})
	}
}