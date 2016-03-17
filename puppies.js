var Puppies = ( function(){
  var _puppiesPath = "https://ajax-puppies.herokuapp.com/puppies.json";
  var _breedPath = "https://ajax-puppies.herokuapp.com/breeds.json";
  var errors = [];

  /////////////////////// AJAX CALLS /////////////////////////

  function breedList(){
    $.ajax( {
       url: _breedPath,
       type: 'GET',
       dataType: 'json',
       success: function(json) { 
         showBreeds(json); 
       },
       error: function() { 
         genericError()
       }
   });
  }

  function puppiesList() {
    $.ajax( {
       url: _puppiesPath,
       type: 'GET',
       dataType: 'json',
       success: function(json) { 
          showPuppies(json); 
       },
       error: function() { 
          genericError()
       }
    });

  };


  function createPuppy() {
    $('form').submit(function(event) {
      if ($('input[name="name"]').val().length < 1) {
        errors.push("Puppy Name is required to be present")
      }

      event.preventDefault();
      var $el = $( event.target );
      var formData = $el.serializeArray();
      formData = ({name: formData[0].value, breed_id: formData[1].value})
      formData = JSON.stringify(formData);

      $.ajax({
        url: _puppiesPath,
        type: "POST",
        data: formData,
        contentType: "application/json",
        dataType: "json",
        success: function() { refresh() }
      })
    })
  }


  function deletePuppy(id) {
    $.ajax({
      url: "https://ajax-puppies.herokuapp.com/puppies/"+ parseInt(id) +".json",
      type: "DELETE",
      success: function() { 
        alert("Congratulations, you have a new puppy!")
        refresh(); 
      }
    })
  }


  function genericError() {
    alert("Sorry, there was an error")
  }



  /////////////////////// POPULATE DOM /////////////////////////

  function showBreeds(breeds) {
    for (var i = 0; i < breeds.length; i++) {
      $("select").append('<option value="' + breeds[i].id + '">' + 
        breeds[i].name + '</option>');
    }
  }

  function showPuppies(puppies) {
    for (var i = 0; i < puppies.length; i++) {
      $(".puppies-list").append('<li class="puppy'+i+'">' + puppies[i].name + ' (' + puppies[i].breed.name + '),  created at ' + puppies[i].created_at.slice(0,19) + ' </li>');

      $('li.puppy'+i).append('<button class="adopt" name="id" value="'+ puppies[i].id + '">Adopt me!</button>')
    }    
  }


  function refresh() {
    $('ul').html("")
    puppiesList();
  }

  function clickRefresh() {
    $('.refresh').click(refresh)
  }


  function adoptPuppy() {
    $('.puppies-list').on("click", ".adopt", (function(e) {
      e.preventDefault();
      deletePuppy(e.target.value);
    })
    )
  }



  /////////////////////// MESSAGES /////////////////////////

  function startRequest() {
    $( document ).ajaxStart(function() {
      $( ".log" ).text( "Waiting...." );

      if ($('.log').text === "Waiting....") {
        setTimeout(function() {
             $( ".log" ).empty();
             $( ".log" ).text( "Still Waiting..." );
           }, 1000);
        }
     });
  }  

  function completedRequest() {
    $(document).ajaxComplete(function() {
      $(".log").empty();
    })
  }

 function successfulRequest() {
    $(document).ajaxSuccess(function() {
      $( ".log" ).empty();
      $( ".log" ).text( "Finished!" );
     });
  }  

 function erroredRequest() {
    $(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
      $( ".log" ).empty();
      $( ".log" ).text( "Failed. Errors were:.." + errors);
     });
  }  



  return {
    puppies: puppiesList,
    breeds: breedList,
    clickRefresh: clickRefresh,
    createPuppy: createPuppy,
    adoptPuppy: adoptPuppy,
    startRequest: startRequest,
    successfulRequest: successfulRequest,
    erroredRequest: erroredRequest
  };

})();

$(document).ready(function( ){
    Puppies.puppies();
    Puppies.breeds();
    Puppies.clickRefresh();
    Puppies.createPuppy();
    Puppies.adoptPuppy();
    Puppies.startRequest();
    Puppies.successfulRequest();
    Puppies.erroredRequest();
});