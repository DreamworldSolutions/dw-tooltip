# dw-tooltip
A Tooltip Webcomponent created through LitElement &amp; Tippy.js


## Properties
- for (String)
- trigger
- offset
- placement
- animation
- extraOptions (Object)

## template
```html
<div id="tooltip-content"><slot></slot></div>
```

## local variables in logic:

elContent
elTrigger

## Example
```html
<paper-button id="hell-button">Click me</paper-button>
<dw-tooltip for="hello-button">
	<span>sdfsd</span>
	<paper-button>OK</paper-button>
</dw-tooltip>
```

