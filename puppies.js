
// $.ajax( {

//   url: "post",

//   data: {
//       id: 123
//   },

//   type: "GET",

//   // the type of data we expect back
//   dataType : "json",

//   success: function( json ) {

//       // for example, build a post object onto the body
//       $( "<h1/>" ).text( json.title ).appendTo( "body" );
//       $( "<div class=\"content\"/>").html( json.html ).appendTo( "body" );
//   },

  
//   error: function( xhr, status, errorThrown ) {
//       alert( "Sorry, there was a problem!" );
//       console.log( "Error: " + errorThrown );
//       console.log( "Status: " + status );
//       console.dir( xhr );
//   },

//   // Complete callback to run regardless of the outcome
//   complete: function( xhr, status ) {
//       alert( "The request is complete!" );
//   }
// });


// $.get -- GET requests
// $.post -- POST requests
// $.getScript -- retrieve a script
// $.getJSON -- GET request expecting JSON in return

// $.get( url [, data] [, success callback] [, data type] )

// $( "#result" ).load( "ajax/test.html" );

// // With a "complete" callback that fires for each
// // element the AJAX response was inserted into
// $( "#result" ).load( "ajax/test.html", function() {
//   alert( "Load was performed." );
// });


// ajaxStart fires when the very first AJAX request begins (so not for overlapping requests)
// ajaxStop fires when there are no more AJAX requests running
// ajaxSuccess fires whenever any AJAX request succeeds
// ajaxError fires whenever any AJAX request fails
// ajaxComplete fires whenever any AJAX request complete




//jQuery already loaded elsewhere


//here's the revealing module
var Puppies = ( function(){
    // this private variable is the address you always hit up
    var _puppiesPath = "https://ajax-puppies.herokuapp.com/puppies.json";
    var _breedPath = "https://ajax-puppies.herokuapp.com/breeds.json";
    // takes a callback function


    function timeSince(date) {

        var seconds = Math.floor((new Date() - date) / 1000);

        var interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
            return interval + " years";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + " months";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + " days";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + " hours";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + " minutes";
        }
        return Math.floor(seconds) + " seconds";
    }


    function showBreeds(breeds) {
      for (var i = 0; i < breeds.length; i++) {
        $("select").append('<option value="' + breeds[i].id + '">' + 
          breeds[i].name + '</option>');
      }
    }

    function showPuppies(puppies) {
      for (var i = 0; i < puppies.length; i++) {
        $(".puppies-list").append('<li class="puppy'+i+'">' + puppies[i].name + ' (' + puppies[i].breed.name + '),  created ' + puppies[i].created_at + ' ago </li>');

        $('li.puppy'+i).append('<button class="adopt" name="breed_id" value="'+ puppies[i].id + '">Adopt me!</button>')
      }    
    }

    function breedList(){

      $.ajax( {
         url: _breedPath,
         type: 'GET',
         dataType: 'json',
         success: function(json) { 
          showBreeds(json); 
         },
         error: function() { 
           console.log("Got an error"); 
         },
         complete: function() { 
           console.log("Done!"); 
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
           console.log("Got an error"); 
         },
         complete: function() { 
           console.log("Puppies List Done!"); 
         }
      });

    };

    function refresh() {
      $('ul').html("")
      puppiesList();
    }

    function clickRefresh() {
      $('.refresh').click(refresh)
    }

    function createPuppy() {
      $('form').submit(function(event) {
        event.preventDefault();
        var $el = $( event.target );

        var formData = $el.serializeArray();
        formData = ({name: formData[0].value, breed_id: formData[1].value})
        formData = JSON.stringify(formData);

        console.log(formData)

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


    function adoptPuppy() {
      $('.adopt').click(function(e) {
        e.preventDefault();
        console.log("Adopt!!!!!")
      })
    }


    function deletePuppy() {
      $.ajax()
    }


    return {
      puppies: puppiesList,
      breeds: breedList,
      clickRefresh: clickRefresh,
      createPuppy: createPuppy,
      adoptPuppy: adoptPuppy
    };

})();

$(document).ready(function( ){
    Puppies.puppies();
    Puppies.breeds();
    Puppies.clickRefresh();
    Puppies.createPuppy();
    Puppies.adoptPuppy();
});