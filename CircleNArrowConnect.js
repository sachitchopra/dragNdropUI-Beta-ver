var canvasScreen = document.createElementNS('http://www.w3.org/2000/svg','svg');
var screen = document.createElement('div');
var defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
document.body.append(screen);
screen.append(canvasScreen);
canvasScreen.style.width = '100%';
canvasScreen.style.height = '100%';
canvasScreen.style.zIndex = "0";

var hasBeenOpened = false;

screen.style.width = '100%';
screen.style.height = '100%';

function generateSVGCircle (positionX, positionY) {
	var svgCircle = document.createElementNS('http://www.w3.org/2000/svg','circle');
	svgCircle.setAttributeNS(null, 'cx', positionX);
	svgCircle.setAttributeNS(null, 'cy', positionY);
	svgCircle.setAttributeNS(null, 'r', '20');
	svgCircle.setAttributeNS(null, 'class', 'optionsMenuEnabled');
	svgCircle.setAttributeNS(null, 'style', 'stroke: blue; stroke-width: 1px;' );
	svgCircle.style.zIndex = "0";
	
	svgCircle.options = {
		childNodes: [],
		connectedToParentNodes: [],
		connectedFromParentNodes: [],
		connectedFromParentNodesChildren: [],
	};
	
	interact(svgCircle).draggable({
						inertia: true,
						onstart: function (event) {
							console.log(svgCircle.options);
						},
						onmove: function (event) {
							
							//Adjusts Position of the Circle Depending on movement of mouse
							var x = (parseFloat(svgCircle.getAttribute('data-x')) || 0) + event.dx;
							var y = (parseFloat(svgCircle.getAttribute('data-y')) || 0) + event.dy;
							svgCircle.style.webkitTransform = 'translate(' + x + 'px, ' + y + 'px)';
				
							svgCircle.setAttribute('data-x', x);
							svgCircle.setAttribute('data-y', y);
							
							xCoordinate = event.clientX;
							yCoordinate = event.clientY;
							
							for(var j = 0; j < svgCircle.options.childNodes.length; j++)
							{
								//Addresses Node of Original Element by setting end position of line to drag coordinates 
								svgCircle.options.childNodes[j].setAttribute('x2', event.clientX);
								svgCircle.options.childNodes[j].setAttribute('y2', event.clientY);
							}
								
							//Addresses Node of Connected Element if Present
							if(svgCircle.options.connectedFromParentNodes.length > 0)
							{
								//Gets Location of moving circle within context of canvas Screen
								var parentNodeLoc =  svgCircle.getBoundingClientRect();
								var parentNodeLeft = parentNodeLoc.left - 25;
								var parentNodeTop = parentNodeLoc.top + 15;
								
								for(var l = 0; l < svgCircle.options.connectedFromParentNodes.length; l++)
								{
									//Goes through each circle that is connected with arrow tip touching it
									var accessedParent = svgCircle.options.connectedFromParentNodes[l];
									
									for(var i = 0; i < accessedParent.options.childNodes.length; i++)
									{
										//If the child Node (line) is the same for both the original parent Element (starting circle) and the connected parent element (finishing Circle)
										if(accessedParent.options.childNodes[i] == svgCircle.options.connectedFromParentNodesChildren[l])
										{
											//Adjust the position of the arrow tip from the original parent Element (starting circle)
											accessedParent.options.childNodes[i].setAttribute('x1',parentNodeLeft);
											accessedParent.options.childNodes[i].setAttribute('y1', parentNodeTop);
										}
									}
								}
							}
							
						},
					});
	
	return svgCircle;
}

function generateLine () {
	var line = document.createElementNS('http://www.w3.org/2000/svg','line');
	line.setAttribute('class', 'optionsMenuEnabled');
	var markerEnd = document.createElementNS('http://www.w3.org/2000/svg','marker');
	var arrowheadTop = document.createElementNS('http://www.w3.org/2000/svg','path');
	var pathTop = "M 1,1 L 1,5 L 4,3 L 1,1 Z";
	
	arrowheadTop.setAttributeNS(null,"d", pathTop);
	arrowheadTop.style.stroke = "black";
	arrowheadTop.style.width = "100%";
	arrowheadTop.style.height = "100%";
	arrowheadTop.style.strokeWidth = "2";
	arrowheadTop.style.position = "relative";
	
	markerEnd.setAttribute('id', 'arrowhead');
	markerEnd.setAttribute("markerWidth", 40);
	markerEnd.setAttribute('markerHeight', 40);
	markerEnd.setAttribute('refX', 1);
	markerEnd.setAttribute('refY', 3);
	
	markerEnd.appendChild(arrowheadTop);
	defs.appendChild(markerEnd);
	canvasScreen.appendChild(defs);

	line.style.stroke = "black"; 
	line.style.strokeWidth = "3";
	line.setAttribute('marker-start', 'url(#arrowhead)');
	
	line.connections = {
		originElement: [],
		finishingElement: [],
	};
	
	return line;
}

