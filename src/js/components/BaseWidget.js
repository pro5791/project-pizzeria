import {settings} from "../settings";

class BaseWidget{
  constructor(wrapperElement, initialValue){
    const thisWidget = this;

    thisWidget.dom - {};
    thisWidget.dom.wrapper = wrapperElement;

    thisWidget.value = initialValue;
  }

  setValue(value){
    const thisWidget = this;

    const newValue = thisWidget.parseInt(value);

    if(newValue != thisWidget.value && thisWidget.isVallid(newValue){
      thisWidget.value = newValue;
      thisWidget.announce();
    }

    thisWidget.renderValue();
  }

  parseValue(value){
    return parseInt(value);
  }

  isVallid(value){
    return !isNaN(value)
  }
}



export default BaseWidget;
