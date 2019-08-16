/*-------------------------------------------------------------------------------------------
|Project Title:		DragNDropUI
|Author:			Sachit Chopra
|Description:		An Interactable Interface of Items Provided
|Version:			0.1.0 //Last Update: August 13, 2019
-------------------------------------------------------------------------------------------*/

/*-------------------------------------------------------------------------------------------
|-- Class:	DragNDropUI.js
|--------------------------------------------------------------------------------------------
|-- Description: A User Interface dedicated to mapping out visual code and other applications.
|--------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------*/

//Create Initial UI Elements
var cabinet = document.createElement('div'); //Generates Cabinet of Draggable Code Elements
cabinet.id = 'cabinet';
var screen = document.createElement('div'); //Generates Physical DIV Screen where user can interact with draggable elements
screen.id = 'screen';
var canvasScreen = document.createElementNS('http://www.w3.org/2000/svg','svg'); //Generates SVG screen that overlaps with DIV Screen to create arrows and connectable circles
var defs = document.createElementNS('http://www.w3.org/2000/svg','defs'); //Generates definitions element for marker head (arrow tip placement)
canvasScreen.style.width = '100%';
canvasScreen.style.height = '100%';
canvasScreen.style.zIndex = "0";

var windowOverall = document.createElement('div'); //Generates the overall user interface keeping cabinet on the left and screen on the right
var zoomIn = document.createElement('div'); //Generates zoom in button located on the bottom-right corner (plus sign)
zoomIn.className = "pe-7s-plus pe-lg";
zoomIn.style.bottom = "50px";
zoomIn.style.position = "fixed";
zoomIn.style.right = "18.5px";
zoomIn.style.color = "black";

var deleteButton = document.createElement('div'); //Generates delete bucket located on the top-right of the screen (trash can)
deleteButton.className = "pe-7s-trash pe-5x";
deleteButton.style.right = "10px";
deleteButton.style.position = "fixed";

var zoomOut = document.createElement('IMG'); //Generates zoom out button located on the bottom-right corner (minus sign)
zoomOut.src = "Minus.png";
zoomOut.style.width = "17.5px";
zoomOut.style.height = "17.5px";
zoomOut.style.bottom = "30px";
zoomOut.style.position = "fixed";
zoomOut.style.right = "20px";

//Global Variables
var clone; //Generates clone of testBox (Ref: generateOneBox() class)
var i = 0; //Applies Counter for Distinctive Clone ID (Ref: generateOneBox() class)
var zoom = 1; //Keeps track of zoom feature on the screen (zoom = 1 -> 100%)
var hasBeenOpened = false; //Applicable to Context Menu to Limit Appending to One time (Ref: screen.contextmenu click event)
var firstInteraction; //First Point where the user wishes to begin the arrow (Ref: screen.contextmenu click event)
var secondInteraction;//First Point where the user wishes to end the arrow generation (Ref: screen.contextmenu click event)
//Object used to keep track of what should/shouldn't be available for context menu
var switches = {
	beginArrowClicked: false, //Checks if 'Create Arrow' is pressed on context menu
	generateArrowClicked: false, //Checks if 'Connect Arrow' is pressed on context menu
};

//Styling for Cabinet, Screen, and windowOverall
cabinet.style.overflowY = "auto";
cabinet.style.width = "20%";
cabinet.style.height = "97%";
cabinet.style.position = "fixed";
cabinet.style.borderStyle = "solid";
cabinet.style.borderColor = "black";
cabinet.style.cssFloat = "left";

screen.style.overflow = "auto";
screen.style.width = "78%";
screen.style.borderStyle = "solid";
screen.style.height = "97%";
screen.style.borderColor = "black";
screen.style.position = "fixed";
screen.style.cssFloat = "right";
screen.style.marginLeft = "20%";

windowOverall.style.width = '100%';
windowOverall.style.height = '100%';

