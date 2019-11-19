class Measure extends InteractionHandle {
	constructor(map,DataHandle) {
		super(map,DataHandle);
		this.map = map;
		/**
		 * Message to show when the user is drawing a polygon.
		 * @type {string}
		 */
		this.continuePolygonMsg = 'Click to continue drawing the polygon';

		/**
		 * Message to show when the user is drawing a line.
		 * @type {string}
		 */
		this.continueLineMsg = 'Click to continue drawing the line';
		this.pointermoverFn = evt => {
			if (evt.dragging) {
				return;
			}
			/** @type {string} */
			var helpMsg = 'Click to start drawing';

			if (this.sketch) {
				var geom = (this.sketch.getGeometry());
				if (geom instanceof ol.geom.Polygon) {
					helpMsg = this.continuePolygonMsg;
				} else if (geom instanceof ol.geom.LineString) {
					helpMsg = this.continueLineMsg;
				}
			}
			this.helpTooltipElement.innerHTML = helpMsg;
			this.helpTooltip.setPosition(evt.coordinate);
			this.helpTooltipElement.classList.remove('hidden');
		}

		this.map.getViewport().addEventListener('mouseout', () => {
			if (this.helpTooltipElement) this.helpTooltipElement.classList.add('hidden');
		});
	}

	/**
	 * 重写 新增interaction
	 */
	addInteractions(drawType) {
		let type,diffFlag;
		if(drawType === 'Area'){
			type = 'Polygon';
			diffFlag = 'Area';
		}else{
			type = 'LineString';
			// 定义 flag 区分 area 与 line popover
			diffFlag = 'Length';
		} 
		
		this.map.addEventListener('pointermove', this.pointermoverFn);
		this.draw = new ol.interaction.Draw({
			source: this.source,
			type: type,
			style: new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(255, 255, 255, 0.2)'
				}),
				stroke: new ol.style.Stroke({
					color: 'rgba(0, 0, 0, 0.5)',
					lineDash: [10, 10],
					width: 2
				}),
				image: new ol.style.Circle({
					radius: 5,
					stroke: new ol.style.Stroke({
						color: 'rgba(0, 0, 0, 0.7)'
					}),
					fill: new ol.style.Fill({
						color: 'rgba(255, 255, 255, 0.2)'
					})
				})
			})
		});
		this.map.addInteraction(this.draw);
		State.draw = this.draw;
		this.createMeasureTooltip();
		this.createHelpTooltip();

		var listener;
		var me = this;
		this.draw.on('drawstart', evt => {
			// set sketch
			this.sketch = evt.feature;

			/** @type {ol.Coordinate|undefined} */
			var tooltipCoord = evt.coordinate;

			listener = this.sketch.getGeometry().on('change', evt => {
				var geom = evt.target;
				var output;
				if (geom instanceof ol.geom.Polygon) {
					output = this.formatArea(geom);
					tooltipCoord = geom.getInteriorPoint().getCoordinates();
				} else if (geom instanceof ol.geom.LineString) {
					output = this.formatLength(geom);
					tooltipCoord = geom.getLastCoordinate();
				}
				this.measureTooltipElement.innerHTML = output;
				this.measureTooltip.setPosition(tooltipCoord);
			});
		});
		let idNum;
		this.draw.on('drawend', (e) => {
			let commStyle = new CommonStyle();
			idNum=State.drawFeatureAll.length+1;
			let popFlag = diffFlag+idNum;
			this.measureTooltipElement.className = `tooltip tooltip-static ${diffFlag} ${popFlag}`;
			this.measureTooltip.setOffset([0, -7]);
			// unset sketch
			this.sketch = null;
			// unset tooltip so that a new one can be created
			this.measureTooltipElement = null;
			this.createMeasureTooltip();
			ol.Observable.unByKey(listener);
			e.feature.setId(idNum);
			e.feature.set('type',diffFlag);
			State.drawFeatureAll.push({idNum:popFlag,type:diffFlag,popFlag:popFlag});
			// 绘制不同样式
			if(diffFlag === 'Length')
			e.feature.setStyle(function(e) {
				return commStyle.styleFunctionDefault(diffFlag,this);	
			});	
			
			State.selectedObj = '';
			State.selectedObj =	e.feature;//赋值便于新增操作，不然要二次点击才能获取id	
			this.removeInteractions(); // 清除画笔
		});
	}
	createMeasureTooltip() {
		if (this.measureTooltipElement) {
			this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
		}
		this.measureTooltipElement = document.createElement('div');
		this.measureTooltipElement.className = 'tooltip tooltip-measure';
		this.measureTooltip = new ol.Overlay({
			element: this.measureTooltipElement,
			offset: [0, -15],
			positioning: 'bottom-center'
		});
		this.map.addOverlay(this.measureTooltip);
	}
	createHelpTooltip() {
		if (this.helpTooltipElement) {
			this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
		}
		this.helpTooltipElement = document.createElement('div');
		this.helpTooltipElement.className = 'tooltip hidden';
		this.helpTooltip = new ol.Overlay({
			element: this.helpTooltipElement,
			offset: [15, 0],
			positioning: 'center-left'
		});
		this.map.addOverlay(this.helpTooltip);
	}
	/**
	 * Format length output.
	 * @param {ol.geom.LineString} line The line.
	 * @return {string} The formatted length.
	 */
	formatLength(line) {
		var sourceProj = map.getView().getProjection(); //获取投影坐标系
		var length = ol.Sphere.getLength(line, {
			projection: sourceProj
		});
		var output;
		if (length > 100) {
			output = (Math.round(length / 1000 * 100) / 100) +
				' ' + 'km';
		} else {
			output = (Math.round(length * 100) / 100) +
				' ' + 'm';
		}
		return output;
	}

	/**
	 * Format area output.
	 * @param {ol.geom.Polygon} polygon The polygon.
	 * @return {string} Formatted area.
	 */
	formatArea(polygon) {
		var sourceProj = map.getView().getProjection(); //获取投影坐标系
		var area = ol.Sphere.getArea(polygon, {
			projection: sourceProj
		});
		var output;
		if (area > 10000) {
			output = (Math.round(area / 1000000 * 100) / 100) +
				' ' + 'km<sup>2</sup>';
		} else {
			output = (Math.round(area * 100) / 100) +
				' ' + 'm<sup>2</sup>';
		}
		return output;
	}
	removeInteractions() {
		this.map.removeEventListener('pointermove');
		this.map.removeInteraction(State.draw);
	}
}
