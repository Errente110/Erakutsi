var data_id = '1B-Uigj19FLkV6cBQdfhxXeYW8rMRjEA_yCgSiYVu-tk', 
  map_id = 'ruben.gmkbh9l9',
  markerLayer,
  features,
  features_summary,
  interaction,
  layer = mapbox.layer().id(map_id),
  map = mapbox.map('map', layer, null, [easey_handlers.DragHandler()]),
  a_tipo_incidente = [],
  a_cantidad_type = [],
  a_cantjanuary = [],
  a_cantfebruary = [],
  a_cantmarch = [],
  a_cantapril = [],
  a_cantmay = [],
  a_cantjune = [],
  a_cantjuly = [],
  a_cantaugust = [],
  a_cantseptember = [],
  a_cantoctober = [],
  a_cantnovember = [],
  a_cantdecember = [],
  monthNames = [
    'Urtarrila-Enero',
    'Otsaila-Febrero',
    'Martxoa-Marzo',
    'Apirila-Abril',
    'Maiatza-Mayo',
    'Ekaina-Junio',
    'uztaila-Julio',
    'Abuztua-Agosto',
    'Iraila-Septiembre',
    'Urria-Octubre',
    'Azaroa-Noviembre',
    'Abendua-Diciembre'
  ];

mmg_google_docs_spreadsheet_1(data_id, mapData);
map.centerzoom({
  lat: 43.31263,
  lon: -1.90213
}, 16);
map.setZoomRange(0, 20);
map.ui.attribution.add().content('<a href="http://mapbox.com/about/maps">Terms &amp; Feedback</a>');

// Build map
function mapData(f) {
  features = f;
  markerLayer = mapbox.markers.layer().features(features);
  //center markers layer
  markerLayer.factory(function(m) {
    // Create a marker using the simplestyle factory
    var elem = mapbox.markers.simplestyle_factory(m);
    // Add function that centers marker on click
    MM.addEvent(elem, 'click', function(e) {
      map.ease.location({
        lat: m.geometry.coordinates[1],
        lon: m.geometry.coordinates[0]
      }).zoom(map.zoom()).optimal();
    });
    return elem;
  });

  interaction = mapbox.markers.interaction(markerLayer);
  map.addLayer(markerLayer);
  map.ui.zoomer.add();
  map.ui.zoombox.add();

  interaction.formatter(function(feature) {
    var o = '<h3>' + feature.properties.title + '</h3>' +
      '<p>' + feature.properties.description + '</p>' +
      '<p><strong> Fecha :</strong> ' + feature.properties.date.replace('Fecha: ', "") + ' ' + feature.properties.hour.replace('Hora: ', "") + '</p>';
    return o;
  });

  fmonth(features);
  //out url for download  data
  download_data();
}

function newMarker() {
  if (window.location.hash == '#new') {
    $('#new').fadeIn('slow');
    window.location.hash = '';
    window.setTimeout(function() {
      $('#new').fadeOut('slow');
    }, 4000);
  }
}

// fmonth is function that, creating a dinamics dates, in the wiev
function fmonth(f) {
  //array aMonth for take moths from JSON
  var aMonth = [];
  // array de que se genera de la fecha
  var aDate = [];
  var parent = document.getElementById('months');

  //take only month from date in googlespretsheet dd/MM/yyyy
  _.each(f, function(value, key) {
    aDate = f[key].properties.date.split("/");
    aMonth.push(aDate[1]); //push month in array aMoth
  });

  aMonth = _.chain(aMonth)
    .uniq()
    .compact()
    .value();

  aMonth = aMonth.sort();
  //create a tag "li" and  "a" with "id=aMonth[i]" for menu month in the view
  for (var i = 0; i < aMonth.length ; i++) {
    var new_li = document.createElement('li');
    new_li.innerHTML = '<a href= \'#\'  id=\'' + aMonth[i] + '\' > ' + monthNames[aMonth[i] - 1] + '</a>';
    parent.appendChild(new_li);
  }
}

//Get data from spreadsheet "resumen"
mmg_google_docs_spreadsheet_2(data_id, statisticData);

//function get all data from spreadsheet
function statisticData(f) {
  features_summary = f;

  _.each(f, function(value, key) {
    a_tipo_incidente.push(f[key].properties.tipo_incidente);
    a_cantidad_type.push(f[key].properties.cantidad_type);
    a_cantjanuary.push(f[key].properties.cantjanuary);
    a_cantfebruary.push(f[key].properties.cantfebruary);
    a_cantmarch.push(f[key].properties.cantmarch);
    a_cantapril.push(f[key].properties.cantapril);
    a_cantmay.push(f[key].properties.cantmay);
    a_cantjune.push(f[key].properties.cantjune);
    a_cantjuly.push(f[key].properties.cantjuly);
    a_cantaugust.push(f[key].properties.cantaugust);
    a_cantseptember.push(f[key].properties.cantseptember);
    a_cantoctober.push(f[key].properties.cantoctober);
    a_cantnovember.push(f[key].properties.cantnovember);
    a_cantdecember.push(f[key].properties.cantdecember);

  });
}

