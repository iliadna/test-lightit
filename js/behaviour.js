//Ajax request to receive user data
$.ajax({
  url: 'https://randomuser.me/api/?results=42',
  dataType: 'json',
  success: function(data) {
    var female = 0;
    var male = 0;
    var numusers = data.results.length;
//Building the userlist
    for (var i=0; i<numusers; i++) {
      $('<div class="container-fluid main-info" data-toggle="collapse" data-parent="#accordion">' +
          '<div class="user row" >' +
            '<div class="col-sm-1">' +
              '<img class="thumb" src=' + data.results[i].picture.thumbnail + '>' +
            '</div>' +
            '<div class="col-sm-2">' +
              '<p class="lasttname">' + capitalise(data.results[i].name.last) + '</p>' +
            '</div>' +
            '<div class="col-sm-2">' +
              '<p class="firstname">' + capitalise(data.results[i].name.first) + '</p>' +
            '</div>' +
            '<div class="col-sm-2">' +
              '<p class="username">' + data.results[i].login.username + '</p>' +
            '</div>' +
            '<div class="col-sm-2">' +
              '<p class="phone">' + data.results[i].phone + '</p>' +
            '</div>' +
            '<div class="col-sm-2">' +
              '<p class="location">' + data.results[i].location.city + '</p>' +
            '</div>' +
            '<div class="col-sm-1">' +
              '<i class="fa opened-status fa-3x"></i>' +
            '</div>' +
          '</div>' +
//Adding a detail user info
          '<div class="container detail-info collapse">' +
            '<div class="gender">' +
              '<span class="name">' + capitalise(data.results[i].name.first) + ' </span>' +
//Checking a user gender to provide corresponding icon and also cointing number of
//men and women for percentage later in a chart
              '<i class="fa ' + (data.results[i].gender == "female" ? (female++, "fa-female") : (male++, "fa-male")) + ' fa-2x"></i>' +
            '</div>' +
            '<div class="row data">' +
              '<div class="col-sm-3">' +
                '<ul>' +
                  '<li><b>Username</b> ' + data.results[i].login.username + '</li>' +
                  '<li><b>Registered</b> ' + data.results[i].registered.slice(0,10) + '</li>' +
                  '<li><b>Email</b> ' + data.results[i].email + '</li>' +
                '</ul>' +
              '</div>' +
              '<div class="col-sm-3">' +
                '<ul>' +
                  '<li><b>Address</b> ' + data.results[i].location.street + '</li>' +
                  '<li><b>City</b> ' + data.results[i].location.city + '</li>'+
                  '<li><b>Zip Code</b> ' + data.results[i].location.postcode + '</li>' +
                '</ul>' +
              '</div>'+
              '<div class="col-sm-3">' +
                '<ul>'+
                  '<li><b>Birthday</b> ' + data.results[i].dob.slice(0,10) + '</li>' +
                  '<li><b>Phone</b> ' + data.results[i].phone + '</li>' +
                  '<li><b>Cell</b> ' + data.results[i].cell + '</li>' +
                '</ul>' +
              '</div>' +
              '<div class="col-sm-3">' +
                '<img class="avatar" src=' + data.results[i].picture.large + '>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>'
  ).appendTo($(".userlist"));
  }
//Building the chart
  var dataset = [
        { name: 'Male', percent: Math.round((male/numusers*100) * 10) / 10 },
        { name: 'Female', percent: Math.round((female/numusers*100) * 10) / 10 }
    ];
    var pie = d3.layout.pie()
        .value(function(d){return d.percent})
        .sort(null);
    var width = 350, height = 350;
    var outerRadius = (width-2)/2;
    var color = d3.scale.ordinal()
        .range(['#808080','#99ff99']);
    var arc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(outerRadius);
    var svg = d3.select("#chartArea")
        .append("svg")
        .attr({
            width:width,
            height:height,
            class:'shadow'
        }).append('g')
        .attr({transform:'translate('+width/2+','+height/2+')'});
    var path=svg.selectAll('path')
        .data(pie(dataset))
        .enter()
        .append('path')
        .attr({
            d:arc,
            fill:function(d,i){
                return color(i);
            }
        })
        .style({
            stroke: function(d,i){
                return color(i);
            },
            'stroke-width': '2px'
        });
    var text=svg.selectAll('text')
        .data(pie(dataset))
        .enter()
        .append("text")
        .attr("transform", function (d) {
            return "translate(" + arc.centroid(d) + ")";
        })
        .attr("text-anchor", "middle")
        .text(function(d){
            return d.data.name+": "+d.data.percent+"%" ;
        })
        .style({
            'font-size':'18px',
        });
  }
});
//Function to capitalise the first letter
function capitalise(str) {
  return str.charAt(0).toUpperCase() + str.substr(1);
};
//Function to search for users by first name
function findNames() {
  var input = document.getElementById("searchStr");
  var filter = input.value.toUpperCase();
  var div = document.getElementById("accordion");
  var item = document.getElementsByClassName("main-info");
  var value;
  for (var i=0; i<item.length; i++) {
    value = item[i].getElementsByClassName("firstname");
    if (value[0]) {
      if (value[0].innerHTML.toUpperCase().indexOf(filter) > -1) {
        item[i].style.display = "";
    } else {
        item[i].style.display = "none";
    }
  }
}
};
//Popup window
var modal = document.getElementById('modalWindow');
var button = document.getElementById("showChart");
var span = document.getElementsByClassName("close")[0];
button.onclick = function() {
    modal.style.display = "block";
}
span.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
//Accordion on click
var onClick = function() {
  $('.main-info').click(function() {
    $(this).siblings('.opened').removeClass('opened');
    $(this).toggleClass('opened');
    $(this).parent().find('.collapse.in').collapse("toggle");
    $(this).closest('.main-info').find('.collapse').collapse("toggle");
  });
};
$(document).ajaxComplete(onClick);
