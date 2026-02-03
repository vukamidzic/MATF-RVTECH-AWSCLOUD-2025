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

    #find {
      color: black;
      box-shadow:10px;
      background-color: white;
      font-family: monospace;
      font-size: 30px;
      text-align: center;
      transform: translate(50%, 0%);
      width: 100px;
    }

    #find:hover {
      background-color: grey;
    }

    #find:active {
      background-color: black;
      color: white;
    }
  </style>
  
  <script lang="ts">
    import { Circle } from 'svelte-loading-spinners';
    import { onMount, onDestroy } from 'svelte';
    import L from 'leaflet';
    import 'leaflet/dist/leaflet.css';

    let map: L.Map | undefined;
    let fetchedData: boolean = $state(false);
    let chargers = $state([])

    onMount(async () => {
      try {
        const response = await fetch("http://localhost:4566/restapis/eumfqsktvc/dev/_user_request_/chargers");
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

      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: #1631b8; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });

      // FIX 2: Added 'const' to the loop
      for (const charger of chargers) {
        L.marker([charger.latitude, charger.longitude], { icon: customIcon })
        .addTo(map)
        .bindPopup(`Charger ID: ${charger.id || 'Unknown'}`);
      }
    };
    
    onDestroy(() => { if (map) map.remove(); });
  </script>

  <h2 id="title">Brew & Bolt</h2>

  {#if fetchedData}
    <div id='map'></div>
    <!-- TODO: Define action (showing cafes near selected charger)  -->
    <!-- TODO: Center button according to map -->
    <button id="find">Show</button>
  {:else}
    <div id="loading">
      <Circle duration="1.5s" size="150" color="#FFFFFF" unit="px" />
    </div>
  {/if}
  
