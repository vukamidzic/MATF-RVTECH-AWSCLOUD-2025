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
    import { onDestroy, tick } from 'svelte';
    import L from 'leaflet';
    import 'leaflet/dist/leaflet.css';

    let map: L.Map | undefined;
    let isReady: boolean = $state(false);
    const initMap = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      isReady = true;
    
      // Wait for Svelte to render the <div id="map">
      await tick(); 

      // Point to Belgrade
      map = L.map('map').setView([44.8125, 20.4612], 13);
    
      // Add a tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(map);
    };

    initMap();
    
    onDestroy(() => { if (map) map.remove(); });
  </script>

  <h2 id="title">Brew & Bolt</h2>

  {#if isReady}
    <div id='map'></div>
    <!-- TODO: Define action (showing cafes near selected charger)  -->
    <!-- TODO: Center button according to map -->
    <button id="find">Show</button>
  {:else}
    <div id="loading">
      <Circle duration="1.5s" size="150" color="#FFFFFF" unit="px" />
    </div>
  {/if}
  