canvasScreen.append(generateSVGCircle('100','100'));
canvasScreen.append(generateSVGCircle('200','200'));
canvasScreen.append(generateSVGCircle('300','300'));
canvasScreen.append(generateSVGCircle('400','400'));

function generateMenu () {
	
	//Styling for Container
	var container = document.createElement('div');
	container.id = "ContextMenu";
	container.style.width = "120px";
	container.style.height = "72px";
	//container.style.marginLeft = "-20%";
	container.style.display = "none";
	container.style.position = "absolute";
	container.style.boxShadow = "2px 2px 2px 2px grey";
	container.style.zIndex = "1000";
	
	//Create Start Arrow Button
	var startArrowOption = document.createElement('div');
	startArrowOption.onmouseover = function (event) {
		startArrowOption.style.backgroundColor = "grey";
	};
	startArrowOption.onmouseout = function (event) {
		startArrowOption.style.backgroundColor = "white";
	};
	startArrowOption.innerText = 'Create Arrow';
	startArrowOption.id = 'beginArrow';
	startArrowOption.style.width = "120px";
	startArrowOption.style.height = "20px";
	startArrowOption.style.textAlign = "center";
	startArrowOption.style.paddingTop = "4px";
	startArrowOption.style.fontSize = "12px";
	startArrowOption.style.fontFamily = "Helvetica";
	startArrowOption.style.borderBottomStyle = "solid";
	startArrowOption.style.borderBottomWidth = "1px";
	startArrowOption.style.borderBottomColor = "grey";
	startArrowOption.style.zIndex = "1000";
	
	//Create Stop Arrow Button
	var stopArrowOption = document.createElement('div');
	stopArrowOption.innerText = 'Connect Arrow';
	stopArrowOption.onmouseover = function (event) {
		stopArrowOption.style.backgroundColor = "grey";
	};
	stopArrowOption.onmouseout = function (event) {
		stopArrowOption.style.backgroundColor = "white";
	};
	stopArrowOption.id = "generateArrow";
	stopArrowOption.style.width = "120px";
	stopArrowOption.style.height = "20px";
	stopArrowOption.style.textAlign = "center";
	stopArrowOption.style.paddingTop = "4px";
	stopArrowOption.style.fontSize = "12px";
	stopArrowOption.style.fontFamily = "Helvetica";
	stopArrowOption.style.borderBottomStyle = "solid";
	stopArrowOption.style.borderBottomWidth = "1px";
	stopArrowOption.style.borderBottomColor = "grey";
	stopArrowOption.style.zIndex = "1000";
	
	//Create Delete Arrow Button
	var deleteOption = document.createElement('div');
	deleteOption.onmouseover = function (event) {
		deleteOption.style.backgroundColor = "grey";
	};
	deleteOption.onmouseout = function (event) {
		deleteOption.style.backgroundColor = "white";
	};
	deleteOption.id = "deleteArrow";
	deleteOption.innerText = 'Delete Arrow';
	deleteOption.style.textAlign = "center";
	deleteOption.style.paddingTop = "4px";
	deleteOption.style.width = "120px";
	deleteOption.style.height = "20px";
	deleteOption.style.fontSize = "12px";
	deleteOption.style.fontFamily = "Helvetica";
	deleteOption.style.zIndex = "1000";

	
	container.appendChild(startArrowOption);
	container.appendChild(stopArrowOption);
	container.appendChild(deleteOption);
	
	return container;
}


var firstInteraction;
var secondInteraction;
var switches = {
	beginArrowClicked: false,
	generateArrowClicked: false,
};

