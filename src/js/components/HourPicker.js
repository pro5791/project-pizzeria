/* eslint-disable linebreak-style */
/* eslint-disable no-undef */

import {select, settings} from '../settings.js';
import {utils} from '../utils.js';
import BaseWidget from './BaseWidget.js';

class HourPicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, settings.hours.open);
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);

    thisWidget.initPlugin();
    thisWidget.value = thisWidget.dom.input.value;
  }

  initPlugin() {
    const thisWidget = this;

    rangeSlider.create(thisWidget.dom.input);

    thisWidget.dom.input.addEventListeners('input', function() {
      thisWidget.value = thisWidget.dom.input.value;
    });
  }

  parseValue() {
    return utils.numberToHour(value);
  }

  isValid() {
    return true;
  }

  renderValue(value) {
    const thisWidget = this;
    thisWidget.dom.output = thisWidget.value;
}

export default HourPicker;
