A Tooltip Webcomponent created through LitElement and [Tippy.js](https://atomiks.github.io/tippyjs)

## Usage
```html
	<paper-button id="my-button">My Button</paper-button>
	<dw-tooltip for="my-button">I'm tippy tooltip!!!</dw-tooltip>
```

## Configs/Options
It supports all the options supported by Tippy.js. But, following most used options can be configured through properties.
- trigger
- offset
- placement
- animation
- theme

Other options you may configure through a special Object property `extraOptions`.

### Theme
To configure Theme in little bit tricky. Tippy adds tooltip element directly to the `body`. 
So, You need to add theme css directly into the Body.

e.g. To activate `tomato` theme in the Tippy's demo. You need to add following CSS to the Body.
```css
.tippy-tooltip.tomato-theme {
	background-color: tomato;
	color: yellow;
}

.tippy-tooltip.tomato-theme[data-animatefill] {
	background-color: transparent;
}

.tippy-tooltip.tomato-theme .tippy-backdrop {
	background-color: tomato;
}
```

## HTML content tooltip
```html
	<paper-button id="my-button">My Button</paper-button>
	<dw-tooltip for="my-button">
		<span>I'm tippy tooltip!!!</span>
	</dw-tooltip>
```

> We haven't tried this yet, but there might be a styling issue in this as well. 
> Becuase, Tippy moves `span` inside it's tooltip dom. Which is appended directly to the Body. 
> So, CSS written through the element's `style` property won't work. Though Inline CSS should work.


## Known issues
- `trigger=focus` isn't working on iOS Safari + Chrome. 