screen.oncontextmenu = function (event) {
	
	if(event.target.classList[0] == 'optionsMenuEnabled')
	{
		event.preventDefault();
		var contextMenu = generateMenu();
		var svgElementClicked = event.target;
		contextMenu.style.display = "none";
		
		if(hasBeenOpened != true)
		{
			contextMenu.style.display = "block";
			contextMenu.style.left = (event.pageX + parseInt(contextMenu.style.width)) + parseInt(contextMenu.style.width) > ((parseInt(canvasScreen.style.width) / 100) * window.innerWidth) ? ((parseInt(canvasScreen.style.width) / 100) * window.innerWidth) - parseInt(contextMenu.style.width) : event.pageX;
			contextMenu.style.top = event.pageY + parseInt(contextMenu.style.height) > ((parseInt(canvasScreen.style.height) / 100) * window.innerHeight) ? ((parseInt(canvasScreen.style.height) / 100) * window.innerHeight) - parseInt(contextMenu.style.height) : event.pageY;
			console.log(contextMenu.style.left);
			screen.append(contextMenu);
			
			//Addresses if Clicks Happen Prematurely
			if(switches.beginArrowClicked == true)
			{
				var startArrow = contextMenu.childNodes[0];
				startArrow.style.color = "grey";
				startArrow.onclick = function (event) {
					event.stopPropagation();
				};
				startArrow.onmouseout = function (event) {
					event.stopPropagation();
				};
				startArrow.onmouseover = function (event) {
					event.stopPropagation();
				};
			}
			
			if(switches.generateArrowClicked == true)
			{
				var stopArrow = contextMenu.childNodes[1];
				stopArrow.style.color = "grey";
				stopArrow.onclick = function (event) {
					event.stopPropagation();
				};
				stopArrow.onmouseout = function (event) {
					event.stopPropagation();
				};
				stopArrow.onmouseover = function (event) {
					event.stopPropagation();
				};
			}
			
			//Stops Arrow from moving around once context menu is opened
			canvasScreen.onmousemove = function(event) {
				event.stopPropagation();
			};
			
			//Click Events Added When Opened
			contextMenu.addEventListener('click', function (event) {
				canvasScreenCoords = canvasScreen.getBoundingClientRect();
				var xCoordinate = event.pageX;
				var yCoordinate = event.pageY;
				contextMenu.remove();
				
				//If Start Arrow is Selected from Context Menu
				if(event.target.id == "beginArrow")
				{
					switches.beginArrowClicked = true;

					var line = generateLine(); //Creates New Line
					canvasScreen.append(line);
					firstInteraction = svgElementClicked;
				
					firstInteraction.options.childNodes.push(line);
					line.connections.originElement.push(firstInteraction);
					console.log(firstInteraction.options);
					line.setAttribute('x2', xCoordinate);
					line.setAttribute('y2', yCoordinate);
					line.setAttribute('x1', xCoordinate);
					line.setAttribute('y1', yCoordinate);
					
					canvasScreen.onmousemove = function(event) {
						//console.log('moving with screen');
			
						xCoordinate = event.clientX - canvasScreenCoords.left;
						yCoordinate = event.clientY - canvasScreenCoords.top;
	
						//Drag Till Node Found
						line.setAttribute('x1', xCoordinate);
						line.setAttribute('y1', yCoordinate);
					};
					
					switches.generateArrowClicked = false;
						
				}

				//If Finish Arrow is Selected from Context Menu
					if(event.target.id == "generateArrow")
					{
						switches.generateArrowClicked = true;
						
						//Ends Event for Line Movement
						canvasScreen.onmousemove = function (event) {
							event.stopImmediatePropagation();
						};
						
						if(svgElementClicked.nodeName == "circle")
						{
							secondInteraction = svgElementClicked;
							console.log(secondInteraction);
					
							firstInteraction.options.connectedToParentNodes.push(secondInteraction);
							secondInteraction.options.connectedFromParentNodes.push(firstInteraction);
							secondInteraction.options.connectedFromParentNodesChildren.push(firstInteraction.options.childNodes[firstInteraction.options.childNodes.length - 1]);
							firstInteraction.options.childNodes[firstInteraction.options.childNodes.length - 1].connections.finishingElement.push(secondInteraction);
							
							console.log('firstInteraction', firstInteraction.options);
							console.log('secondInteraction', secondInteraction.options);
							
						}
						else
						{
							svgElementClicked.style.display = "none";
							svgElementClicked.remove();
							firstInteraction.options.childNodes.pop();
							alert('Connection Between Nodes Unsuccessful. Try Again.');
						}
						
						switches.beginArrowClicked = false;
					}
				
				//If Delete Arrow is Selected from Context Menu
				if(event.target.id == "deleteArrow")
				{
					//Deletes Arrow if Selected from Context Menu Prematurely
					/* canvasScreen.onmousemove = function (event) {
						event.target.style.display = "none";
					} */
					
					//Directs to SVG Arrow Element Clicked on Screen
					if(svgElementClicked.nodeName == "line")
					{
						
						svgElementClicked.style.display = "none";
						svgElementClicked.remove();
					}
					
					//Removes any data Trace inside original Parent Element through line.connections log
					var originParent = svgElementClicked.connections.originElement[0].options.childNodes;
					
					for(var d = 0; d < originParent.length; d++)
					{
						if(originParent[d] == svgElementClicked)
						{
							svgElementClicked.connections.originElement[0].options.connectedToParentNodes.splice(d,1);
							svgElementClicked.connections.originElement[0].options.childNodes.splice(d,1);
						}
					}
					
					//Removes any data Trace inside connected Parent Element through line.connections log
					var finishedParent = svgElementClicked.connections.finishingElement[0].options.connectedFromParentNodesChildren;
					
					for(var p = 0; p < finishedParent.length; p++)
					{
						if(finishedParent[p] == svgElementClicked)
						{
							svgElementClicked.connections.finishingElement[0].options.connectedFromParentNodes.splice(p,1);
							svgElementClicked.connections.finishingElement[0].options.connectedFromParentNodesChildren.splice(p,1);
						}
					} 
					
				}
				
				hasBeenOpened = false;
			});
		}
		
		hasBeenOpened = true;
	}
};

screen.onclick = function (event) {
	var contextMenu = document.getElementById('ContextMenu');
	if(contextMenu != null)
	{
		contextMenu.remove();
		hasBeenOpened = false;
	}
};