class CommonStyle {
	styleFunctionDefault(type, targetObj) {
		switch (type) {
			case 'Point':
				return this.setPointStyleDef(targetObj);
				break;
			case 'LineString':
				return this.setLineStringStyleDef(targetObj);
				break;
			case 'Polygon':
				return this.setPolygonStyleDef(targetObj);
				break;
			case 'Circle':
				return this.setCircleStyleDef(targetObj);
				break;
			case 'Length':
				return this.setLineStringOfMeasureDef(targetObj);
				break;
			case 'Area':
				return this.setPolygonOfMeasureDef(targetObj);
				break;
			default:
				return this.setDefaultStyle()
		}
	}
	styleFunction(type, targetObj) {
		switch (type) {
			case 'Point':
				return this.setPointStyle(targetObj);
				break;
			case 'LineString':
				return this.setLineStringStyle(targetObj);
				break;
			case 'Polygon':
				return this.setPolygonStyle(targetObj);
				break;
			case 'Circle':
				return this.setCircleStyle(targetObj);
				break;
			case 'Length':
				return this.setLineStringOfMeasure(targetObj);
				break;
			case 'Area':
				return this.setPolygonOfMeasure(targetObj);
				break;
			default:
				return this.setDefaultStyle();
		}
	}	
	setDefaultStyle() {
		return new ol.style.Style({
			fill: new ol.style.Fill({
				color: 'rgba(255, 255, 255, 0.2)'
			}),
			stroke: new ol.style.Stroke({
				color: '#ffcc33',
				width: 2
			}),
			image: new ol.style.Circle({
				radius: 7,
				fill: new ol.style.Fill({
					color: '#ffcc33'
				})
			})
		})
	}
	setPointStyle(targetObj) {
		let styles = [];
		styles.push(
			new ol.style.Style({
				image: new ol.style.Circle({
					radius: 10,
					fill: new ol.style.Fill({
						color: '#ff0000'
					}),
					stroke: new ol.style.Stroke({
						color: '#ff0000',
						width: 2
					})
				})
			})
		);
		styles.push(
			new ol.style.Style({
				geometry: targetObj.getGeometry(),
				image: new ol.style.RegularShape({
					radius1: 10,
					radius2: 5,
					points: 8,
					fill: new ol.style.Fill({
						color: '#00CD66'
					})
				})
			})
		);
		return styles;
	}
	setCircleStyle(targetObj) {
		let styles = [];
		styles.push(new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: '#00CD66',
				width: 2
			}),
			fill: new ol.style.Fill({
				color: 'rgba(255,185,15,0.1)'
			})
		}));

		return styles;
	}
	setPolygonStyle(targetObj) {
		let styles = [];
		styles.push(
			new ol.style.Style({
				fill: new ol.style.Fill({
					color: [255, 255, 255, 0.5]
				})
			}));
		styles.push(new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: [255, 255, 255, 1],
				width: 2
			})
		}));
		styles.push(new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: [0,205,102, 1],
				width: 2
			})
		}));
		return styles;
	}
	setLineStringStyle(targetObj) {
			let styles = [];

			styles.push(
				new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: '#00CD66',
						width: 2
					})
				})
			);
			// let _coords = targetObj.get("geometry").getCoordinates();
			// for (let i = 0; i < _coords.length; i++) {
			// 	styles.push(
			// 		new ol.style.Style({
			// 			geometry: new ol.geom.Point(_coords[i]),
			// 			image: new ol.style.Circle({
			// 				radius: 4,
			// 				fill: new ol.style.Fill({
			// 					color: '#ffff'
			// 				}),
			// 				stroke: new ol.style.Stroke({
			// 					color: '#ff0000',
			// 					width: 2
			// 				})
			// 			})
			// 		})
			// 	);
			// }

			return styles;
	}
	setLineStringOfMeasure(targetObj) {
			let styles = [];
			styles.push(
				new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: '#00CD66',
						width: 2
					})
				})
			);
			
			// let geometry = targetObj.get("geometry");
			//  geometry.forEachSegment(function(start, end) {
			// 	let dx = end[0] - start[0];
			// 	let dy = end[1] - start[1];
			// 	let rotation = Math.atan2(dy, dx);
			// 	// arrows
			// 	styles.push(new ol.style.Style({
			// 		geometry: new ol.geom.Point(end),
			// 		image: new ol.style.Icon({
			// 			src: 'static/imgs/iconLeft.png',
			// 			anchor: [0.5, 0.5],
			// 			size: [10, 10],
			// 			offset: [4, 7],
			// 			rotateWithView: false,
			// 			rotation: -rotation
			// 		})
			// 	}));
			// });
			return styles;
	}
	setPolygonOfMeasure(targetObj) {
		let styles = [];
		styles.push(new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: '#00CD66',
				width: 2
			}),
			fill: new ol.style.Fill({
				color: 'rgba(255,218,185, 0.4)'
			})
		}));

		return styles;
	}
	
	// ----------  default style

	setPointStyleDef(targetObj) {
		let styles = [];
		styles.push(
			new ol.style.Style({
				image: new ol.style.Circle({
					radius: 10,
					fill: new ol.style.Fill({
						color: '#ff0000'
					}),
					stroke: new ol.style.Stroke({
						color: '#ff0000',
						width: 2
					})
				})
			})
		);
		styles.push(
			new ol.style.Style({
				geometry: targetObj.getGeometry(),
				image: new ol.style.RegularShape({
					radius1: 10,
					radius2: 5,
					points: 8,
					fill: new ol.style.Fill({
						color: '#fff'
					})
				})
			})
		);
		return styles;
	}
	setCircleStyleDef(targetObj) {
		let styles = [];
		styles.push(new ol.style.Style({
			stroke: new ol.style.Stroke({
				color:  "#ff0000",
				width: 2
			})
		}));
	
		return styles;
	}
	setPolygonStyleDef(targetObj) {
		let styles = [];

		styles.push(new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: "#ff0000",
				width: 2
			})
		}));
		styles.push(new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: "#ff0000",
				width: 2
			})
		}));
		return styles;
	}
	setLineStringStyleDef(targetObj) {
			let styles = [];
					
			styles.push(
				new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: '#ff0000',
						width: 2
					})
				})
			);
			// let _coords = targetObj.get("geometry").getCoordinates();
			// for (let i = 0; i < _coords.length; i++) {
			// 	styles.push(
			// 		new ol.style.Style({
			// 			geometry: new ol.geom.Point(_coords[i]),
			// 			image: new ol.style.Circle({
			// 				radius: 4,
			// 				fill: new ol.style.Fill({
			// 					color: '#ffff'
			// 				}),
			// 				stroke: new ol.style.Stroke({
			// 					color: '#ff0000',
			// 					width: 2
			// 				})
			// 			})
			// 		})
			// 	);
			// }
				
			return styles;
	}
	setLineStringOfMeasureDef(targetObj) {
			let styles = [];
			styles.push(
				new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: '#ff0000',
						width: 2
					})
				})
			);
		
			// let geometry = targetObj.get("geometry");
			// geometry.forEachSegment(function(start, end) {
			// 	let dx = end[0] - start[0];
			// 	let dy = end[1] - start[1];
			// 	let rotation = Math.atan2(dy, dx);
			// 	// arrows
			// 	styles.push(new ol.style.Style({
			// 		geometry: new ol.geom.Point(end),
			// 		image: new ol.style.Icon({
			// 			src: 'static/imgs/iconLeft.png',
			// 			anchor: [0.5, 0.5],
			// 			size: [10, 10],
			// 			offset: [4, 7],
			// 			rotateWithView: false,
			// 			rotation: -rotation
			// 		})
			// 	}));
			// });
			return styles;		

	}
	setPolygonOfMeasureDef(targetObj) {
		let styles = [];
		styles.push(new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: '#FF6A6A',
				width: 2
			}),
			fill: new ol.style.Fill({
				color: 'rgba(255,218,185, 0.4)'
			})
		}));
	
		return styles;
	}
}
