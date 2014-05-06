var app = angular.module("range-delimiter", []);

app.service("RangePart", function() {
    this.create = function(background, width, height) {
        var new_elem = angular.element("<div></div>");

        new_elem.addClass("range-part")
        new_elem.css({
            "background": background,
            "width": width,
            "height": height
        });

        new_elem.rect = function() {
            return this[0].getBoundingClientRect();
        }

        new_elem.width = function(width) {
            this.css("width", width + "px");

            if (this.updateModel) {
                this.updateModel(width);
            }
        }

        return new_elem;
    }
});

app.service("Slider", function() {
    var doc = angular.element(document);

    this.create = function(prev_obj) {
        var slider = angular.element("<div></div>");

        slider.prev = prev_obj;

        slider.addClass("range-slider");
        slider.addClass("range-slider--default");

        slider.halfWidth = function() {
            return this[0].offsetWidth * 0.5;
        }

        slider.startDrag = function() {
            doc.bind("mousemove", function(e) {
                slider.dragSlider(e);
            });
        }

        slider.dragSlider = function(e) {
            var x = e.x;

            var left_bound = this.prev.rect().left + this.halfWidth();
            if (x < left_bound ) {
                x = left_bound;
            }

            var right_bound = this.next.rect().right - this.halfWidth();
            if (x > right_bound) {
                x = right_bound;
            }

            var rect = this.next.rect();
            this.next.width(rect.right - x - this.halfWidth());

            var rect = this.prev.rect();
            this.prev.width(x - rect.left - this.halfWidth());
        }

        slider.bind("mousedown", function(e) {
            e.preventDefault();

            slider.startDrag();
        });

        return slider;
    }
});

app.directive("rangeDelimiter", function($parse, RangePart, Slider) {
    var ranges = [];
    var sliders = [];

    return {
        restrict: "E",
        replace: true,
        template: "<div class='range-cont'></div>",
        require: "ngModel",
        compile: function(elem, attrs) {
            var parts = $parse(attrs.parts)();

            var length = Object.keys(parts).length;
            var count = 0;
            for (var title in parts) {
                count++;

                var width = (100 - length) / length + "%";
                var height = "20px";
                
                if (typeof parts[title] === "string") {
                    var background = parts[title];
                } else {
                    background = parts[title]['background'];
                    
                    if (parts[title]['width']) {
                         width = parts[title]['width'];
                    }

                    if (parts[title]['height']) {
                        height = parts[title]['height'];
                    }
                }

                var new_elem = RangePart.create(background, width, height);

                elem.append(new_elem);

                ranges.push(new_elem);

                if (count < length) {

                    var slider = Slider.create(new_elem);

                    elem.append(slider);

                    sliders.push(slider);
                }

                if (count > 1) {
                    sliders[count - 2].next = new_elem;
                }
            }

            return function (scope, elem, attrs, ngModel) {
                if (! ngModel) {
                    return;
                }

                angular.element(document).bind("mouseup", function(e) {
                    angular.element(document).unbind("mousemove");
                });

                scope.widths = [];
                scope.applyWidths = function() {
                    ngModel.$setViewValue(scope.widths);
                }

                for (var i = 0; i < ranges.length; i++) {
                    scope.widths[i] = ranges[i][0].offsetWidth;

                    (function(i) {
                        ranges[i].updateModel = function(width) {
                            scope.widths[i] = width;
                            scope.$apply(scope.applyWidths);
                        }
                    })(i);
                };
                scope.applyWidths();
            }
        }
    }
});