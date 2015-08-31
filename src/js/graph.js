/*
	==================
	GRAPH GENERATER
	==================
	
	Expected behaviour : new Grid_timeline({}).render();
	*/

	//GLOBAL FACADE
	var Grid_timeline = function(params) {

			var _init = function() {
				//initialization for inner loading of modules
				_Mediater.views.createContainerSvg();
				_Mediater.views.createLegendAnnotations();
				_Mediater.presenter.plotCircles();
				_Mediater.presenter.textGenerator();
				_Mediater.presenter.link();
				
				return "All Good";
			};

			var _Observer = (function() {

					var _observerObject = {
							register : function(eventName) {
								//register Events inside facade
								this.events.push(""+ new Date().getTime()+"  "+eventName+ "\n");
								//For testing purposes
								if(params.testing === 1)
								console.log(this.events);

								return this;


							}
							,garbage: {
									dump : [],
									currentY : 13,
									dump_group : [],
									pushToGarbage : {}
							}
							,events : []

						};
						return _observerObject;

			})();

			var _Mediater = (function() {

					var _mediatorObject = {};
					var _model = (function() {

							var _modelObject ={}

							, _data = params.data
							, _title = params.title
							, _xLegend = params.xLegend
							, _yLegend = params.yLegend
							, _footer = params.footer
							, _renderOn = params.renderOn
							, _maxWeek = 52
							, _minWeek =1
							, _maxAge = 89
							, _minAge = 0
							
							, _vis = d3.select(_renderOn)
							, _spacing = {
								width : 600,
								height : 800,
								margins : {
									top : 20,
									right :20,
									bottom : 20,
									left : 20
								}
							}
							, _scale ={
								xScale : d3.scale.linear().range([_spacing.margins.left, _spacing.width - _spacing.margins.right]).domain([_minWeek,_maxWeek]),
								yScale : d3.scale.linear().range([ _spacing.margins.bottom, _spacing.height - _spacing.margins.top]).domain([_minAge,_maxAge]),
							}

							, _axis ={
								xAxis : d3.svg.axis().scale(_scale.xScale).orient("bottom"),
								yAxis : d3.svg.axis().scale(_scale.yScale).orient("left").ticks(18)
							}
							, _lineFunction = d3.svg.line().x(function(d) { return d.x_data; }).y(function(d) { return d.y_data; }).interpolate("linear")
							;


							
							
							_modelObject.data = (params.sorted ===1 ?(
								_data.sort(function(a, b){ return a.age - b.age; })) :_data);
							_modelObject.maxWeek = _maxWeek;
							_modelObject.maxAge = _maxAge;
							_modelObject.scale = _scale;
							_modelObject.xLegend = _xLegend;
							_modelObject.yLegend = _yLegend;
							_modelObject.title = _title;
							_modelObject.footer = _footer;
							_modelObject.renderOn = _renderOn;
							_modelObject.minAge = _minAge;
							_modelObject.minWeek = _minWeek;
							_modelObject.vis = _vis;
							_modelObject.spacing = _spacing;
							_modelObject.scale = _scale;
							_modelObject.axis = _axis;
							_modelObject.colorScale =d3.scale.category10();
							_modelObject.lineFunction = _lineFunction;

							_Observer.register("Model Ready");
							_Observer.register(_mediatorObject);
							_mediatorObject.model = _modelObject; //stream line the mediator object throught the _Mediator
													
						})();

					var _views = (function() {
							
							var _createContainerSvg = function(){
							//create the axis
						 	_mediatorObject.model.vis = _mediatorObject.model.vis.append("svg:g").attr("class","graph-container").attr("transform", "translate(200,60)");
  							_mediatorObject.model.vis.append("svg:g").attr("class", "X-axis").call(_mediatorObject.model.axis.xAxis);
  							_mediatorObject.model.vis.append("svg:g").attr("transform", "translate(" + (_mediatorObject.model.spacing.margins.left) + ",0)").attr("class", "Y-axis").call(_mediatorObject.model.axis.yAxis);

  							//create the rects
  							for(var i=_mediatorObject.model.minAge, l1 =_mediatorObject.model.maxAge; i<=l1; i++){
								for(var j=_mediatorObject.model.minWeek, l2 = _mediatorObject.model.maxWeek; j<=l2; j++){
  									_mediatorObject.model.vis.append("rect").attr("x", _mediatorObject.model.scale.xScale(j))
                          				.attr("y", _mediatorObject.model.scale.yScale(i))
                           				.attr("height", ((_mediatorObject.model.scale.yScale(1)-_mediatorObject.model.scale.yScale(0))*0.5))
                           				.attr("width", ((_mediatorObject.model.scale.xScale(1)-_mediatorObject.model.scale.xScale(0))* 0.5))
                           				.attr("transform", "translate("+-((_mediatorObject.model.scale.xScale(1)-_mediatorObject.model.scale.xScale(0))* 0.17)+",0)")
                           				.attr("id", i+""+j)
                           				.attr("class", "rectangle_elem");                       
                  
                      				}
                  				}

                  			};//!_createContainerSvg
                  			_Observer.register("Loaded Container Svg");

                  			
                  			var _createLegendAnnotations = function () {
                  			_mediatorObject.model.vis.append("text").attr("x",(_mediatorObject.model.scale.xScale(18)))
				  				.attr("y", (_mediatorObject.model.scale.yScale(-6)))
				  				.attr("font-size", "20px")
				  				.attr("font-family", "arial")
				  				.attr("fill", "#7383AA")
				  				.text(_mediatorObject.model.title);

							_mediatorObject.model.vis.append("path").attr("d", "M 0 9 L 56 9 L 48 15 L 56 9 L 48 3")
				  				.attr("stroke", "#959FB7")
				  				.attr("stroke-width", "1")
				  				.attr("fill", "none")
				  				.attr("transform", "translate("+(_mediatorObject.model.scale.xScale(10))+" , "+(_mediatorObject.model.scale.yScale(-4.5))+" )");

							_mediatorObject.model.vis.append("path").attr("d", "M 10 9 L 10 56 L 4 47 L 10 56 L 16 47")
				  				.attr("stroke", "#959FB7")
				  				.attr("stroke-width", "1")
				  				.attr("fill", "none")
				  				.attr("transform", "translate("+(_mediatorObject.model.scale.xScale(-4.5))+" , "+(_mediatorObject.model.scale.yScale(5))+" )");
				  

							_mediatorObject.model.vis.append("text").attr("x",(_mediatorObject.model.scale.xScale(4)))
				  				.attr("y", (_mediatorObject.model.scale.yScale(1.4)))
				  				.attr("font-size", "10px")
				  				.attr("font-family", "arial")
				  				.attr("fill", "#7383AA")
				  				.text(_mediatorObject.model.yLegend)
				  				.attr("class", "age");
				  

							_mediatorObject.model.vis.append("text").attr("x",(_mediatorObject.model.scale.xScale(2)))
				  				.attr("y", (_mediatorObject.model.scale.yScale(-3.2)))
				  				.attr("font-size", "10px")
				  				.attr("font-family", "arial")
				  				.attr("fill", "#7383AA")
				  				.text(_mediatorObject.model.xLegend);

				  			_mediatorObject.model.vis.append("text").attr("x",(_mediatorObject.model.scale.xScale(45)))
				  				.attr("y", (_mediatorObject.model.scale.yScale(92)))
				  				.attr("font-size", "10px")
				  				.attr("font-weight", "bold")
				  				.attr("font-family", "arial")
				  				.attr("fill", "#7383AA")
				  				.attr("class" ,"footer")
				  				.text(_mediatorObject.model.footer);
                  			
							};//! _createLegendAnnotations
							_Observer.register("Annotations Created");

							_mediatorObject.views = {};
							_mediatorObject.views.createContainerSvg = _createContainerSvg;
							_mediatorObject.views.createLegendAnnotations = _createLegendAnnotations;
						
						})();

						
					var _presenter = (function() {

							var _plotCircles = function(){								
								_mediatorObject.model.vis.selectAll("circle").data(_mediatorObject.model.data).enter().append("circle").attr("class", "data")
    								.attr("cx", function (d) { return _mediatorObject.model.scale.xScale(d.week);})
                        			.attr("cy", function (d) {return (_mediatorObject.model.scale.yScale(d.age)+((_mediatorObject.model.scale.yScale(1)-_mediatorObject.model.scale.yScale(0))* 0.5)/2); })
                        			.attr("r", function(d,i){  

                        				var radius =  ((_mediatorObject.model.scale.xScale(1)-_mediatorObject.model.scale.xScale(0))* 0.3);

                        				var pushToGarbage = {
                        					x_data : _mediatorObject.model.scale.xScale(d.week)+ radius ,
                        					y_data : _mediatorObject.model.scale.yScale(d.age)
                        				};
                        				if(d.week < 26){ pushToGarbage.x_data = pushToGarbage.x_data - (2 * radius); }
                        				_Observer.garbage.dump.push([]);
                        				_Observer.garbage.dump[i].push(pushToGarbage);
                        				
                        				return radius;

                        				})
                        			.attr("stroke", function(d){                      
                        				var a =_mediatorObject.model.colorScale(d.group);                        				
                        				return a;
                        			}  );
							};//!plot circles
							_Observer.register("Plot Circles Done");

							var _textGenerator = function() {
								var x,y;
									 _mediatorObject.model.vis.append("g")
									.selectAll("text").data(_mediatorObject.model.data).enter()
										.append("text")										
										.attr("x",function (d,i) {										
											if(d.week >= 26 ){
												x = _mediatorObject.model.scale.xScale(56);

											return x;
										}else {

												x = _mediatorObject.model.scale.xScale(-6);
												this.style.textAnchor="end";
												
											return x;
										}
										})
				  						.attr("y", function (d,i) {				  							
				  							_Observer.garbage.currentY = _Observer.garbage.currentY + 1.5;
				  							y = _mediatorObject.model.scale.yScale(_Observer.garbage.currentY);
				  							
				  							if(d.week >= 26 ){
												x = _mediatorObject.model.scale.xScale(56);											
										}else {

												x = _mediatorObject.model.scale.xScale(-5);												
										}
				  							_Observer.garbage.dump[i].push({x_data : x-5, y_data : y}); 
				  							_Observer.garbage.dump_group.push(d.group);
				  							return y;

				  						})
				  						.attr("font-size", "10px")
				  						.attr("font-family", "arial")
				  						.attr("fill", function(d){                      
                        				var a =_mediatorObject.model.colorScale(d.group);                        				
                        				return a;
                        				} )
				  						.text(function(d,i){					  											
				  						var a =d.name;                        				
                        				return " "+a;
                        				} );

							};//! Text Generator
							_Observer.register("Genrated corrsp. Text");

							var _link = function() {	
														
								for(var i=0; i<_Observer.garbage.dump.length; i++){
									_mediatorObject.model.vis.append("path").attr("d", _mediatorObject.model.lineFunction(_Observer.garbage.dump[i]))
                            			.attr("stroke", function(){                             				
                            				var a =_mediatorObject.model.colorScale(_Observer.garbage.dump_group[i]);                        				
                        				return a;
                            			})
                            			.attr("stroke-width", 1)
                           				.attr("fill", "none");
								}
							};//! Link
							_Observer.register("Link Done");

							_mediatorObject.presenter = {};
							_mediatorObject.presenter.plotCircles = _plotCircles;
							_mediatorObject.presenter.link = _link;
							_mediatorObject.presenter.textGenerator = _textGenerator;
							_Observer.register("Presenter Ready");


						})();

					return _mediatorObject;
			})();


			

			this.render = function(){
				console.log(_init());
			}
			return this;
	}