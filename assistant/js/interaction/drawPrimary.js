/**点、面、线、圆 操作
 * 1、使用extends parent class
 * 2、页面渲染时 初始化 Point 、 LineString、Circle、Polygon 实例
 * 3、在select onchange 事件中根据不同值调用不同的实例对象 （调用前先清除所有draw），
 * 调用addInteractions（typeSelect） 传入typeSelect 作为 type 类型值
 * 4、将draw 、snap 同步保存于State 类中；popover进行控制，新增数据到左边列表
 */
window.onload = function() {
	let pointObj = new Point(map,DataHandle);
	let polygonObj = new Polygon(map,DataHandle);
	let lineStringObj = new LineString(map,DataHandle);
	let circleObj = new Circle(map,DataHandle);
	let lengthMeasureObj = new LengthMeasure(map,DataHandle);
	let areaMeasureObj = new AreaMeasure(map,DataHandle);
	let iconVectorObj = State.cacheVector;
	let commStyle = new CommonStyle();
	const typeMap = new Map([
		['Point', pointObj],
		['LineString', lineStringObj],
		['Polygon', polygonObj],
		['Circle', circleObj],
		['Length', lengthMeasureObj],
		['Area', areaMeasureObj],
		['icon', iconVectorObj]
	]);

	var currentCtrlObj;

	let removeInteraction = () => {
		currentCtrlObj && currentCtrlObj.removeInteractions();
	}
	// 清除地图上所以标绘
	var removeFeatureAll = () => {
		typeMap.forEach(function(val, key, resmap) {
			let drawObj = resmap.get(key);
			if (drawObj) {
				drawObj.removeFeatureAllBySelf(); // 清除 feature
				drawObj.removeInteractions(); // 清除画笔
			}
		})
		let chArr = document.body.getElementsByClassName("tooltip-static");
		for(i=0;i<chArr.length;i++){
		     //删除元素 元素.parentNode.removeChild(元素);
		    if (chArr[i] != null) 
		          chArr[i].parentNode.removeChild(chArr[i]); 
		}
		
		removeFeatureOnTile();
		//重置 cacheVector
		// cacheVector = [];
		// 重置
		// State.drawFeatureAll = [];
	}

	// 清除 瓦片图层 上的点
	var removeFeatureOnTile = () => {
			
		cacheVector.forEach((item,index) =>{
			var source = item.getSource();
			source.clear();
		});
		// cacheVector = [];
		// 不选所有节点
		 $('#tree').treeview('uncheckAll');  
	}

	let addInteractionsForDrapdown = operateType => {
		currentCtrlObj = typeMap.get(operateType);

		currentCtrlObj.addInteractions(operateType);
	}

	// 测面
	$(".measure_area_oper").click(function() {
		removeFeatureAll();
		addInteractionsForDrapdown('Area');
		$(this).parent().hide();
	});
	// 测距
	$(".measure_length_oper").click(function() {
		removeFeatureAll();
		addInteractionsForDrapdown('Length');
		$(this).parent().hide();
	});
	//框选
	$(".frame_select").click(function() {
		removeFeatureAll();
		addInteractionsForDrapdown('Circle');
		$(this).parent().hide();
	});
	//径选
	$(".path_select").click(function() {
		removeFeatureAll();
		addInteractionsForDrapdown('Polygon');
		$(this).parent().hide();
	});
	
	// 移除选择的矢量图标
	var mvFeature = (e) => {
		let idNum, type, ctrlObj, source;
		// 直接从行列选择图标，无法使用interaction 的点击事件中的全局对象
		if (State.selectedObj) {
			idNum = State.selectedObj.getId();
			type = State.selectedObj.get('type');
		} else {
			type = $(e.currentTarget).siblings('span.type').text();
			idNum = $(e.currentTarget).siblings('span.idNum').text();
		}

		if (idNum && type) {
			// 获取对应的矢量图层
			ctrlObj = typeMap.get(type);
			// icon 类型直接获取 source
			source = type === 'icon' ? ctrlObj.getSource() : ctrlObj.getVector().getSource();
			let feature = source.getFeatureById(idNum);
			source.removeFeature(feature);
			$(`div.${type+idNum}`).remove();
			if (type === 'icon') {
				DataHandle.delElement(feature);
			}
		} else {
			alert('未能获取信息，请重新选择！')
		}
	}


	// 新增矢量图标(此处就不涉及检测重复矢量图标，因这里是取地图已存在图标)
	var addDataToLeftMenu = e => {
		let idNum, type, ctrlObj, source, fName;
		fName = $(e.currentTarget).siblings('textarea').val();
		// 直接从行列选择图标，无法使用interaction 的点击事件中的全局对象
		if (State.selectedObj) {
			idNum = State.selectedObj.getId();
			type = State.selectedObj.get('type');
		} else {
			type = $(e.currentTarget).siblings('span.type').text();
			idNum = $(e.currentTarget).siblings('span.idNum').text();
		}

		if (idNum && type) {
			// 获取对应的矢量图层
			ctrlObj = typeMap.get(type);
			// icon 类型直接获取 source
			source = type === 'icon' ? ctrlObj.getSource() : ctrlObj.getVector().getSource();
			let feature = source.getFeatureById(idNum);
			// 设置 feature 名字
			feature.set('name', fName);
			// 对应新增到列表数据
			DataHandle.addMenuList(feature);
		} else {
			alert('未能获取信息，请重新选择！')
		}
	}
	// 为 popover 的删除 button 绑定事件, 关闭popover
	$('body').on('click', 'div.popover span.pop-del', (e) => {

		var element = popup.getElement();
		$(element).popover('destroy');
		State.redraw = true;
		if (State.draw) State.draw.setActive(true);
	});

	// 为 popover 的取消 button 绑定事件, 关闭popover
	$('body').on('click', 'div.popover button.cancelBtn', (e) => {
		mvFeature(e);
		var element = popup.getElement();
		$(element).popover('destroy');
		State.redraw = true;
		if (State.draw) State.draw.setActive(true);
	});

	// 为 popover 的删除按钮 绑定事件
	$('body').on('click', 'div.popover button.delBtn', (e) => {
		mvFeature(e);
		$('#collapseListGroup1').addClass('in');
		var element = popup.getElement();
		$(element).popover('destroy');
		State.redraw = true;
	});

	// 为 popover 的确定 button 绑定事件, 实现坐标数据新增
	$('body').on('click', 'div.popover button.confirmBtn', e => {
		// 获取input 值
		var addrName = $(e.currentTarget).siblings('textarea').val();
		if (!addrName) {
			alert('请输入地址名称');
			return false;
		}
		addDataToLeftMenu(e);

		var element = popup.getElement();
		$(element).popover('destroy');
		State.redraw = true;
		if (State.draw) State.draw.setActive(true);
	});
	
	// 定位 
	$('body').on('click', 'table.detail_table tr>td>button', e => {
		var coordinates_get = e.target.dataset.coordinates;
		
		coordinates_get = eval("(["+coordinates_get+"])");
		let feature_get = inquiryFeature(coordinates_get);
		if (feature_get) {
			//重置 map 中心点
			map.getView().setZoom(8);
			map.getView().setCenter(coordinates_get);
			setTimeout(() => {
				// 提示框 控制 
				eventHandle.makePopupAndShow(feature_get, popup);
			}, 200);
		}
	});

	function inquiryFeature(coordinate){
		let features_res=null;
		cacheVector.forEach((item,index) =>{
			let source = item.getSource();
			 let features = source.getFeatures();
			let existfeature = _getFeatureByCoordinate(features,coordinate);
			if(existfeature){ // 存在更新
				features_res = existfeature;
			}
		})
		return features_res;
	}
	
    function _getFeatureByCoordinate(features,conditionCoordinate){ // 根据坐标查询feature
		var valBack = null;
		features.forEach((f) => {
			let coordinates = f.getGeometry().A;
			if(conditionCoordinate[0] == coordinates[0] && conditionCoordinate[1] == coordinates[1]){
				valBack = f;
				return false;
			}
		});
		return valBack;
	}



	//下拉菜单按钮事件
	$(".measure-title").click(function() {
		// 隐藏其他下拉
		let selectChildren = $(".select-title").children().eq(1);
		if (selectChildren.attr("class").toString().indexOf("down") > -1) {
			selectChildren.attr("class", selectChildren.attr("class").toString().replace("down", "up"));
		}
		if ($(".select-content").css("display") !== "none") {
			$(".select-content").css({
				"display": "none"
			});
		}
		// 设置自身 左右箭头
		var classlist = $(this).children().eq(1).attr("class");
		if (classlist.toString().indexOf("up") > -1) {
			$(this).children().eq(1).attr("class", classlist.toString().replace("up", "down"));
		} else {
			$(this).children().eq(1).attr("class", classlist.toString().replace("down", "up"));
		}
		// 显示下拉列表
		if ($(".measure-content").css("display") !== "none") {
			$(".measure-content").css({
				"display": "none"
			});
		} else {
			$(".measure-content").css({
				"display": "block"
			});
		}
	})
	//下拉菜单按钮事件
	$(".select-title").click(function() {
		// 隐藏其他下拉
		let measureChildren = $(".measure-title").children().eq(1);
		if (measureChildren.attr("class").toString().indexOf("down") > -1) {
			measureChildren.attr("class", measureChildren.attr("class").toString().replace("down", "up"));
		}
		if ($(".measure-content").css("display") !== "none") {
			$(".measure-content").css({
				"display": "none"
			});
		}
		// 设置自身 左右箭头
		var classlist = $(this).children().eq(1).attr("class");
		if (classlist.toString().indexOf("up") > -1) {
			$(this).children().eq(1).attr("class", classlist.toString().replace("up", "down"));
		} else {
			$(this).children().eq(1).attr("class", classlist.toString().replace("down", "up"));
		}
		// 显示下拉列表
		if ($(".select-content").css("display") !== "none") {
			$(".select-content").css({
				"display": "none"
			});
		} else {
			$(".select-content").css({
				"display": "block"
			});
		}
	})
	
	// table 操作
	$("#table_field_close").click(function(){
		$(".table-field").hide();
		$(".btn_oper_table").show();
	})

	$(".btn_oper_table").click(function(){
		// 显示table 列表
		$(".table-field").show();
		$(".btn_oper_table").hide();
	})
	
	/////////////////////////////////////////////树形菜单手动级联/////////////////////////////////////////////\\\\
		//选中全部父节点
		function checkAllParent(node,nodeIds,chekableItems){
		    let parentNode = $('#tree').treeview('getParent',node.nodeId);
		    if(!("nodeId" in parentNode)){
		        return nodeIds;
		    }else {
		        nodeIds.push(parentNode.nodeId);
				chekableItems.push(parentNode);
		        checkAllParent(parentNode,nodeIds,chekableItems);
		    }
		}
		//取消全部父节点
		function uncheckAllParent(node,nodeIds,uncheckItems){
		    let siblings = $('#tree').treeview('getSiblings', node.nodeId);
		    let parentNode = $('#tree').treeview('getParent',node.nodeId);
		    if(!("nodeId" in parentNode)) {
		        return nodeIds;
		    }
		
		    let isAllUnchecked = true;  //是否全部没选中
		    for(let i in siblings){
		        if(siblings[i].state.checked){
		            isAllUnchecked=false;
		            break;
		        }
		    }
		    if(isAllUnchecked){
		        nodeIds.push(parentNode.nodeId);
				uncheckItems.push(parentNode);
		    }
		    uncheckAllParent(parentNode,nodeIds,uncheckItems);
		}

		//级联选中所有子节点
		function getAllSons(node,nodeIds,chekableItems){
		    nodeIds.push(node.nodeId);
			chekableItems.push(node);
		    if(node.nodes!=null&&node.nodes.length>0){
		        for(let i in node.nodes){
		            getAllSons(node.nodes[i],nodeIds,chekableItems);
		        }
		    }
		}
		
		// 树节点操作事件
		$("#tree").on("nodeChecked", function(event, node) {

			// 定义数组记录所有待选中节点nodeID
			let chekableNodeIds=[];
			let chekableItems = [];
			checkAllParent(node,chekableNodeIds,chekableItems);
			getAllSons(node,chekableNodeIds,chekableItems);
			$('#tree').treeview('checkNode',[chekableNodeIds,{silent:true}]);
			// 操作地图
			chekableItems.forEach(item=>{
				let coordinate = item.coordinates;
				if (coordinate) {
					DataHandle.create_features(item)
				}
			})
		});
		// 树节点操作事件
		$("#tree").on("nodeUnchecked ", function(event, node) {
						
			// 定义数组记录所有待取消节点nodeID
			let chekableNodeIds=[];
			let uncheckItems = [];
			uncheckAllParent(node,chekableNodeIds,uncheckItems);
			getAllSons(node,chekableNodeIds,uncheckItems);
			$('#tree').treeview('uncheckNode',[chekableNodeIds,{silent:true}]);
			// 操作地图
			uncheckItems.forEach(item=>{
				let coordinate = item.coordinates;
				if (coordinate) {
					let coorArr = eval('([' + coordinate + '])');
					DataHandle.delete_fature(coorArr);
				}
			})		
		});
	//////////////////////////////////////////////////////////////////////////////////////////\\\\
}
