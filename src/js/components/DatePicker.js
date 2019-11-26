/* eslint-disable linebreak-style */
/* eslint-disable no-undef */

import {select, settings} from '../settings.js';
import {utils} from '../utils.js';
import BaseWidget from './BaseWidget.js';

class DatePicker extends BaseWidget{
  constructor(wrapper){
    super(wrapper, utils.dateToStr(new Date()));
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);

    thisWidget.initPlugin();
  }

  initPlugin(){
    const thisWidget = this;

    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);

    flatpickr(thisWidget.dom.input, {
      defaultDate: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      disable: [
        function(date) {
          return (date.getDay() === 1);
        }
      ],
      locale: {
        firstDayOfWeek: 1
      },
      onChange: function(selectedDates, dateStr) {
        thisWidget.value = dateStr;
      },
    });
  }

  initPlugin() {
    const thisWidget = this;
  }

  isValid() {
    return true;
  }

  renderValue() {
    return null;
  }
}

export default DatePicker;
