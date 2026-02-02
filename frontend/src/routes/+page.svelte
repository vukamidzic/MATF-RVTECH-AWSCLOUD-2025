  <style>
    :global(body) {
      display: grid;
      place-content: center; /* Centers horizontally and vertically */
      height: 100vh;
    }
  
    #map {
      width: 900px;
      height: 600px;
      margin: auto;
    }

    #loading {
      margin: auto;
      width: 100px;
      height: 100px;
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
    
      map = L.map('map').setView([44.8125, 20.4612], 13);
    
      // Add a tile layer (otherwise the map will be grey/blank)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(map);
    };

    initMap();
    
    onDestroy(() => { if (map) map.remove(); });
  </script>

  {#if isReady}
    <div id='map'></div>
  {:else}
    <div id="loading"><Circle/></div>
  {/if}
  
