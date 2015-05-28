/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


;
(function ($) {
	if ($.fn.timebar) {
		return;
	}

	function mousehover() {
		var $pop = $(this).parent(".timebar-container").find(".timebar-pop");

	}

	function Timebar(dom, options) {
		this.$dom = $(dom);
		this.data = [];
		this.min = 0;
		this.max = 24;

		if (options.min) {
			this.min = options.min;
		}
		if (options.max) {
			this.max = options.max;
		}

		this.add = function (node) {
			if (!node || !node.id) {
				$.error("node格式错误");
				return;
			}
			this.remove(node.id);
			this.data.push(node);
			this.data.sort(function (a, b) {
				return a.start - b.start;
			});
		};
		this.remove = function (id) {
			var _data = this.data;
			$(_data).each(function (i, item) {
				if (item.id == id) {
					_data.splice(i, 1);
					return false;
				}
			});
		};
		this.getAllNodesCopy = function () {
			return this.data.slice(0);
		};
	}

	function timeStrToNum(t) {
		var num = t;
		if (typeof (t) === "string") {
			var time = t.replace("：", ":").split(":");
			if (time.length === 1) {
				num = time[0] * 1;
			} else if (time.length === 2) {
				num = time[0] * 1 + time[1] * 1 / 60;
			} else if (time.length === 3) {
				num = time[0] * 1 + time[1] * 1 / 60 + time[2] * 1 / 60 / 60;
			} else {
				$.error("时间格式错误", t);
			}
		}

		return num;
	}

	function numToTimeStr(n) {
		var hour = Math.floor(n);
		var min = Math.floor((n - hour) * 60);
		return (hour < 10 ? "0" : "") + hour + ":" + (min < 10 ? "0" : "") + min;
	}

	var methods = {
		init: function (options) {
			return this.each(function () {
				//创建一些默认值，拓展任何被提供的选项
				var settings = $.extend(true, {
					min: 0,
					max: 24,
					label: {
						left: false,
						right: false
					}
				}, options);

				settings.min = timeStrToNum(settings.min);
				settings.max = timeStrToNum(settings.max);

				if ($(this).hasClass("timebar")) {
					return;
				} else {
					var $bar = $(this).append("<div class='timebar-container'></div>");
					$(this).append("<div class='timebar-pop'></div>");
					var $pop = $(this).find(".timebar-pop");

					$(document).mousemove(function (e) {
						$pop.offset({top: e.pageY + 20, left: e.pageX + 20});
					});

					if (settings.label.left) {
						$bar.append("<span class='timebar-label timebar-label-left'>" + numToTimeStr(settings.min) + "</span>");
					}
					if (settings.label.right) {
						$bar.append("<span class='timebar-label timebar-label-right'>" + numToTimeStr(settings.max) + "</span>");
					}
					$(this).addClass("timebar");
					$(this).data("timebar", new Timebar(this, settings));
					$(this).bind("render.timebar", methods.render);
				}
			});
		},
		addNode: function (node) {
//			console.log(node);
			return this.each(function () {
				var data = $(this).data("timebar");
				if (!data) {
					return;
				} else {
					node = $.extend({
						id: "def",
						start: data.min,
						end: data.max
					}, node);

					node.start = timeStrToNum(node.start);
					node.end = timeStrToNum(node.end);

					if (node.start > data.max) {
						node.start = data.max;
					}
					if (node.start < data.min) {
						node.start = data.min;
					}
					if (node.end > data.max) {
						node.end = data.max;
					}
					if (node.end < data.min) {
						node.end = data.min;
					}
					//$(this).attr("timebar-node-data", JSON.stringify(node));
					data.add(node);
					//$(this).trigger("render.timebar");
				}
			});
		},
		addNodes: function (nodes) {
			return this.each(function () {
				var data = $(this).data("timebar");
				if (!data) {
					return;
				} else {
					$(nodes).each(function (i, node) {


						node = $.extend({
							id: "def",
							start: data.min,
							end: data.max
						}, node);

						node.start = timeStrToNum(node.start);
						node.end = timeStrToNum(node.end);

						if (node.start > data.max) {
							node.start = data.max;
						}
						if (node.start < data.min) {
							node.start = data.min;
						}
						if (node.end > data.max) {
							node.end = data.max;
						}
						if (node.end < data.min) {
							node.end = data.min;
						}
						//$(this).attr("timebar-node-data", JSON.stringify(node));
						data.add(node);
					});
					//$(this).trigger("render.timebar");
				}
			});
		},
		getAllNodes: function () {
			var data = this.data("timebar");
			if (!data) {
				return;
			} else {
				return data.getAllNodesCopy();
			}
		},
		clearNodes: function () {
			return this.each(function () {
				var data = $(this).data("timebar");
				if (!data) {
					return;
				} else {
					data.data = [];
					$(this).trigger("render.timebar");
				}
			});
		},
		removeNode: function (id) {
			return this.each(function () {
				var data = $(this).data("timebar");
				if (!data) {
					return;
				} else {
					data.remove(id);
					//$(this).trigger("render.timebar");
				}
			});
		},
		bind: function (option) {
			return this.each(function () {
				var data = $(this).data("timebar");
				var $bar = $(this).find(".timebar-container");
				if (!data || typeof (option) !== "object") {
					return;
				} else {
//					console.log(option);
					$bar.find("[timebar-node-id='" + option.id + "']").on(option.trigger, option.func);
				}
			});
		},
		render: function () {
			return $(this).each(function () {
				var _data = $(this).data("timebar");
				if (!_data) {
					return;
				} else {
					var $bar = $(this).find(".timebar-container");
					var $pop = $(this).find(".timebar-pop");
					$(_data.data).each(function (i, item) {
//						console.log(this);
						var max = _data.$dom.width();
//						console.log(_data);
						var $node = $bar.find("[timebar-node-id='" + item.id + "']");

						if ($node.length === 0) {
							$node = $("<span class='timebar-node'>");
							if (item.elCls) {
								$node.addClass(item.elCls);
							}
							$node.attr("timebar-node-id", item.id);
							$node.mouseenter(function () {
								if (item.hover) {
									$pop.text(numToTimeStr(item.start) + " - " + numToTimeStr(item.end));
									$pop.show();
								}
							}).mouseleave(function () {
								$pop.hide();
							});
						}

						var json = eval("(" + $node.attr("timebar-node-data") + ")");

						item = $.extend({}, item, json);

						$node.attr("timebar-node-data", JSON.stringify(item));

						var timeStr = numToTimeStr(item.start) + " - " + numToTimeStr(item.end);

						if (item.display) {
							$node.text(item.display);
						}

						$node.css({
							"left": max * ((item.start - _data.min) / (_data.max - _data.min)) + "px",
							"background-color": item.color || $node.css("background-color"),
							"color": item.displayColor || $node.css("color")
						});
						$node.width(max * ((item.end - item.start) / (_data.max - _data.min)));


						$node.appendTo($bar);
					});

					$bar.find(".timebar-node").each(function () {
						var node_id = $(this).attr("timebar-node-id");
						var flag = false;
						$(_data.data).each(function () {
							if (this.id == node_id) {
								flag = true;
								return false;
							}
						});
						if (!flag) {
							$(this).remove();
						}
					});
				}
			});

		}
	};

	$.fn.timebar = function (method) {

		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.timebar');
		}

	};
})(jQuery);