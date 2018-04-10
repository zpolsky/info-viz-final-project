let map;
const schools = [
  {
    name: 'WashU',
    center: {lat: 38.6488, lng: -90.3108},
    measurements: {
      GPA: 4.0,
      gradRate: 90
    }
  },
  {
    name: 'Everly',
    center: {lat: 38.6554, lng: -90.2967},
    measurements: {
      GPA: 3.0,
      gradRate: 20
    }
  },
  {
    name: 'Test',
    center: {lat: 38.7, lng: -90.2967},
    measurements: {
      GPA: 1.0,
      gradRate: 70
    }
  },
];
let circles = []; // array to track circles added to map so they can be removed by reference
const selectedSchools = new Set();

function createCircle(school, tooltip) {
  const attributes = {
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillOpacity: 0.35,
    map,
    center: school.center,
    radius: 3 * 100
  };

  if (!selectedSchools.has(school)) {
    attributes.strokeColor = '#FF0000';
    attributes.fillColor = '#FF0000';
  } else {
    attributes.strokeColor = '#0000FF';
    attributes.fillColor = '#0000FF';
  }
  const circle = new google.maps.Circle(attributes);

  google.maps.event.addListener(circle, 'click', event => {
    if (!selectedSchools.has(school)) {
      selectedSchools.add(school);
    } else {
      selectedSchools.delete(school);
    }
    loadCircles();
    createHeatMap(selectedSchools)
  });

  google.maps.event.addListener(circle, 'mouseover', event => {
    tooltip.transition()
      .duration(200)
      .style('opacity', 0.9);
    tooltip.text(`${school.name}`)
      .style('left', (event.Fa.clientX) + 'px')
      .style('top', (event.Fa.clientY - 28) + 'px');
  });

  google.maps.event.addListener(circle, 'mouseout', event => {
    tooltip.transition()
      .duration(200)
      .style('opacity', 0);
  });
  return circle;
}

function loadCircles() {
  d3.select('#tooltip').remove();
  const tooltip = d3.select('#mapContainer')
      .append('div')
      .attr('id', 'tooltip')
      .attr('class', 'tooltip')
      .style('opacity', 0);

  for (let i in circles) {
    circles[i].setMap(null);
  }
  circles = schools.map(school => {
    return createCircle(school, tooltip);
  });
  //loadUI();
}

function loadUI() {
  d3.select('#allSchoolsOutput').remove();
  const allSchoolsOutput = d3.select('#mapContainer')
      .append('div')
      .attr('id', 'allSchoolsOutput')
      .attr('class', 'map-output');

  allSchoolsOutput.html(() => {
    let text = `
      <h4><b>All Schools:</b></h4>
      <ul>
    `;
    schools.forEach(school => {
      text += `<li>${school.name}</li>`;
    });
    text += '</ul>';
    return text;
  });

  d3.select('#selectedSchoolsOutput').remove();
  const selectedSchoolsOutput = d3.select('#mapContainer')
      .append('div')
      .attr('id', 'selectedSchoolsOutput')
      .attr('class', 'map-output');

  selectedSchoolsOutput.html(() => {
    let text = `
      <h4><b>Selected Schools:</b></h4>
      <ul>
    `;
    selectedSchools.forEach(school => {
      text += `<li>${school.name}</li>`;
    });
    text += '</ul>';
    return text;
  });
}

function initMap() {
  const coords = {lat: 38.6270, lng: -90.1994}; // St. Louis coords
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: coords
  });
  loadCircles();
  // Adapted from https://bl.ocks.org/mbostock/899711
  // const overlay = new google.maps.OverlayView();
  //
  // overlay.onAdd = () => {
  //   const layer = d3.select(this.getPanes().overlayLayer)
  //       .append('div')
  //       .attr('class', 'stations');
  //
  //   overlay.draw = () => {
  //     const projection = this.getProjection(),
  //           padding = 10;
  //
  //     const marker = layer.selectAll('svg')
  //         .data(d3.entries(schools))
  //         .each(transform)
  //         .enter()
  //         .append('svg')
  //         .each(transform)
  //         .attr('class', 'marker');
  //
  //     marker.append('circle')
  //         .attr('r', 3)
  //         .attr('cx', padding)
  //         .attr('cy', padding);
  //
  //     function transform(d) {
  //       d = new google.maps.LatLng(d.value[1], d.value[0]);
  //       d = projection.fromLatLngToDivPixel(d);
  //       return d3.select(this)
  //           .style('left', (d.x - padding) + 'px')
  //           .style('top', (d.y - padding) + 'px');
  //     }
  //   }
  // };
}


window.onload = initMap;
