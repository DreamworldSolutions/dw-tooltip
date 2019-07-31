/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, css, LitElement } from 'lit-element';
import tippy from 'tippy.js'

/**
  * Behaviors
  * - This element is needs to display tooltip
  * - Tooltip is shown in below four cases
  *   - "mouseenter", "focus",  "click", "manual". 
  * - To override theme of tooltip set theme property and set css in body.
  * - eg if your theme is 'tomato' then css is like that,
  *  .tippy-tooltip.tomato-theme {
        background-color: tomato;
        color: yellow;
      }

      .tippy-tooltip.tomato-theme[data-animatefill] {
        background-color: transparent;
      }

      .tippy-tooltip.tomato-theme .tippy-backdrop {
        background-color: tomato;
      }
    
  * Usage pattern
  *   <dw-tooltip for="" trigger="" placement="" animation="" offset=""></dw-tooltip>
  */

class dwTooltip extends LitElement {
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
       * The id of the element that the tooltip is anchored to. This element must be a sibling of the tooltip. 
       */
      for: { type: String },

      /**
       * Input property
       * The events (each separated by a space) which cause a tippy to show. 
       * Possible values:  "mouseenter", "focus",  "click", "manual". 
       * Use  "manual" to only trigger the tippy programmatically.
       * Default value - 'mouseenter'
       */
      trigger: { type: String },

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
       * Possible values:  "shift-away",  "shift-toward", "fade",  "scale", "perspective
       * Default value - 'shift-away'
       */
      animation: { type: String },

      /**
       * Input property
       * How far in pixels the tippy element is from the reference element.
       * Default value - 0
       */
      offset: { type: Number },

      /*
       * Themes added as classes (each separated by a space) to the tippy element's  classList
       */
      theme : { type: String },

      /**
       * The Tippy instance is an individual tooltip object.
       */
      _tippyInstance: { type: Object }
    }
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
    this.offset = 0;
    this.theme = 'dark';
  }

  firstUpdated(){
    let elTrigger;
    let elContent = this.innerHTML;
    let previousElementSibling = this.previousElementSibling;
    let nextElementSibling = this.nextElementSibling;

    if((previousElementSibling.id == this.for) || (nextElementSibling.id == this.for)){
      elTrigger = previousElementSibling;
    }

    if(!elTrigger){
      throw new Error('Trigger element is not found');
    }

    this._tippyInstance = tippy(elTrigger, {
      content: elContent,
      trigger: this.trigger,
      placement: this.placement,
      animation: this.animation,
      distance: this.offset,
      theme: this.theme
    })
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
}

window.customElements.define('dw-tooltip', dwTooltip);
