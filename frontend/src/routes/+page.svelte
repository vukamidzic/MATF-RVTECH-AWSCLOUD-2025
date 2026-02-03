  <style>
    :global(body) {
      display: grid;
      align-content: start;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background: radial-gradient(circle at center, #1631b8 40%, #d4d4d4 100%);
      background-attachment: fixed;
    }
  
    #map {
      width: 900px;
      height: 600px;
      margin: auto;
      border: 4px dashed black;
    }

    #loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%); 
      width: 100px;
      height: 100px;
    }

    #title {
      color: white;
      font-size: 75px;
      font-family: 'Courier New', Courier, monospace;
      text-align: center;
      margin-top: -10;
    }
  </style>
  
  <script lang="ts">
    import { Circle } from 'svelte-loading-spinners';
    import { onMount, onDestroy } from 'svelte';
    import L from 'leaflet';
    import 'leaflet/dist/leaflet.css';

    let map: L.Map | undefined;
    let fetchedData: boolean = $state(false);
    let chargers = $state([]);
    let cafes = $state([]);

    onMount(async () => {
      try {
        const response = await fetch("http://localhost:4566/restapis/sgwa972qvg/dev/_user_request_/chargers");
        const data = await response.json();
        chargers = data.chargers;
        fetchedData = true; 
      
        // Wait for Svelte to render the #map div after fetchedData becomes true
        setTimeout(() => { initMap(); }, 0);
      } catch (e) {
        console.error("Failed to fetch chargers", e);
      }
    });
      
    const initMap = async () => {
      map = L.map('map').setView([44.8125, 20.4612], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(map);

      var chargerIcon = L.icon({
        iconUrl: "/icons/charger.png",
        iconSize: [25, 25],
        iconAnchor: [12.5, 25],
        popupAnchor: [0, -25]
      });

      for (const charger of chargers) {
        const popupContent = `
          <strong>${charger.title.toUpperCase()}</strong><br>
          ${charger.addressLine1 || ''} 
          ${charger.addressLine1 && charger.addressLine2 ? '/' : ''} 
          ${charger.addressLine2 || ''}
          `.trim();
          
        const marker = L.marker([charger.latitude, charger.longitude], { icon: chargerIcon })
        .addTo(map)
        .bindPopup(popupContent);

        marker.on('click', () => {
          let latlng = marker.getLatLng();
          fetch(`http://localhost:4566/restapis/sgwa972qvg/dev/_user_request_/cafes?lat=${latlng.lat}&lng=${latlng.lng}`)
          .then(response => response.json())
          .then(data => {
            for (const cafe of data.cafes) {
              const lat = cafe.lat;
              const lng = cafe.lon;
              
              let coffeeIcon = L.icon({
                iconUrl: "/icons/coffee.png",
                iconSize: [25, 25],
                iconAnchor: [12.5, 25],
                popupAnchor: [0, -25]
              });
            
              L.marker([lat, lng], { icon: coffeeIcon, zIndexOffset: 1000 })
              .addTo(map)
              .bindPopup(`<strong>${cafe.name}</strong>`.trim())
              .openPopup();
            }
          });
        });
      }     
    };
    
    onDestroy(() => { if (map) map.remove(); });
  </script>

  <h2 id="title">Brew & Bolt</h2>

  {#if fetchedData}
    <div id='map'></div>
  {:else}
    <div id="loading">
      <Circle duration="1.5s" size="150" color="#FFFFFF" unit="px" />
    </div>
  {/if}
  
