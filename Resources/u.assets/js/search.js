$(function () {
  var content = [
      {
        title: 'Horse',
        description: 'An Animal'
      },
      {
        title: 'Cow',
        description: 'Another Animal'
      }
    ];


  $('.ui.search').search({   
    minCharacters : 3,    
    duration : 500,
    apiSettings   : {
      onResponse: function(resp) { 
        var response = {
            results : []
        };
   
        $.each(resp.data, function(index, item) {
          var maxResults = 8;

          if(index >= maxResults) 
            return false;
                 
                 
          response.results.push({
            title       : item.prTitle,
            description : item.prDescription.length >  160 ? (item.prDescription.substring(0,157)+"...") : item.prDescription,
            url         : `/product/id${item.prUid}`,
            image       : item.prTypes.colors[Object.keys(item.prTypes.colors)[0]].image
          });
          
        });
        return response;
      },
      url: '/user/products/search={query}'
    }
  })
;


});
