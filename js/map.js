export function initMap() {
  const uluru = { lat: 43.372800, lng: -79.7622000 };
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 17,
    center: uluru
  });
  new google.maps.Marker({ position: uluru, map });
}