//Appends all global items to body of the page
document.body.append(windowOverall);
windowOverall.append(cabinet);
windowOverall.append(screen);
screen.append(zoomIn);
screen.append(zoomOut);
screen.append(deleteButton);
screen.append(canvasScreen);

//EXPERIMENT WITH LINE CONFIGURATION (NOTE: APPLY THESE TO SPECIFIC PLACES ON DIV)

var arrowheadBottom = document.createElementNS('http://www.w3.org/2000/svg','path');
var arrowheadRight = document.createElementNS('http://www.w3.org/2000/svg','path');
var arrowheadLeft = document.createElementNS('http://www.w3.org/2000/svg','path');
var arrowheadContainerTop = document.createElementNS('http://www.w3.org/2000/svg','svg');
var arrowheadContainerBottom = document.createElementNS('http://www.w3.org/2000/svg','svg');
var arrowheadContainerLeft = document.createElementNS('http://www.w3.org/2000/svg','svg');
var arrowheadContainerRight = document.createElementNS('http://www.w3.org/2000/svg','svg');


//var pathTop = "M 0 15 L 30 15 L 15 0 M 15 15 Z"; //Top Arrowhead
//var pathLeft = "M 0 15 L 15 30 L 15 0 M 15 15 Z"; //Left Arrowhead
//var pathBottom = "M 30 0 L 15 15 L 0 0 M 15 0 Z"; //Bottom Arrowhead


//Generates the arrowhead tips as markers on top of lines (NOTE: Make sure to append to <marker> -> <defs>)
	/* arrowheadBottom.setAttributeNS(null,"d", pathBottom);
	arrowheadBottom.style.stroke = "black";
	arrowheadBottom.style.width = "20px";
	arrowheadBottom.style.height = "30px";
	arrowheadBottom.style.strokeWidth = "2";
	arrowheadBottom.style.position = "fixed";
					
	arrowheadLeft.setAttributeNS(null,"d", pathLeft);
	arrowheadLeft.style.stroke = "black";
	arrowheadLeft.style.width = "20px";
	arrowheadLeft.style.height = "30px";
	arrowheadLeft.style.strokeWidth = "2";
	arrowheadLeft.style.position = "fixed";
					
	arrowheadRight.setAttributeNS(null,"d", pathRight);
	arrowheadRight.style.stroke = "black";
	arrowheadRight.style.width = "20px";
	arrowheadRight.style.height = "30px";
	arrowheadRight.style.strokeWidth = "2";
	arrowheadRight.style.position = "fixed"; */

//END EXPERIMENTATION

/*-------------------------------------------------------------------------------------------
	|-- Class:	generateSVGCircle()
	|--------------------------------------------------------------------------------------------
	|-- Description: Generates One SVG Circle of a certain radius that can be positioned anywhere on the screen
	|--------------------------------------------------------------------------------------------
	|Takes:		(number) positionX - X-coordinate on screen where circle can be placed
	|			(number) positionY - Y-coordinate on screen where circle can be placed
	|
	|Returns:	(element) svgCircle;
	-------------------------------------------------------------------------------------------*/
	
