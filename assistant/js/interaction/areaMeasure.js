class AreaMeasure extends Measure {
	constructor(map,DataHandle) {
		super(map,DataHandle);
	}
	removeVector() {
		$('div.tooltip.Area').addClass('hidden');
		this.map.removeOverlay(this.vector);
	}
	addVector() {
		$('div.tooltip.Area').removeClass('hidden');
		if (this.vector) this.map.addOverlay(this.vector);
	}
}
