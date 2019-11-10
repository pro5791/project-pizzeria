/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  class Product{
    constructor(id, data){
      const thisProduct = this;
      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initOrderForm();
      thisProduct.processOrder();
      thisProduct.initAccordion();

      //console.log('constructor-new Product:', thisProduct);
    }

    renderInMenu(){
      const thisProduct = this;

      /* generate HTML based on template */
      const generatedHTML = templates.menuProduct(thisProduct.data);

      /* create element using utils.createElementFromHTML */
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);

      /* find menu container */
      const menuContainer = document.querySelector(select.containerOf.menu);
      //console.log('menuContainer:', menuContainer);

      /* add element to menu */
      menuContainer.appendChild(thisProduct.element);
    }

    getElements(){
      const thisProduct = this;

      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);

      //console.log('thisProduct: ', thisProduct);
    }

    initAccordion(){
      const thisProduct = this;
      //console.log('initAccordion-thisProduct:', thisProduct);

      /* find the clickable trigger (the element that should react to clicking) */
      //const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      //console.log('clickableTrigger: ', clickableTrigger);

      /* START: click event listener to trigger */
      thisProduct.accordionTrigger.addEventListener('click', function(event){
        //console.log('clicked', event);

        /* prevent default action for event */
        event.preventDefault();

        /* toggle active class on element of thisProduct */
        thisProduct.element.classList.toggle('active');

        /* find all active products */
        const allActiveProducts = document.querySelectorAll('.product.active');

        /* START LOOP: for each active product */
        for (let activeProduct of allActiveProducts){

          /* START: if the active product isn't the element of thisProduct */
          if (thisProduct.element != activeProduct){
            /* remove class active for the active product */
            activeProduct.classList.remove('active');
            /* END: if the active product isn't the element of thisProduct */
          }
          /* END LOOP: for each active product */
        }
        /* END: click event listener to trigger */
      });
    }

    initOrderForm(){
      const thisProduct = this;

      thisProduct.form.addEventListener('submit', function(event) {
        event.preventDefault();
        thisProduct.processOrder();
      });

      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function() {
          thisProduct.processOrder();
        });
      }

      thisProduct.cartButton.addEventListener('click', function(event) {
        event.preventDefault();
        thisProduct.processOrder();
      });

      console.log('initOrderForm-thisProduct: ', thisProduct);
    }

    processOrder(){
      const thisProduct = this;
      console.log('processOrder-thisProduct: ', thisProduct);

      /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('formData: ', formData);

      /* set variable price to equal thisProduct.data.price */
      let price = thisProduct.data.price;
      console.log('price: ', price);

      /* START LOOP: for each paramId in thisProduct.data.params */
      for(let paramId in thisProduct.data.params){
        console.log(paramId);
        console.log('paramId: ' ,paramId);

        /* save the element in thisProduct.data.params with key paramId as const param */
        const param = thisProduct.data.params[paramId];
        console.log('param: ' ,param);

        /* START LOOP: for each optionId in param.options */
        for(let optionId in param.options){
          const option = param.options[optionId];
          console.log('option: ' ,option);

          /* save the element in param.options with key optionId as const option */
          const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
          console.log('optionSelected: ' ,optionSelected);

          const images = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);
          console.log('images: ', images);

          /* START IF: if option is selected and option is not default */
          if(optionSelected && !option.default){
            /* add price of option to variable price */
            price += option.price;
          /* END IF: if option is selected and option is not default */
          }
          /* START ELSE IF: if option is not selected and option is default */
          else if (!optionSelected && option.default) {
            /* deduct price of option from price */
            price -= option.price;
            /* END ELSE IF: if option is not selected and option is default */
          }

          /* START IF: if option is selected */
          if(optionSelected){
            for(let image of images){
              image.classList.add(classNames.menuProduct.imageVisible);
            }
            /* END IF: if option is selected */
          }
          /* START ELSE IF: if option is selected */
          else {
              for(let image of images){
                image.classList.remove(classNames.menuProduct.imageVisible);
              }
          /* END ELSE IF: if option is selected */
          }
        /* END LOOP: for each optionId in param.options */
        }
      /* END LOOP: for each paramId in thisProduct.data.params */
      }
    /* set the contents of thisProduct.priceElem to be the value of variable price */
    thisProduct.priceElem = price;
    }
  }

  const app = {
    initMenu: function(){
      const thisApp = this;
      //console.log('initMenu-thisApp.data:', thisApp.data);

      for(let productData in thisApp.data.products){
        new Product(productData,thisApp.data.products[productData]);
      }
    },

    initData: function(){
      const thisApp = this;
      thisApp.data = dataSource;
    },

    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('init-thisApp:', thisApp);
      console.log('init-classNames:', classNames);
      console.log('init-settings:', settings);
      console.log('init-templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
    },
  };

  app.init();
}
