/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, css, unsafeCSS } from '@dreamworld/pwa-helpers/lit.js';
import tippy, {sticky} from 'tippy.js'
import { caption } from '@dreamworld/material-styles/typography-literals.js';

let appendToElement;

export const DWTooltipStyle = css`
  background-color : var(--dw-tooltip-background-color);
  color : var(--dw-tooltip-text-color, var(--mdc-theme-surface));
  border-radius: var(--dw-tooltip-border-radius, 4px);
  padding: var(--dw-tooltip-padding, 8px);
  ${unsafeCSS(caption)};
`;

export class DWTooltip extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: none;
        }
      `
    ];
  }

  static get properties() {
    return {
      /*
       * Input property
       * The id of the element that the tooltip is anchored to. This element must be a sibling of the tooltip. 
       * Ignore when `forEl` proeprty is defined
       */
      for: { type: String },

      /**
       * Input property
       * Javascritp element. `for` property will be ignored if this property has value.
       */
      forEl: { type: Object },

      /**
       * Input property
       * The events (each separated by a space) which cause a tippy to show. 
       * Possible values:  "mouseenter", "focus",  "click", "manual". 
       * Use  "manual" to only trigger the tippy programmatically.
       * Default value - 'mouseenter'
       */
      trigger: { type: String },

      /**
       * Input property.
       * When content is not provided as a property, shows light-doms in tooltip.
       */
      content: { type: Object },

      /**
       * Input property
       * Positions the tippy relative to its reference element. 
       * Use the suffix -start or -end to shift the tippy to the start or end of the reference element, instead of centering it. 
       * For example, "top-start" or  "left-end".
       * Default value - 'top'
       */
      placement: { type: String },

      /**
       * Input property
       * The type of transition animation. 
       * Possible values:  "shift-away",  "shift-toward", "fade",  "scale", "perspective".
       * Default value - 'shift-away'
       */
      animation: { type: String },

      /**
       * Input property
       * How far in pixels the tippy element is from the reference element.
       * Default value - [0, 0]
       */
      offset: { type: Array },

      /*
       * Themes added as classes (each separated by a space) to the tippy element's  classList
       */
      theme : { type: String },

      /**
       * Extra options to be passed to Tippy.js
       */
      extraOptions: { type: Object },

      /**
       * When you want to temporarily disable this tooltip, se to `true`.
       */
      disabled: { type: Boolean },

      /**
       * When you want tip sticky with trigger el, se to `true`.
       * See additional details here: https://atomiks.github.io/tippyjs/v6/all-props/#sticky
       */
      sticky: { type: Boolean },

      /**
       * The element where tooltip is append. 
       */
      appendTo: { type: Object}
    }
  }

  set appendTo(value) {
    let oldValue = this.__layout;
    
    if (oldValue === value) {
      return;
    }

    if(value && this._tippyInstance) {
      this._tippyInstance.setProps({
        appendTo: value,
      });
    }
    
    this._appendTo = value;
    this.requestUpdate('appendTo', oldValue);
  }

  get appendTo() {
    return this._appendTo;
  }

  render() {
    return html`
      <slot ></slot>
    `
  }

  constructor(){
    super();
    this.trigger = 'mouseenter';
    this.placement = 'top';
    this.animation = 'shift-away';
    this.offset = [0, 0];
    this.theme = 'material';
    this.disabled = false;
    this.sticky = false;
  }
  
  connectedCallback(){
    super.connectedCallback && super.connectedCallback();
    this._initializeTippy();
  }

  disconnectedCallback(){
    super.disconnectedCallback();
    if(this._tippyInstance){
      this._tippyInstance.destroy();
    }
  }

  /**
   * initialize tippy.
   */
  _initializeTippy(){
    let elTrigger;
    let elContent = this.content || this.innerHTML;
    if(this.forEl) {
      elTrigger = this.forEl;
    }else {
      let previousElementSibling = this.previousElementSibling;
      let nextElementSibling = this.nextElementSibling;
  
      if((previousElementSibling.id == this.for) || (nextElementSibling.id == this.for)){
        elTrigger = previousElementSibling;
      }
    }
    
    if(!elTrigger){
      throw new Error('Trigger element is not found');
    }

    let hideOnClick = this.extraOptions && this.extraOptions.hideOnClick;

    // This is added for the backward compatibility
    if(!Object(this.extraOptions).hasOwnProperty('hideOnClick')){
      hideOnClick = this.trigger === 'focus' ? false : true;
    }
    
    let tippyOptions = {
      ...this.extraOptions,
      allowHTML: true,
      sticky: this.sticky,
      content: elContent,
      trigger: this.trigger,
      placement: this.placement,
      animation: this.animation,
      offset: this.offset,
      theme: this.theme,
      hideOnClick: hideOnClick,
      plugins: [sticky],
      appendTo: this.appendTo ? this.appendTo : appendToElement
    };
    this._tippyInstance = tippy(elTrigger, tippyOptions);
    this.disabled  && this._refreshDisabled();
  }

  /*
   * Shows the tooltip programatically
   */
  show(){
    this._tippyInstance.show();
  }

  /*
   * Hides the tooltip programatically
   */
  hide(){
    this._tippyInstance.hide();
  }

  /*
   * hide and show tooltip programatically.
   */
  toggle(){
    let tippyInstance = this._tippyInstance;
    
    if(tippyInstance && tippyInstance.state){
      if(!tippyInstance.state.isShown && !tippyInstance.state.isMounted){
        this.show();
        return;
      }
      
      this.hide();
    }
  }

  update(changedProps) {
    if (changedProps.has('content')) {
      this._tippyInstance && this._tippyInstance.setContent(this.content);
    }
    super.update(changedProps);
  }
  
  updated(changedProprs){
    if(changedProprs.has('disabled')){
      this._refreshDisabled();
    }
  }
  
  /*
   * disabled and eanbled tooltip
   */
  _refreshDisabled(){
    if(!this._tippyInstance){
      return;
    }
    
    this.disabled ? this._tippyInstance.disable(): this._tippyInstance.enable();
  }

  /**
   * It's used to append tooltip into the specified element.
   * @param {Object} element 
   */
  static setAppendTo(element) {
    appendToElement = element;
  }  
}

customElements.define('dw-tooltip', DWTooltip);