function generateSVGCircle (positionX, positionY) {
	
	//Applies styling on generated SVG circle
	var svgCircle = document.createElementNS('http://www.w3.org/2000/svg','circle');
	svgCircle.setAttributeNS(null, 'cx', positionX);
	svgCircle.setAttributeNS(null, 'cy', positionY);
	svgCircle.setAttributeNS(null, 'r', '10');
	svgCircle.setAttributeNS(null, 'class', 'optionsMenuEnabled');
	svgCircle.setAttributeNS(null, 'style', 'stroke: blue; stroke-width: 1px;' );
	svgCircle.style.zIndex = "0";
	
	//Object that keeps track of the lines and circle connections between them
	svgCircle.options = {
		childNodes: [], //Lines (child Node) that originate from circle (Parent Node) (Applies to Originating SVG Circle) (end of arrow faced)
		connectedToParentNodes: [], //Circles that are connected to the lines of the original circle element (Applies to Originating SVG Circle) (end of arrow faced)
		connectedFromParentNodes: [], //Circles that have a originating line applied to them (Applies to Connected SVG Circle) (arrowhead faced)
		connectedFromParentNodesChildren: [], //Lines which the connected SVG Circle are connected to (arrowhead faced) (Applies to Connected SVG Circle)
	};
	
	//Allows svgCircle to be a draggable element through Interact.js library
	interact(svgCircle).draggable({
						inertia: true,
						onstart: function (event) {
							console.log(svgCircle.options);
						},
						onmove: function (event) {
							var canvasScreenCoords = canvasScreen.getBoundingClientRect();
							
							//Adjusts Position of the Circle Depending on movement of mouse
							var x = (parseFloat(svgCircle.getAttribute('data-x')) || 0) + event.dx;
							var y = (parseFloat(svgCircle.getAttribute('data-y')) || 0) + event.dy;
							svgCircle.style.webkitTransform = 'translate(' + x + 'px, ' + y + 'px)';
				
							svgCircle.setAttribute('data-x', x);
							svgCircle.setAttribute('data-y', y);
							
							xCoordinate = event.pageX;
							yCoordinate = event.pageY;
							
							for(var j = 0; j < svgCircle.options.childNodes.length; j++)
							{
								//Addresses Node of Original Element by setting end position of line to drag coordinates 
								svgCircle.options.childNodes[j].setAttribute('x2', event.pageX - canvasScreenCoords.left);
								svgCircle.options.childNodes[j].setAttribute('y2', event.pageY - canvasScreenCoords.top);
							}
								
							//Addresses Node of Connected Element if Present
							if(svgCircle.options.connectedFromParentNodes.length > 0)
							{
								//Gets Location of moving circle within context of canvas Screen
								var parentNodeLoc =  svgCircle.getBoundingClientRect();
								var parentNodeLeft = parentNodeLoc.left - canvasScreenCoords.left - 25;
								var parentNodeTop = parentNodeLoc.top - canvasScreenCoords.top + 20;
								
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


canvasScreen.append(generateSVGCircle('200','200'));
canvasScreen.append(generateSVGCircle('300','300'));
canvasScreen.append(generateSVGCircle('400','400'));

/*-------------------------------------------------------------------------------------------
	|-- Class:	generateLine()
	|--------------------------------------------------------------------------------------------
	|-- Description:	Generates one line with one arrowhead attached to it
	|--------------------------------------------------------------------------------------------
	|Takes:		Nothing
	|
	|Returns:	(element) line
	-------------------------------------------------------------------------------------------*/
function generateLine () {
	
	//Generates line, markerEnd, and arrowhead facing right
	var line = document.createElementNS('http://www.w3.org/2000/svg','line');
	line.setAttribute('class', 'optionsMenuEnabled');
	var markerEnd = document.createElementNS('http://www.w3.org/2000/svg','marker');
	var arrowheadRight = document.createElementNS('http://www.w3.org/2000/svg','path');
	var pathRight = "M 1,1 L 1,5 L 4,3 L 1,1 Z"; //Right Arrow
	
	//Applies styling for Right Arrow 
	arrowheadRight.setAttributeNS(null,"d", pathRight);
	arrowheadRight.style.stroke = "black";
	arrowheadRight.style.width = "100%";
	arrowheadRight.style.height = "100%";
	arrowheadRight.style.strokeWidth = "2";
	arrowheadRight.style.position = "relative";
	
	//Applies styling for marker
	markerEnd.setAttribute('id', 'arrowhead');
	markerEnd.setAttribute("markerWidth", 40);
	markerEnd.setAttribute('markerHeight', 40);
	markerEnd.setAttribute('refX', 1);
	markerEnd.setAttribute('refY', 3);
	
	//Appends Relevant Items For Line To Reference from Canvas Screen
	markerEnd.appendChild(arrowheadRight);
	defs.appendChild(markerEnd);
	canvasScreen.appendChild(defs);
	
	//Styling for Line
	line.style.stroke = "black"; 
	line.style.strokeWidth = "3";
	line.setAttribute('marker-start', 'url(#arrowhead)');
	
	//Object that keeps track of the originating circle element and the connected circle element for each line generated
	line.connections = {
		originElement: [], //(Maximum of 1 element saved) - Originating SVG Circle
		finishingElement: [], //(Maximum of 1 element saved) - Connected SVG Circle
	};
	
	return line;
}

/*-------------------------------------------------------------------------------------------
	|-- Class:	generateMenu()
	|--------------------------------------------------------------------------------------------
	|-- Description:	Generates One Context Menu for Screen that have a specific class name of 'optionsMenuEnabled'
	|--------------------------------------------------------------------------------------------
	|Takes:		Nothing
	|
	|Returns:	(element) container
	-------------------------------------------------------------------------------------------*/
function generateMenu () {
	
	//Styling for Container
	var container = document.createElement('div');
	container.id = "ContextMenu";
	container.style.width = "120px";
	container.style.height = "72px";
	container.style.marginLeft = - ((parseInt(screen.style.marginLeft) / 100) * window.innerWidth) + 'px';
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

	//Append all items into container Element
	container.appendChild(startArrowOption);
	container.appendChild(stopArrowOption);
	container.appendChild(deleteOption);
	
	return container;
}

//Applies specific click events for context menu when enabled
screen.oncontextmenu = function (event) {
	
	if(event.target.classList[0] == 'optionsMenuEnabled')
	{
		event.preventDefault(); //Prevents Original Attributes of Screen from occuring during process of adding/deleting elements
		var contextMenu = generateMenu();
		var svgElementClicked = event.target; //Saves element clicked during the context menu event to address it separately
		contextMenu.style.display = "none";
		
		if(hasBeenOpened != true)
		{
			//Places Context Menu within the confines of the screen
			contextMenu.style.display = "block";
			contextMenu.style.left = event.pageX + parseInt(contextMenu.style.width) > ((parseInt(canvasScreen.style.width) / 100) * window.innerWidth) ? ((parseInt(canvasScreen.style.width) / 100) * window.innerWidth) - parseInt(contextMenu.style.width) : event.pageX;
			contextMenu.style.top = event.pageY + parseInt(contextMenu.style.height) > ((parseInt(screen.style.height) / 100) * window.innerHeight) ? ((parseInt(screen.style.height) / 100) * window.innerHeight) - parseInt(contextMenu.style.height) : event.pageY;
			screen.append(contextMenu);
			
			//Addresses if Clicks Happen Prematurely when 'Create Arrow' is clicked simultaneously
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
			
			//Addresses if Clicks Happen Prematurely when 'Connect Arrow' is clicked simultaneously
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
			
			//Stops Currently generated Arrow from moving around once context menu is opened
			canvasScreen.onmousemove = function(event) {
				event.stopPropagation();
			};
			
			//Click Events For Context Menu When Opened
			contextMenu.addEventListener('click', function (event) {
				canvasScreenCoords = canvasScreen.getBoundingClientRect();
				var xCoordinate = event.pageX - ((parseInt(screen.style.marginLeft) / 100) * window.innerWidth);
				var yCoordinate = event.pageY;
				contextMenu.remove();
				
				//If Start Arrow is Selected from Context Menu
				if(event.target.id == "beginArrow")
				{
					switches.beginArrowClicked = true;

					var line = generateLine(); //Creates New Line
					canvasScreen.append(line); //Appends Line to SVG Screen (canvasScreen)
					firstInteraction = svgElementClicked; //Saves original Element (Circle) clicked
					
					//Saves relevant information into circle's options object and line.connections object
					firstInteraction.options.childNodes.push(line);
					line.connections.originElement.push(firstInteraction);
					console.log(firstInteraction.options);
					
					//Generates line path
					line.setAttribute('x2', xCoordinate);
					line.setAttribute('y2', yCoordinate);
					line.setAttribute('x1', xCoordinate);
					line.setAttribute('y1', yCoordinate);
					
					canvasScreen.onmousemove = function(event) {
						//console.log('moving with screen');
			
						xCoordinate = event.pageX - canvasScreenCoords.left;
						yCoordinate = event.pageY - canvasScreenCoords.top;
	
						//Drags Line Till Parent Node (Circle) Found and 'Connect Arrow' is clicked on context menu
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
							secondInteraction = svgElementClicked; //Saves second item (circle) clicked when context menu opened and 'Connect Arrow' selected
							console.log(secondInteraction);
							
							//Saves relevant information into circle's options object and line.connections object
							firstInteraction.options.connectedToParentNodes.push(secondInteraction);
							secondInteraction.options.connectedFromParentNodes.push(firstInteraction);
							secondInteraction.options.connectedFromParentNodesChildren.push(firstInteraction.options.childNodes[firstInteraction.options.childNodes.length - 1]);
							firstInteraction.options.childNodes[firstInteraction.options.childNodes.length - 1].connections.finishingElement.push(secondInteraction);
							
							//DEBUG
							console.log('firstInteraction', firstInteraction.options);
							console.log('secondInteraction', secondInteraction.options);
							
						}
						else
						{
							//In current design, possibility exists that the line may connect to itself and this chunk of code prevents it from happening 
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

//Removes Context Menu if mouse is clicked elsewhere on the screen
screen.onclick = function (event) {
	var contextMenu = document.getElementById('ContextMenu');
	if(contextMenu != null)
	{
		contextMenu.remove();
		hasBeenOpened = false;
	}
};

/*-------------------------------------------------------------------------------------------
	|-- Class:	generateOneBox()
	|--------------------------------------------------------------------------------------------
	|-- Description:	Generates One Code Block in the Cabinet of UI and applies draggability to its clone
	|--------------------------------------------------------------------------------------------
	|Takes:		(string) text - Text for Code Block to display
	|
	|Returns:	(element) testBox
	-------------------------------------------------------------------------------------------*/
	
function generateOneBox (text) {
	
	//Test Box
	var testBox = document.createElement('div');
	testBox.id = text;
	var titleBox = document.createElement('div');
	
	//Styling for Box	
	testBox.style.width = "100px";
	testBox.style.height = "80px";
	testBox.style.borderRadius = "15px";
	testBox.style.borderStyle = "solid";
	testBox.style.borderColor = "black";
	testBox.style.margin = "auto";
	testBox.style.marginTop = "20px";
	testBox.style.verticalAlign = "middle";
	testBox.style.position = "sticky";
	testBox.style.zIndex = "0";
	
	titleBox.style.marginTop = "30px";
	titleBox.style.textAlign = "center";
	titleBox.style.fontFamily = "Helvetica";
	titleBox.style.fontWeight = "bold";
	titleBox.innerText = text;
	
	testBox.append(titleBox);
	testBox.style.touchAction = "none";
	testBox.style.userSelect = "none";
	interact.dynamicDrop(true);
	
	//USES SCREEN AS A DIV
	//Drag and Drop Interface using Interact.js
	interact(testBox).draggable({
		inertia: true,
 		restrict: {
			restriction: document.getElementById('screen'),
			endOnly: true,
		},
		onstart: function (event) {
			clone.style.zoom = 0;
		},
		onmove: function (event) {
				
				//On Drag movement, the testBox will move according to the movement of the mouse as it remains clicked (NOTE: APPLIES ONLY ON THE SCREEN)
				clone = event.target;

				clone.style.marginLeft = '-20%';
							
				var x = (parseFloat(clone.getAttribute('data-x')) || 0) + event.dx;
				var y = (parseFloat(clone.getAttribute('data-y')) || 0) + event.dy;
				clone.style.webkitTransform = 'translate(' + x + 'px, ' + y + 'px)';
				
				clone.setAttribute('data-x', x);
				clone.setAttribute('data-y', y);
				
			},
		onend: function (event) {
			clone.style.zoom = zoom;
		},
	}).on('move', function (event) {
				var interaction = event.interaction;
				

				if (interaction.pointerIsDown && !interaction.interacting()) {
					
					
					//Creates One Clone
					clone = event.currentTarget.cloneNode(true);
					clone.id = event.currentTarget.id + i;
					clone.className = "screenItem";
					i++;

					clone.style.position = "absolute";
					
					//Appends ONE Clone
					var cloneCoords = clone.getBoundingClientRect();
					//var topCircle = generateSVGCircle(cloneCoords.left,cloneCoords.top);
					//var bottomCircle = generateSVGCircle(cloneCoords.left,cloneCoords.bottom);
					//var leftCircle = generateSVGCircle(cloneCoords.left,cloneCoords.top);
					//var rightCircle = generateSVGCircle(cloneCoords.right,cloneCoords.top);
					
					screen.append(clone);

					//Interaction begins with Clone ONCE DRAGGED FROM CABINET TO SCREEN
					interaction.start({ name: 'drag' },
							event.interactable,
							clone);
					
					//canvasScreen.append(topCircle);
					//canvasScreen.append(bottomCircle);
					//canvasScreen.append(leftCircle);
					//canvasScreen.append(rightCircle);
					
					clone.style.left = event.clientX - 80;
					clone.style.top = event.clientY - 80;
					
					interact(clone).draggable({
						inertia: true,
						restrict: {
							restriction: document.getElementById('screen'),
							endOnly: true,
							elementRect: {
								top: 0,
								left: 0,
								right: 1,
								bottom: 1,
							}
						},
						onmove: function (event) {
							
							//On Drag movement, the clone testBox will move according to the movement of the mouse as it remains clicked (NOTE: ONLY APPLIES FROM CABINET TO SCREEN)
							clone = event.target;

							var x = (parseFloat(clone.getAttribute('data-x')) || 0) + event.dx;
							var y = (parseFloat(clone.getAttribute('data-y')) || 0) + event.dy;
							clone.style.webkitTransform = 'translate(' + x + 'px, ' + y + 'px)';

							clone.setAttribute('data-x', x);
							clone.setAttribute('data-y', y);
							
							//topCircle.style.webkitTransform = 'translate(' +  + 'px, ' +  + 'px)';
						},
					});
				}
	});
	return testBox;
}

cabinet.append(generateOneBox('IF'));
cabinet.append(generateOneBox('WHILE'));
cabinet.append(generateOneBox('FOR'));
cabinet.append(generateOneBox('CODE'));
cabinet.append(generateOneBox('CODE'));
cabinet.append(generateOneBox('CODE'));
cabinet.append(generateOneBox('CODE'));
cabinet.append(generateOneBox('CODE'));

//Addresses Zoom In and Zoom Out Button Functionality for those with class Name 'screenItem'
screen.addEventListener("click", function (event) {
	var allItems = document.getElementsByClassName("screenItem");
	
	if(event.target == zoomIn) {
		//console.log('increase size');
		zoom += 0.05;
		for(var j = 0; j < allItems.length; j++)
		{
			allItems[j].style.zoom = zoom;
			console.log(zoom);
		}
	}
	if(event.target == zoomOut) {
		//console.log('decrease size');
		zoom -= 0.05;
		for(var j = 0; j < allItems.length; j++)
		{
			allItems[j].style.zoom = zoom;
			console.log(zoom);
		}
	}
});

//Addresses Delete Bin Functionality (NOTE: ONLY WORKS FOR CODE BLOCKS CURRENTLY)
interact(deleteButton).dropzone({
	accept: clone,
	ondrop: function (event) {
		itemDeleted = event.relatedTarget;
		
		itemDeleted.style.display = "none";
		itemDeleted.remove();
	}
});