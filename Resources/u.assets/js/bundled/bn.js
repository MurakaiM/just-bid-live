var mobile_nav;
var mobile_button;


$(function () {
  initComponents();
  initSearch();

  setTriggers();

  /*
    $('.ui .stock').popup({
        inline     : true,
        hoverable  : true,
        position   : 'bottom left',
        delay: {
          show: 300,
          hide: 300
        }
      });
    */

});

function initComponents() {
  mobile_nav = $(".mobile_nav");
  mobile_button = $("#mobile_button");
}

function setTriggers() {
  mobile_button.click(() => menuButton());
}

function menuButton() {
  mobile_nav.toggleClass("opened");
  mobile_button.toggleClass("rotated");
}


function initSearch() {
  var content = [{
      title: 'Horse',
      description: 'An Animal'
    },
    {
      title: 'Cow',
      description: 'Another Animal'
    }
  ];


  $('.ui.search').search({
    minCharacters: 3,
    duration: 500,
    apiSettings: {
      onResponse: function (resp) {
        var response = {
          results: []
        };

        $.each(resp.data, function (index, item) {
          var maxResults = 8;

          if (index >= maxResults)
            return false;


          response.results.push({
            title: item.prTitle,
            description: item.prDescription.length > 160 ? (item.prDescription.substring(0, 157) + "...") : item.prDescription,
            url: `/product/id${item.prUid}`,
            image: item.prTypes.colors[Object.keys(item.prTypes.colors)[0]].image
          });

        });
        return response;
      },
      url: '/user/products/search={query}'
    }
  })
}