//call the  fuction from  google chart API,  for create main statistic box
google.load('visualization', '1', {
  packages: ['corechart']
});
google.setOnLoadCallback(draw_main_box);

//function for draw the main statistic box
function draw_main_box() {
  var data = new google.visualization.DataTable(),
    options = {
      backgroundColor: 'transparent',
      colors: ['#CB3334', '#FFCC33', '#653332', '#CC6633', '#666535', '#263c94']
    },
    chart = new google.visualization.PieChart(document.getElementById('img_total_percentage'));

  data.addColumn('string', 'Incidencias');
  data.addColumn('number', 'Porcentaje');
  data.addRows([
    [a_tipo_incidente[0], parseInt(a_cantidad_type[0], 10)],
    [a_tipo_incidente[1], parseInt(a_cantidad_type[1], 10)],
    [a_tipo_incidente[2], parseInt(a_cantidad_type[2], 10)],
    [a_tipo_incidente[3], parseInt(a_cantidad_type[3], 10)],
    [a_tipo_incidente[4], parseInt(a_cantidad_type[4], 10)],
    [a_tipo_incidente[5], parseInt(a_cantidad_type[5], 10)]
  ]);

  chart.draw(data, options);


  //put the  total number incident on the view
  $('#num-incident0').html(a_tipo_incidente[0] +' : ' + a_cantidad_type[0]);
  $('#num-incident1').html(a_tipo_incidente[1] +' : ' + a_cantidad_type[1]);
  $('#num-incident2').html(a_tipo_incidente[2] +' : ' + a_cantidad_type[2]);
  $('#num-incident3').html(a_tipo_incidente[3] +' : ' + a_cantidad_type[3]);
  $('#num-incident4').html(a_tipo_incidente[4] +' : ' + a_cantidad_type[4]);
  $('#num-incident5').html(a_tipo_incidente[5] +' : ' + a_cantidad_type[5]);
  $('#num-incident6').html('Gertakari Guztira / Total de incidentes : ' + a_cantidad_type[6]);
}

//function to draw line for  all incidents
function drawIncidents() {
  var data = google.visualization.arrayToDataTable([]);
  var options = {
    title: 'GRAFICO DE LINEA DEL TOTAL DE INCIDENCIAS',
    hAxis: {
      title: 'Meses',
      titleTextStyle: {
        color: '#404040'
      },
      textStyle: {
        color: '#404040',
        fontSize: 13
      }
    },
    vAxis: {
      title: 'Cantidad',
      titleTextStyle: {
        color: '#404040'
      }
    },
    gridlines: {
      color: '#404040',
      count: 4
    },
    backgroundColor: 'transparent'
  };
  var chart = new google.visualization.LineChart(document.getElementById('all_incident_type_statistic'));

  data.addColumn('string', 'Mes');
  data.addColumn('number', 'Total');
  data.addRows([
    ['Urtarrila-Enero', a_cantjanuary[6]],
    ['Otsaila-Febrero', a_cantfebruary[6]],
    ['Martxoa-Marzo', a_cantmarch[6]],
    ['Apirila-Abril', a_cantapril[6]],
    ['Maiatza-Mayo', a_cantmay[6]],
    ['Ekaina-Junio', a_cantjune[6]],
    ['Uztaila-Julio', a_cantjuly[6]],
    ['Abuztua-Agosto', a_cantaugust[6]],
    ['Iraila-Septiembre', a_cantseptember[6]],
    ['Urria-Octubre', a_cantoctober[6]],
    ['Azaroa-Noviembre', a_cantnovember[6]],
    ['Abendua-Diciembre', a_cantdecember[6]]
  ]);

  chart.draw(data, options);
}

