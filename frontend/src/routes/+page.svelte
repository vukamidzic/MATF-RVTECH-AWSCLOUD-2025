
  <script>
    import { onMount, onDestroy } from 'svelte';
    import L from 'leaflet';
    import 'leaflet/dist/leaflet.css';

    let map;

    onMount(async () => {
      map = L.map('map').setView([44.8125, 20.4612], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      L.marker([44.8125, 20.4612]).addTo(map);
    });

    onDestroy(() => {
      if (map) map.remove();
    });
  </script>

  <div id='map'></div>
  <style>
    #map {
      width: 900px;
      height: 600px;
      margin: auto;
    }
  </style>
