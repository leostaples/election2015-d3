var width = 1200,
  height = 1000;

var svg = d3.select("#visualisation")
  .append("svg")
    .attr("width", width)
    .attr("height", height);

var partyColours = {
  apni: '#cdaf2d',
  bnp:  '#9094c8',
  con:  '#0575c9',
  cpa:  '#c39',
  dup:  '#c0153d',
  ed:   '#b20a06',
  grn:  '#78c31e',
  ichc: '#ff0078',
  ind:  '#d26fbc',
  lab:  '#ed1e0e',
  ld:   '#fe8300',
  lib:  '#feae14',
  mk:   '#a09b1c',
  nha:  '#1554b6',
  ni21: '#009fbd',
  noc:  '#646464',
  oth:  '#999',
  pc:   '#4e9f2f',
  pv:   '#028948',
  pup:  '#000b66',
  ra:   '#00b0ac',
  res:  '#31b56a',
  sdlp: '#65a966',
  sf:   '#00623f',
  slp:  '#ff5b00',
  ssp:  '#906',
  snp:  '#ebc31c',
  tusc: '#6c0000',
  tuv:  '#6dcad2',
  ukip: '#712f87',
  uup:  '#6ab1e6',
  yf:   '#00b8fd',
  hung: '#646464'
};

var rowSize = 26,
  r = 20,
  row = 0,
  x, j;

function getPosX(d, i) {
  if (i % rowSize === 0) {
    j = 0;
  }
  x = (j * r*2) + r;
  j++;

  return x;
}

function getPosY(d, i) {
  if (i > 0 && i % rowSize === 0) {
    row++;
  }

  return (row * r*2) + r;
}

d3.json("results2.json", function(error, data) {
  //initial alpha sort
  data.sort(function(a, b) { return d3.ascending(a.constituency.region.name, b.constituency.region.name); })

  var constituencyGroup = svg.append("g")
      .attr("class", "constituencies")
    .selectAll("circle")
      .data(data)
    .enter().append("circle")
      .attr("cx", function (d, i) { return getPosX(d, i) })
      .attr("cy", function (d, i) { return getPosY(d, i) })
      .attr("class", "constituency")
      .attr("r", r)
      .attr("fill", function (d) { return partyColours[d.newPartyCode.toLowerCase()] || "#999" })
    .append("svg:title")
      .text(function(d) { return d.constituency.region.name; });

  // var labelGroup = svg.append("g")
  //     .attr("class", "labels")
  //   .selectAll("text")
  //     .data(data)
  //   .enter().append("text")
  //     .attr("text-anchor", "middle")
  //     .attr("dx", function (d, i) { return getPosX(d, i) })
  //     .attr("dy", function (d, i) { return getPosY(d, i) })
  //     .text(function(d) { return d.constituency.region.name });

  d3.selectAll("input").on("change", update);

  function update() {
    //reset row count
    row = 0;

    var sortFunc;
    switch (this.value) {
      case 'az':
        sortFunc = function(a, b) { return d3.ascending(a.constituency.region.name, b.constituency.region.name) };
        break;
      case 'party':
        sortFunc = function(a, b) { return d3.ascending(a.newPartyCode, b.newPartyCode) };
        break;
      case 'majority':
        sortFunc = function(a, b) { return b.majorityNow - a.majorityNow };
        break;
      case 'majority_percentage':
        sortFunc = function(a, b) { return b.majorityPctNow - a.majorityPctNow };
        break;
      case 'electorate':
        sortFunc = function(a, b) { return b.constituency.electorate - a.constituency.electorate };
        break;
      case 'turnout_percentage':
        sortFunc = function(a, b) { return b.turnout.percentage - a.turnout.percentage };
        break;
    }

    svg.selectAll(".constituency")
        .sort(sortFunc);

    var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 3; };

    transition.selectAll("circle")
      .delay(delay)
      .ease("cubic-in-out")
      .attr("cx", function (d, i) { return getPosX(d, i) })
      .attr("cy", function (d, i) { return getPosY(d, i) })
  }
});