//function to draw  line by type of incidents
function draw_type_incedent(id_x, i) {
  var data = google.visualization.arrayToDataTable([]);
  var options = {
    title: ' GRAFICO DE LINEA DE TIPO DE INCIDENCIA - ' + id_x.replace('_statistic', "").replace('_', " ").replace('_', " ").toUpperCase(),
    hAxis: {
      title: 'Meses',
      titleTextStyle: {
        color: '#404040'
      },
      textStyle: {
        color: '#404040',
        fontSize: 11
      }
    },
    vAxis: {
      title: 'Cantidad',
      titleTextStyle: {
        color: '#404040'
      }
    },
    gridlines: {
      color: '#404040',
      count: 4
    },
    backgroundColor: 'transparent'
  };
  var chart = new google.visualization.LineChart(document.getElementById(id_x));

  data.addColumn('string', 'Mes');
  data.addColumn('number', 'Cantidad');
  data.addRows([
    ['Urtarrila-Enero', a_cantjanuary[i]],
    ['Otsaila-Febrero', a_cantfebruary[i]],
    ['Martxoa-Marzo', a_cantmarch[i]],
    ['Apirila-Abril', a_cantapril[i]],
    ['Maiatza-Mayo', a_cantmay[i]],
    ['Ekaina-Junio', a_cantjune[i]],
    ['Uztaila-Julio', a_cantjuly[i]],
    ['Abuztua-Agosto', a_cantaugust[i]],
    ['Iraila-Septiembre', a_cantseptember[i]],
    ['Urria-Octubre', a_cantoctober[i]],
    ['Azaroa-Noviembre', a_cantnovember[i]]
    ['Abendua-Diciembre', a_cantdecember[i]]  
  ]);
  chart.draw(data, options);
}

//function for put href  for download data
function download_data() {
  $('#download_csv').attr('href', 'https://docs.google.com/a/developmentseed.org/spreadsheet/pub?key=' + data_id + '&output=csv');
  $('#download_josn').attr('href', 'https://spreadsheets.google.com/feeds/list/' + data_id + '/1/public/values?alt=json-in-script');
}

function indicateMenuIncident() {
  var show_text = '',
    type_incident = $('#' + $('#masthead ul li').find('.active').attr('id')).text(),
    month_incident = $('#' + $('#month ul li').find('.active').attr('id')).text();

  if (type_incident === 'Mostrar Todos' && month_incident == 'Todos') {
    $('#indicate_menu').html('<p>Todos los incidentes registrados </p>');
  } else if (type_incident !== 'Mostrar Todos' && month_incident == 'Todos') {
    $('#indicate_menu').html('<p>' + type_incident + ' de todos los meses</p>');
  } else {
    if (type_incident === 'Mostrar Todos') {
      type_incident = 'Todos los Incidentes';
    }
    if (month_incident === 'Todos') {
      month_incident = 'Todos los Meses';
    }
    $('#indicate_menu').html('<p>' + type_incident + ' del Mes ' + month_incident + '</p>');
  }
}

