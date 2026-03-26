# `<dw-tooltip>` — @dreamworld/dw-tooltip

A LitElement web component that wraps [Tippy.js v6](https://atomiks.github.io/tippyjs/) to provide a declarative, attribute-driven tooltip bound to any sibling or referenced DOM element.

---

## 1. User Guide

### Installation & Setup

```bash
yarn add @dreamworld/dw-tooltip
```

**Dependencies** (installed automatically):

| Package | Role |
|---|---|
| `tippy.js` | Tooltip engine (positioning, animation, plugins) |
| `@dreamworld/pwa-helpers` | LitElement + `lit` re-export |
| `@dreamworld/material-styles` | Material Design typography tokens |

**Required CSS** — Tippy's theme and animation CSS must be loaded in your HTML `<head>`. Only import the animation files for the animations you use.

```html
<!-- Tippy material theme (always required for default theme) -->
<link rel="stylesheet" href="/node_modules/tippy.js/themes/material.css">

<!-- Animation files — import only what you use -->
<link rel="stylesheet" href="/node_modules/tippy.js/animations/shift-away.css">
<link rel="stylesheet" href="/node_modules/tippy.js/animations/scale.css">
```

**JavaScript — ES module import:**

```js
import '@dreamworld/dw-tooltip/dw-tooltip.js';
```

This registers the `<dw-tooltip>` custom element and exports `DWTooltip` and `DWTooltipStyle`.

---

### Basic Usage

Place `<dw-tooltip>` as a sibling of its trigger element and set the `for` attribute to the trigger's `id`.

```html
<button id="my-button">Hover me</button>
<dw-tooltip for="my-button">I'm a tooltip!</dw-tooltip>

<script type="module">
  import '@dreamworld/dw-tooltip/dw-tooltip.js';
</script>
```

**HTML content inside the tooltip:**

```html
<button id="info-btn">Info</button>
<dw-tooltip for="info-btn">
  <strong>Important:</strong> inline styles work here.
</dw-tooltip>
```

> **Note:** Tippy moves light-DOM content to the `appendTo` target (default: `<body>`). Scoped component CSS will not follow it. Use inline styles for any content-level styling.

---

### API Reference

#### Properties / Attributes

| Property | Attribute | Type | Default | Required | Description |
|---|---|---|---|---|---|
| `for` | `for` | `String` | — | Yes (if `forEl` not set) | `id` of the sibling trigger element. Ignored when `forEl` is set. |
| `forEl` | — | `Object` | — | — | Direct JS reference to the trigger element. Overrides `for`. |
| `trigger` | `trigger` | `String` | `'mouseenter'` | — | Space-separated events that show the tooltip. Possible values: `mouseenter`, `focus`, `click`, `manual`. Use `manual` to control programmatically only. |
| `content` | — | `Object` | — | — | Tooltip content set via JS property. When not set, uses element's `innerHTML` (light DOM). |
| `placement` | `placement` | `String` | `'top'` | — | Placement relative to the trigger. Values: `top`, `bottom`, `left`, `right`, with optional `-start` or `-end` suffix (e.g. `top-start`, `left-end`). |
| `animation` | `animation` | `String` | `'shift-away'` | — | Transition animation. Values: `shift-away`, `shift-toward`, `fade`, `scale`, `perspective`. Corresponding Tippy CSS must be imported. |
| `offset` | `offset` | `Array` | `[0, 0]` | — | `[skidding, distance]` in pixels from the reference element. |
| `theme` | `theme` | `String` | `'material'` | — | Space-separated CSS class names applied to the Tippy box. Corresponding theme CSS must exist at the `appendTo` level (see [Theme](#theme)). |
| `extraOptions` | `extraOptions` | `Object` | — | — | Pass-through object for any [Tippy.js option](https://atomiks.github.io/tippyjs/v6/all-props/). Merged with component-managed options; `extraOptions.hideOnClick` overrides the built-in default. |
| `disabled` | `disabled` | `Boolean` | `false` | — | When `true`, disables the tooltip (it won't show). Can be toggled reactively. |
| `sticky` | `sticky` | `Boolean` | `false` | — | When `true`, enables the Tippy `sticky` plugin — keeps the tooltip aligned with the trigger during scroll/layout changes. |
| `appendTo` | — | `Object` | (global default) | — | DOM element the Tippy box is appended to. Defaults to the value set via `DWTooltip.setAppendTo()`, or `document.body` if not configured. |

> `for` and `forEl` can only be set at initialization time (component is connected to DOM). They are not reactive after `connectedCallback`.

#### Public Methods

| Method | Signature | Description |
|---|---|---|
| `show` | `show(): void` | Show the tooltip programmatically. |
| `hide` | `hide(): void` | Hide the tooltip programmatically. |
| `toggle` | `toggle(): void` | Toggle tooltip visibility. Shows if hidden/unmounted; hides if shown. |
| `setAppendTo` *(static)* | `DWTooltip.setAppendTo(element: HTMLElement): void` | Sets the global default container element for all `<dw-tooltip>` instances. Must be called before tooltips are connected to the DOM. |

#### CSS Custom Properties

Applied to `.tippy-box` via `DWTooltipStyle`:

| CSS Custom Property | Default | Description |
|---|---|---|
| `--dw-tooltip-background-color` | *(none)* | Tooltip background color. |
| `--dw-tooltip-text-color` | `var(--mdc-theme-surface)` | Tooltip text color. |
| `--dw-tooltip-border-radius` | `4px` | Tooltip border radius. |
| `--dw-tooltip-padding` | `8px` | Internal padding of the tooltip box. |

Internal MDC tokens consumed:

| Token | Usage |
|---|---|
| `--mdc-theme-primary-invert-color` | Sets `--mdc-theme-primary` inside `.tippy-box` |
| `--mdc-theme-surface` | Fallback text color |

#### Slots

| Slot | Description |
|---|---|
| *(default)* | HTML content rendered inside the tooltip. Used when `content` property is not set. |

#### Events

No custom events are dispatched by this component. Tooltip state is managed programmatically via `show()`, `hide()`, and `toggle()`.

#### Exported Members

| Export | Type | Description |
|---|---|---|
| `DWTooltip` | `class` | The LitElement class. Registered as `<dw-tooltip>`. |
| `DWTooltipStyle` | `CSSResult` | Exportable `css` literal containing `.tippy-box` styles. Use in other LitElement components to share tooltip styles. |

---

### Configuration Options

#### Global Container

By default, Tippy appends its box to `<body>`. To redirect all tooltips to a specific container:

```js
import { DWTooltip } from '@dreamworld/dw-tooltip/dw-tooltip.js';

// Call before any <dw-tooltip> is connected to the DOM
DWTooltip.setAppendTo(document.querySelector('#tooltip-container'));
```

#### `extraOptions` Pass-through

Any [Tippy.js option](https://atomiks.github.io/tippyjs/v6/all-props/) can be passed through `extraOptions`. Component-managed properties (`content`, `trigger`, `placement`, `animation`, `offset`, `theme`, `sticky`) are applied on top of `extraOptions`.

**`hideOnClick` default behavior:**

| Condition | Default `hideOnClick` |
|---|---|
| `trigger` is `'focus'` | `false` |
| Any other trigger | `true` |

Setting `extraOptions.hideOnClick` explicitly overrides this behavior.

#### Always-Enabled Tippy Plugins

The following Tippy plugins are always registered regardless of configuration:

| Plugin | Activated by |
|---|---|
| `sticky` | `sticky` property set to `true` |
| `followCursor` | Pass `followCursor` option via `extraOptions` |

---

### Advanced Usage

#### Manual Trigger with Programmatic Toggle

```html
<button id="toggle-btn" onclick="document.querySelector('#tip').toggle()">Toggle</button>
<dw-tooltip id="tip" for="toggle-btn" trigger="manual" placement="bottom" animation="shift-away">
  Manually controlled tooltip
</dw-tooltip>
```

#### `extraOptions` — Arrow and `hideOnClick` Override

```html
<button id="my-btn">Click</button>
<dw-tooltip
  for="my-btn"
  trigger="click"
  placement="bottom"
  extraOptions='{"arrow": true, "hideOnClick": false}'
>
  Tooltip with arrow, stays open on click
</dw-tooltip>
```

> When setting `extraOptions` as an HTML attribute, pass valid JSON.

#### Custom Theme

Tippy appends the tooltip to `<body>` (or the `appendTo` element). Theme CSS must be defined at that level — it cannot be scoped to a component.

```html
<style>
  /* Add to <body> or a global stylesheet */
  [data-theme~="tomato"] {
    background-color: tomato;
    color: yellow;
  }
</style>

<button id="themed-btn">Hover</button>
<dw-tooltip for="themed-btn" theme="tomato">Custom themed tooltip</dw-tooltip>
```

#### Composing `DWTooltipStyle` in Another LitElement

```js
import { LitElement, css } from 'lit';
import { DWTooltipStyle } from '@dreamworld/dw-tooltip/dw-tooltip.js';

class MyComponent extends LitElement {
  static get styles() {
    return [
      DWTooltipStyle,
      css`/* component styles */`
    ];
  }
}
```

#### Disable / Enable Tooltip Reactively

```html
<dw-tooltip for="btn" disabled>Hidden tooltip</dw-tooltip>
```

```js
const tip = document.querySelector('dw-tooltip');
tip.disabled = false; // re-enable
```

#### Pointing to an Element by Reference (`forEl`)

```js
import '@dreamworld/dw-tooltip/dw-tooltip.js';

const tip = document.createElement('dw-tooltip');
tip.forEl = document.querySelector('#my-target');
tip.textContent = 'Tooltip via JS reference';
document.body.appendChild(tip);
```

---

## 2. Developer Guide / Architecture

### Architecture Overview

`<dw-tooltip>` follows a thin **Wrapper Pattern** over Tippy.js, surfacing a declarative attribute API as a LitElement web component.

| Design Pattern | Location | Description |
|---|---|---|
| **LitElement Web Component** | `DWTooltip` class | Reactive properties, shadow DOM, lifecycle hooks (`connectedCallback`, `disconnectedCallback`, `updated`). |
| **Tippy.js Wrapper** | `_initializeTippy()` | A single Tippy instance (`_tippyInstance`) is created on `connectedCallback` and destroyed on `disconnectedCallback`. Content updates propagate via `_tippyInstance.setContent()`. |
| **Property Passthrough** | `extraOptions` | Unmanaged Tippy options are forwarded directly, enabling full Tippy API access without property explosion. |
| **Global Configuration (Module-level Singleton)** | `appendToElement` / `setAppendTo()` | A module-scoped variable acts as a shared default for all instances. Set once via the static method. |
| **Style Export / Composition** | `DWTooltipStyle` | The `.tippy-box` CSS block is exported as a `CSSResult` so other LitElement components can incorporate tooltip styles without duplication. |

### Module Entry Point

```
dw-tooltip.js         ← ES module; registers <dw-tooltip> and exports DWTooltip, DWTooltipStyle
```

### Lifecycle

```
connectedCallback()
  └── _initializeTippy()       — resolves trigger el (forEl || sibling[for]), creates Tippy instance

updated(changedProps)
  ├── 'content' changed        → _tippyInstance.setContent()
  └── 'disabled' changed       → _refreshDisabled()

set appendTo(value)            → _tippyInstance.setProps({ appendTo }) if instance exists

disconnectedCallback()
  └── _tippyInstance.destroy()
```

---

## Known Issues

- **`trigger="focus"` on iOS:** `focus` trigger does not work on iOS Safari or Chrome due to platform limitations with focus events on non-input elements.
- **Scoped CSS on light-DOM content:** Tippy moves slotted HTML to the `appendTo` container (default: `<body>`). CSS scoped to the component or a parent shadow root will not apply. Use inline styles on tooltip content nodes.

---

## Development

```bash
# Start dev server with hot reload (opens demo/index.html)
yarn start
```