RangeDelimiter is an AngularJS directive to help with convenient measuring ranges. User can drag sliders to measure the distance visually.

## Demo

You can find simple demo application [here](http://iktash.github.io/range-delimiter).

## How to use

Include the range-delimiter.js and range-delimiter.css files. Then include the module in your app:

```javascript
var app = angular.module("myApp", ["range-delimiter"]);
```

Now just put the directive into your html file:

```html
<range-delimiter data-ranges="categories"></range-delimiter>
```

**$scope.categories** may be defined like this:

```javascript
$scope.categories = [
    {
        background: "green",
        height: '20px',
        width: '300px'
    },
    {
        background: "#555",
        height: '2em',
        width: '30%'
    }
];
```

After this, whenever user changes widths of ranges using the directive, objects in the array will be updated with **range_width** property that will have actual width in pixels.

## Inline Options

| Option name | Required? | Possible values | Default value | Description |
| ----------- | --------- | --------------- | ------------- | ----------- |
| ranges      | yes       | any array in scope | null | Think of this as analog of ngModel directive |
| slider-class | no | name of css-class | range-slider--default | The class that can define the appearance of sliders

## Ranges Option

This option takes an array of objects from scope and binds it with directive's ranges. It can have following keys:

| Key name | Possible values | Default value | Description |
| -------- | --------------- | ------------- | ----------- |
| background | any string that can be used for 'background' css property | #555 | Defines the custom background of directive's range |
| height | any string that can be used for 'height' css property | 20px | Defines the custom height of directive's range |
| width | any string that can be used for 'width' css property | 100% / (number of ranges) | Defines the custom width of directive's range. It will be changed by user though, so this property defines only initial state. |