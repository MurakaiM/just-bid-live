$( e => $('.ui.fluid.search.selection.dropdown').dropdown() )

function setUpElements(key) {
    const stripe = Stripe(key);
    const elements = stripe.elements();

    const card = elements.create('card', {
      style: {
        base: {
          iconColor: '#a5a4a4',
          color: 'rgba(0, 0, 0, 0.87)',
          lineHeight: '38px',
          fontWeight: 300,
          fontFamily: '"Work Sans", sans-serif',
          fontSize: '1em',

          '::placeholder': {
            color: '#cecece',
          },
        },
      }
    });
    card.mount('#card-element');


    const form = document.getElementById('payment-form');
    const fields = {
      colors:{
        identifier: 'color',
        rules: [{
          type: 'empty',
          prompt: 'Please choose available color'
        }]
      },
      firstName: {
        identifier: 'shipping[first-name]',
        rules: [{
          type: 'empty',
          prompt: 'Please enter your first name'
        }]
      },
      lastName: {
        identifier: 'shipping[last-name]',
        rules: [{
          type: 'empty',
          prompt: 'Please enter your last name'
        }]
      },
      address: {
        identifier: 'shipping[address]',
        rules: [{
          type: 'empty',
          prompt: 'Please enter your shipping address.'
        }]
      },
      city: {
        identifier: 'shipping[city]',
        rules: [{
          type: 'empty',
          prompt: 'Please enter city'
        }]
      },
      code: {
        identifier: 'shipping[code]',
        rules: [{
          type: 'empty',
          prompt: 'Please enter ZIP(postal) code'
        }]
      },
      country: {
        identifier: 'shipping[country]',
        rules: [{
          type: 'empty',
          prompt: 'Please select your country'
        }]
      },
      phone: {
        identifier: 'phone',
        rules: [{
          type: 'phone',
          prompt: 'Please enter valid phone'
        }]
      }
    }
    
    if($("#sizes")){
      fields['size'] = {
        identifier: 'size',
        rules: [{
          type: 'empty',
          prompt: 'Please choose availavle size'
        }]
      }
    }

    const semForm = $(form).form({
      on: 'blur',
      inline: true,
      fields
    });
    const errorElement = semForm.find('.ui.error p');

    const stripeSourceHandler = (source) => {
      const hiddenInputs = [document.createElement('input'), document.createElement('input')];
      hiddenInputs[0].setAttribute('type', 'hidden');
      hiddenInputs[0].setAttribute('name', 'stripeSource');
      hiddenInputs[0].setAttribute('value', source.id);

      hiddenInputs[1].setAttribute('type', 'hidden');
      hiddenInputs[1].setAttribute('name', 'stripeSecure');
      hiddenInputs[1].setAttribute('value', source.card.three_d_secure);

      hiddenInputs.forEach(e => form.append(e))
      form.submit();
    }

    form.addEventListener('submit', async(event) => {
      event.preventDefault();
      
      if(!semForm.form('is valid')){        
        return;
      }

      semForm.removeClass('error');
      semForm.addClass('loading');

      const {
        source,
        error
      } = await stripe.createSource(card);

      if (error) {
        semForm.removeClass('loading')
        semForm.addClass('error')
        errorElement.text(error.message);
      } else {
        stripeSourceHandler(source);
      }
    });
}

function setUpSelection(id) {
  POST('/user/product/type', {
      id
    })
    .then(result => setUpByData($('#payment-form'), result.data))
    .catch(e => console.log(e));
}

function setUpByData(form, data) {
  let types = {};
  data.forEach(e => types[e.typeId] = e.inStock);
  selection(types)
  form.removeClass('loading')
}

function selection(types) {
  const colors = $("#colors");
  const sizes = $("#sizes");
  const shape = $('.ui.text.shape').shape();
  

  if (!sizes) {
    colors.find('.item').each((i, e) => doneColor(e, colors))
    return;
  }
 
  let val = $(colors.find('.item')[0]).data('value');
 
  sizes.dropdown();
  colors.dropdown('set selected', val)
  colors.dropdown({
    onChange: value => recSelection(value, sizes)
  });
  disableTypes(val,sizes);

  function recSelection(value, dropChange) {
    shape.shape('set next side', `#${value}`).shape('flip over')
    sizes.dropdown('clear')
    dropChange.find(`.item.available`).removeClass('disabled')
    disableTypes(value,dropChange)
  }

  function disableItem(key, origin, dropChange) {
    if (types[key] > 0) {
      return;
    }

    let id = key.replace(origin, '').replace('|', '');
    dropChange.find(`.item.available[data-value="${id}"]`).addClass('disabled')
  }

  function disableTypes(value,dropChange){
    Object.keys(types).forEach(key => (key.indexOf(value) > -1) ? disableItem(key, value, dropChange) : null)
  }
}


function doneColor(elem, types) {
  elem = $(elem);
  let typeId = elem.attr('value');

  if (types[typeId] == 0)
    elem.addClass('disabled')
}