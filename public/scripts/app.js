/*
 * @license
 * Pecesform App
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License
 */
'use strict';


function reiniciar() {
  deleteLocal();
  alert('Enviado a la base de datos');

  window.location.reload(1);
}

function sendButtonFunction(callback) {
  
  console.log('Saved in database');
  var database = firebase.database();
  // Get a key for a new Post.
  // var newPostKey = firebase.database().ref().child('posts').push().key;
  var newPostKey = database.ref().child('posts').push().key;

  var $form = $("#signup-form");
  var data = getFormData($form);

  console.log(data);
  console.log(newPostKey);
  // firebase.database().ref('forms/' + newPostKey).set(data);
  // database.ref('forms/' + newPostKey).set(data);
  firebase.database().ref('forms/' + newPostKey).set(data, function(error) {
    if (error) {
      alert('Error al guardar en la base de datos');
    } else {
      reiniciar();
    }
  });

  // callback();

}

function getFormData($form){

  var unindexed_array = $form.serializeArray();
  var indexed_array = {};
  $.map(unindexed_array, function(n, i){
      indexed_array[n['name']] = n['value'];
  });

  return indexed_array;
}

function saveLocalButtonFunction() {

  console.log('Saved local');
  var data = JSON.stringify($("#signup-form").serializeArray());
  localStorage.setItem('data', data);

}

function deleteLocal() {
  var myStorage= JSON.parse(localStorage.getItem('data'));

  for (i = 0; i < myStorage.length; i++){
    if(document.getElementById(myStorage[i].name) != null){
      document.getElementById(myStorage[i].name).value=  '';
    }
  }
  console.log('Delete local');
  localStorage.setItem('data', '');
  document.get

}

function getLocalData() {

  console.log('Get local');
  if(localStorage.getItem('data') != '' & localStorage.getItem('data') != null){
    var myStorage= JSON.parse(localStorage.getItem('data'));
    for (i = 0; i < myStorage.length; i++){
      if(document.getElementById(myStorage[i].name) != null){
        document.getElementById(myStorage[i].name).value=  myStorage[i].value;
      }
    }
  }
}



function getLocation() {
  var center = map.getCenter();
  document.getElementById('latitud').value=  center.lat;
  document.getElementById('longitud').value=  center.lng;
  marker.setLngLat([ center.lng, center.lat]);

}

function onDragEnd() {
  var lngLat = marker.getLngLat();

  document.getElementById('latitud').value=  lngLat.lat;
  document.getElementById('longitud').value=  lngLat.lng;
}


/**
 * 
 * renders the initial data.
 */
function init() {

  // Set up the event handlers for all of the buttons.
  // document.getElementById('position').addEventListener('click', getLocation);

  //get offline data
  getLocalData();

}

mapboxgl.accessToken = 'pk.eyJ1IjoicGVjZXNhcHAiLCJhIjoiY2tjYXgzczB0MW40ZTJzcWU0ZnFuNm5vbyJ9.VfwNIG-_Y9v824ufGNVmeQ';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-96, 37.8],
});
map.addControl(new mapboxgl.NavigationControl());
var geolocate = new mapboxgl.GeolocateControl({
  positionOptions: {
  enableHighAccuracy: true
  },
  trackUserLocation: true,
  showAccuracyCircle: false
  });
map.addControl(geolocate);
var marker = new mapboxgl.Marker({
  draggable: true
  })
  .setLngLat([-96, 37.8])
  .addTo(map);
marker.on('dragend', onDragEnd);
geolocate.on('geolocate', getLocation);
init();
