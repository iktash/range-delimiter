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

        new_elem.getWidth = function() {
            return this[0].offsetWidth;
        }

        return new_elem;
    }
});

app.service("Slider", function() {
    var doc = angular.element(document);

    this.create = function(prev_obj, css_class) {
        var slider = angular.element("<div></div>");

        slider.prev = prev_obj;

        slider.addClass("range-slider");
        
        if (css_class) {
            slider.addClass(css_class);
        } else {
            slider.addClass("range-slider--default");
        }

        slider.rect = function() {
            return this[0].getBoundingClientRect();
        }

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

            var delta = x - slider.old_x;

            this.next.width(this.next.rect().width - delta);

            this.prev.width(this.prev.rect().width + delta);

            slider.old_x = x;
        }

        slider.bind("mousedown", function(e) {
            e.preventDefault();

            slider.old_x = slider.rect().left + slider.halfWidth();

            slider.startDrag();
        });

        return slider;
    }
});

app.directive("rangeDelimiter", function(RangePart, Slider, $timeout) {
    

    return {
        restrict: "E",
        replace: true,
        template: "<div class='range-cont'></div>",
        scope: {
            ranges: "="
        },
        link: function(scope, elem, attrs) {
            var init = function() {
                var ranges = [];
                var sliders = [];
                var parts = scope.ranges;
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

                        var slider = Slider.create(new_elem, attrs.sliderClass);

                        elem.append(slider);

                        sliders.push(slider);
                    }

                    if (count > 1) {
                        sliders[count - 2].next = new_elem;
                    }
                }

                angular.element(document).bind("mouseup", function(e) {
                    angular.element(document).unbind("mousemove");
                });

                $timeout(function() {
                    for (var i = 0; i < scope.ranges.length; i++) {
                        scope.ranges[i].range_width = ranges[i].rect().width;

                        (function(i) {
                            ranges[i].updateModel = function(width) {
                                scope.$apply(function() {
                                    scope.ranges[i].range_width = width;
                                });
                            }
                        })(i);
                    };
                });
            }

            scope.$watchCollection(
                function($scope) {
                    var res = [];
                    for (var i = 0; i < $scope.ranges.length; i++) {
                        res.push($scope.ranges[i].background);
                        res.push($scope.ranges[i].height);
                        res.push($scope.ranges[i].width);
                    }

                    return res;
                }
                , function() {
                    elem.empty();
                    init();
                }
            );

            init();
        }
    }
});
