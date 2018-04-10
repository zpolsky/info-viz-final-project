function rgb(r, g, b) {
  return 'rgb(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ')';
}

function getColor(masterList, schoolValue) {
  // const r = convertRange(schoolValue, masterList.min, masterList.max, 44, 215);
  // const g = convertRange(schoolValue, masterList.min, masterList.max, 123, 25);
  // const b = convertRange(schoolValue, masterList.min, masterList.max, 182, 28);
  const b = convertRange(schoolValue, masterList.min, masterList.max, 182, 28);
  // return rgb(r, g, b);
  return rgb(0, 0, b);
}

// Adapted from https://stackoverflow.com/questions/5649803/remap-or-map-function-in-javascript
function convertRange(value, origMin, origMax, newMin, newMax) {
  return newMin + (newMax - newMin) * (value - origMin) / (origMax - origMin);
}

function createHeatMap(schools) {
  d3.select('#heatmap').remove();

  const width = 500;
  const height = 500;

  const heatMapSVG = d3.select('#mapContainer')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('id', 'heatmap')
      .attr('class', 'map-output');

  const boxWidth = 100;
  const boxHeight = 25;
  let x = boxWidth * 0.9;
  let y = boxHeight * 1.5;

  let minGPA = Infinity;
  let minGradRate = Infinity;

  schools.forEach(school => {
    minGPA = Math.min(school.measurements.GPA, minGPA);
    minGradRate = Math.min(school.measurements.gradRate, minGradRate);
  });

  const allMeasurements = {
    GPA: {
      name: 'GPA',
      max: 4.0,
      // min: minGPA
      min: 0
      //min: d3.min(schools, d => { return d.measurements.GPA; })

    },
    gradRate: {
      name: 'Grad Rate',
      max: 100,
      // min: minGradRate
      min: 0
      //min: d3.min(schools, d => { return d.measurements.gradRate; })
    },
  };

  const heatMapLabels = heatMapSVG.append('g');
  const heatMapBoxes = heatMapSVG.append('g');

  for (let measure in allMeasurements) {
    heatMapLabels.append('text')
        .attr('x', () => {
          return x;
        })
        .attr('y', () => {
          y += boxHeight
          return y;
        })
        .attr('dy','0.35em')
        .attr('text-anchor', 'end')
        .text(() => {
          return allMeasurements[measure].name;
        });
  }

  x = 0;
  y = 0;

  schools.forEach(school => {
    x += boxWidth;
    y = boxHeight;

    heatMapLabels.append('text')
        .attr('x', () => {
          return x;
        })
        .attr('y', () => {
          return y;
        })
        .attr('dy','0.35em')
        .attr('text-anchor', 'center')
        .text(() => {
          return school.name;
        });

    for (let measure in school.measurements) {
      heatMapBoxes.append('rect')
          .attr('x', () => {
            return x;
          })
          .attr('y', () => {
            y += boxHeight;
            return y;
          })
          .attr('width', boxWidth)
          .attr('height', boxHeight)
          .attr('stroke', 'black')
          .attr('stroke-width', 0.5)
          .style('fill', () => {
            return getColor(allMeasurements[measure], school.measurements[measure]);
          });
    }
  });
}
