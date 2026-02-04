  <style>
    :global(body) {
      display: grid;
      align-content: start;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background: radial-gradient(circle at center, #70440a 40%, #d4d4d4 100%);
      background-attachment: fixed;
    }
    
    .main-container {
      display: flex;
      flex-direction: row;
      align-items: center; /* Vertical center */
      justify-content: center; /* Horizontal center */
      gap: 40px; /* Space between images and map */
      margin-top: 20px;
    }
    
    #map {
      width: 900px;
      height: 600px;
      margin: auto;
      border: 2px dashed black;
      border-radius: 20px;
    }

    #left-side-image, #right-side-image {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      opacity: 0.8;
      pointer-events: none; /* Allows clicking "through" images if they overlap */
    }

    #left-side-image {
      width: 350px;
      left: 25px; /* Distance from left edge */
    }

    #right-side-image {
      width: 400px;
      right: 25px; /* Distance from right edge */
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
    // predefined until better logic implemented
    let gatewayID = "tqqisptzzc";
    import { Circle } from 'svelte-loading-spinners';
    import { onMount, onDestroy } from 'svelte';
    import L from 'leaflet';
    import 'leaflet/dist/leaflet.css';

    let map: L.Map | undefined;
    let fetchedData: boolean = $state(false);
    let chargers = $state([]);
    let cafeMarkers: L.Marker[] = $state([]);

    onMount(async () => {
      try {
        const response = await fetch(`http://localhost:4566/restapis/${gatewayID}/dev/_user_request_/chargers`);
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
        const chargerPopupContent = `
          <strong>${charger.title.toUpperCase()}</strong><br>
          ${charger.addressLine1 || ''} 
          ${charger.addressLine1 && charger.addressLine2 ? '/' : ''} 
          ${charger.addressLine2 || ''}
          `.trim();
          
        const marker = L.marker([charger.latitude, charger.longitude], { icon: chargerIcon })
        .addTo(map)
        .bindPopup(chargerPopupContent, {
          autoClose: false,
          closeOnClick: false
        });

        marker.on('click', () => {
          if (marker.showingCafes) {
            cafeMarkers.forEach(m => m.remove());
            cafeMarkers = [];
            marker.showingCafes = false;
            return;
          }

          cafeMarkers.forEach(m => m.remove());
        
          let latlng = marker.getLatLng();
          fetch(`http://localhost:4566/restapis/${gatewayID}/dev/_user_request_/cafes?lat=${latlng.lat}&lng=${latlng.lng}`)
          .then(response => response.json())
          .then(data => {
            marker.showingCafes = true;
            for (const cafe of data.cafes) {
              const lat = cafe.lat;
              const lng = cafe.lon;
              
              let coffeeIcon = L.icon({
                iconUrl: "/icons/coffee.png",
                iconSize: [25, 25],
                iconAnchor: [12.5, 25],
                popupAnchor: [0, -25]
              });

              const cafePopupContent = `
                <strong>${cafe.name}</strong><br>
                ${cafe.address_line1 || ''} 
                ${cafe.address_line1 && charger.address_line2 ? '/' : ''} 
                ${cafe.address_line2 || ''}
              `.trim();
            
              const cafeMarker = L.marker([lat, lng], { icon: coffeeIcon, zIndexOffset: 1000 })
              .addTo(map)
              .bindPopup(cafePopupContent);
              cafeMarkers.push(cafeMarker);
            }
          });
        });

        marker.on('popupclose', () => {
          cafeMarkers.forEach(m => m.remove());
          cafeMarkers = [];
        })
      }     
    };
    
    onDestroy(() => { if (map) map.remove(); });
  </script>

  <h2 id="title">Brew & Bolt</h2>

<div class="main-container">
  <img src="/icons/electric_logo.png" id="left-side-image" alt="Coffee Logo" />
  
  {#if fetchedData}
    <div id="map"></div>
  {:else}
    <div id="loading">
      <Circle duration="1.5s" size="150" color="#FFFFFF" unit="px" />
    </div>
  {/if}

  <img src="/icons/coffee_logo.png" id="right-side-image" alt="Charger Logo" />
</div>  