$(document).ready(function() {

  var $headerMenu = $('#masthead ul li'),
    $monthMenu = $('#months');

  // get event click on menu month
  $monthMenu.on('click', 'a', function(e) {

    var id_event_month = e.target.id;
    //centralizing the map
    map.ease.location({
      lat: 43.31263,
      lon: -1.90213
    }).zoom(16).optimal();

    //check if click is on all incidents
    if (id_event_month === 'all_incident_month') {
      //renove all active class
      $monthMenu.find('a').removeClass('active');
      //put in here the active clas
      $('#' + id_event_month).addClass('active');
      indicateMenuIncident();

      if ($headerMenu.find('.active').attr('id') !== 'all_incident_type') {
        markerLayer.filter(function(features) {
          if (features.properties.title.replace(/\s/g, '_') === $headerMenu.find('.active').attr('id')) return true;
        });
      } else {
        markerLayer.filter(function(features) {
          // Returning true for all markers shows everything.
          return true;
        });
      }

    } else {
      // Check if on menu type incident is active option "Todos Incidentes" with id=all_incident_type
      if ($headerMenu.find('.active').attr('id') === 'all_incident_type') {
        $monthMenu.find('a').removeClass('active');
        $('#' + id_event_month).addClass('active');
        indicateMenuIncident();
        //here classified by date all incidente
        markerLayer.filter(function(features) {
          //create arraydate and this get month from data JSON
          var arraydate = features.properties.date.split("/");

          if (arraydate[1] === id_event_month) return true;
        });
      } else {
        $monthMenu.find('a').removeClass('active');
        $('#' + id_event_month).addClass('active');
        indicateMenuIncident();
        //here classified by date and by type of incidente
        markerLayer.filter(function(features) {
          var arraydate = features.properties.date.split('/');
          //conditional double .. incident type and date
          if (arraydate[1] === e.target.id && features.properties.title.replace(/\s/g, '_') === $headerMenu.find('.active').attr('id')) return true;
        });
      }
    }
    return false;
  });

  // Dropdown: Graphic
  $('#arrow_show_block').click(function(e) {
    $('.statistic_by_month, #close_block_stac').show();

    var activeMenu = $headerMenu.find('.active').attr('id') || 'all_incident_type';

    // Check on menu type incident is active for show  and draw line for box static all incident
    if (activeMenu === 'all_incident_type') {
      // Call the function from google chart API, for create line statistic for all incident
      $('.statistic_by_month').attr('id', 'all_incident_type_statistic');
      drawIncidents();
      google.setOnLoadCallback(drawIncidents);

    } else {
      // Here get on menu type incident which is active for draw an show
      var name_active_tipe = $headerMenu.find('.active').attr('data-layer') - 1;

      // Call the function from google chart API, for create line statistic for type incident
      draw_type_incedent(activeMenu + '_statistic', name_active_tipe);
      google.setOnLoadCallback(draw_type_incedent);
    }
    // Close other block information
    $('.block_inf_type').css('display', 'none');
    $('#close_block_inf').css('display', 'none');

    return false;
  });

  // get event click on menu type incident
  $headerMenu.find('a').click(function(e) {

    if ($(this).hasClass('views')) return;

    var id_event_type = e.target.id;

    //centralizing the map
    map.ease.location({
      lat: 43.31263,
      lon: -1.90213
    }).zoom(16).optimal();

    //check is is active on menu type "Mostrar Todos "
    if (id_event_type === 'all_incident_type') {
      $headerMenu.find('a').removeClass('active');
      $('#' + id_event_type).addClass('active');
      indicateMenuIncident();

      //check to enable block where statistics show a month
      if ($('.close_block_stac').css('display') === 'block') { //esto estyo comentando
        $('.statistic_by_month').attr('id', 'all_incident_type_statistic');
        //draw the graphics statistic
        drawIncidents();
        google.setOnLoadCallback(drawIncidents);
      }

      if ($monthMenu.find('.active').attr('id') !== 'all_incident_month') {
        markerLayer.filter(function(features) {
          var arraydate = features.properties.date.split('/');
          //here classified by type of incidente and  by date (month)
          if (arraydate[1] == $monthMenu.find('.active').attr('id')) return true;
        });

      } else {
        markerLayer.filter(function(features) {
          // Returning true for all markers shows everything.
          return true;
        });
      }

    } else {
      //check if is active in menu month "Todos"
      if ($monthMenu.find('.active').attr('id') == "all_incident_month") {
        $headerMenu.find('a').removeClass('active');
        $('#' + id_event_type).addClass('active');
        indicateMenuIncident();

        markerLayer.filter(function(features) {
          // replace the blanks with subindent and compared with the ID
          if (features.properties.title.replace(/\s/g, '_') === id_event_type) return true;
        });

      } else {
        $headerMenu.find('a').removeClass('active');
        $('#' + id_event_type).addClass('active');
        indicateMenuIncident();

        markerLayer.filter(function(features) {
          var arraydate = features.properties.date.split('/');
          //here classified by type of incidente and  by date (month)
          if (features.properties.title.replace(/\s/g, '_') === id_event_type && arraydate[1] == $monthMenu.find('.active').attr('id')) return true;
        });
      }

      // check to enable block where statistics show a month
      if ($('#close_block_stac').css('display') === 'block') {
        $('.statistic_by_month').css('display', 'block');
        //hide box  close in statistic
        $("#close_block_stac").show();
      } else {
        $('.statistic_by_month').css('display', 'none');
        $('#close_block_stac').hide();
      }

      //agrega una id para mostrar la imagen ejem id=Robo_statistic
      $('.statistic_by_month').attr('id', id_event_type + '_statistic');

      //obtiene el atributo de name , is important for to show what data we want to show
      var number_name = $('#' + id_event_type).attr('data-layer') -1;
      //draw the graphics statistic by type of incident
      draw_type_incedent(id_event_type + '_statistic', number_name);
      google.setOnLoadCallback(draw_type_incedent);
    }

    return false;
  });

  $('a[href="#opendata"]').click(function(e) {
    $('#backdrop').fadeIn(200);
    $('#opendata, #close').show();
    return false;
  });

  $('a[href="#howto"]').click(function(e) {
    $('#backdrop').fadeIn(200);
    $('#howto, #close').show();
    return false;
  });

  $('#close').click(function(e) {
    $('#backdrop').fadeOut(200);
    $('#opendata, #howto, #close').hide();
    return false;
  });

  $('#arrow_block_inf').click(function(e) {
    $('.block_inf_type').css('display', 'block');
    $('#close_block_inf').show();

    //close other block static
    $('.statistic_by_month').css('display', 'none');
    $('#close_block_stac').css('display', 'none');
    return false;
  });

  $('#close_block_inf').click(function(e) {
    $('.zoomer').show();
    $('.block_inf_type').hide();
    $('#close_block_inf').hide();
    return false;
  });

  //get the click fro close block statistic line
  $('#close_block_stac').click(function() {
    $(this).hide();
    $('.statistic_by_month').css('display', 'none');
    $('#arrow_show_block').css('display', 'block');
  });
});