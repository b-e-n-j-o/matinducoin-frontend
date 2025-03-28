import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DeliveryZoneMap = () => {
  useEffect(() => {
    if (L.DomUtil.get('map') !== null) {
      L.DomUtil.get('map')._leaflet_id = null;
    }

    const map = L.map('map').setView([45.5186, -73.605], 13); // Centre sur Montréal

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Polygone d'Outremont
    const outremontCoords = [
      [45.527744, -73.617226],
      [45.515808, -73.590386],
      [45.510402, -73.613155],
      [45.516633, -73.626655]
    ];
    L.polygon(outremontCoords, {
      color: '#FF5900',
      fillColor: '#FF5900',
      fillOpacity: 0.5
    }).addTo(map).bindPopup('Outremont');

    // Ajouter le texte pour Outremont avec un fond #FBD461
    L.marker([45.5166, -73.6100], {
      icon: L.divIcon({
        className: 'label-text', 
        html: `<div style="background-color: #FBD461; color: #FF5900; padding: 5px; border-radius: 5px;">
                 <strong>Outremont</strong>
               </div>`,
        iconSize: [100, 40]
      })
    }).addTo(map);

    // Polygone du Mile End
    const mileEndCoords = [
      [45.525733, -73.612335],
      [45.528319, -73.607056],
      [45.529341, -73.597958],
      [45.522940, -73.583977],
      [45.515904, -73.590794],
      [45.525705, -73.612396]
    ];
    L.polygon(mileEndCoords, {
      color: '#FF5900',
      fillColor: '#FF5900',
      fillOpacity: 0.5
    }).addTo(map).bindPopup('Mile End');

    // Ajouter le texte pour Mile End
    L.marker([45.5245, -73.6000], {
      icon: L.divIcon({
        className: 'label-text', 
        html: `<div style="background-color: #FBD461; color: #FF5900; padding: 5px; border-radius: 5px;">
                 <strong>Mile End</strong>
               </div>`,
        iconSize: [100, 40]
      })
    }).addTo(map);

    // Polygone du Plateau Mont-Royal
    const plateauCoords = [
      [45.508403, -73.571306],
      [45.516821, -73.589315],
      [45.522925, -73.583835],
      [45.529249, -73.597918],
      [45.538320, -73.586321],
      [45.520158, -73.547134],
      [45.509669, -73.550546],
      [45.516885, -73.567477],
      [45.508412, -73.571269]
    ];
    L.polygon(plateauCoords, {
      color: '#FF5900',
      fillColor: '#FF5900',
      fillOpacity: 0.5
    }).addTo(map).bindPopup('Plateau Mont-Royal');

    // Ajouter le texte pour Plateau Mont-Royal
    L.marker([45.5200, -73.5800], {
      icon: L.divIcon({
        className: 'label-text', 
        html: `<div style="background-color: #FBD461; color: #FF5900; padding: 5px; border-radius: 5px;">
                 <strong>Plateau Mont-Royal</strong>
               </div>`,
        iconSize: [150, 40]
      })
    }).addTo(map);

    // Ajouter le texte pour Laurier
    L.marker([45.530935, -73.586112], {
      icon: L.divIcon({
        className: 'label-text',
        html: `<div style="background-color: #FBD461; color: #FF5900; padding: 5px; border-radius: 5px;">
                 <strong>Laurier</strong>
               </div>`,
        iconSize: [100, 40]
      })
    }).addTo(map);

    // Ajouter le texte pour Le Village
    L.marker([45.521196, -73.557801], {
      icon: L.divIcon({
        className: 'label-text',
        html: `<div style="background-color: #FBD461; color: #FF5900; padding: 5px; border-radius: 5px;">
                 <strong>Le Village</strong>
               </div>`,
        iconSize: [100, 40]
      })
    }).addTo(map);

  }, []);

  return (
    <div id="map" style={{ height: '600px', width: '100%' }}></div>
  );
};

export default DeliveryZoneMap;
