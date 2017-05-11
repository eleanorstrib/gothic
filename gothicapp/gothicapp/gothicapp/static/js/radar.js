
var ctx = document.getElementById("polar-chart");
var data = {
    datasets: [{
        data: [
            11,
            16,
            7,
            3,
            14
        ],
        backgroundColor: [
            "#FF6384",
            "#4BC0C0",
            "#FFCE56",
            "#E7E9ED",
            "#36A2EB"
        ],
        label: {{ data | length }}// for legend
    }],
    labels: [
      {{ data | length }},
        "Green",
        "Yellow",
        "Grey",
        "Blue"
    ]
};
console.log(data);
new Chart(ctx, {
    data: data,
    type: 'polarArea',
    options: {
elements: {
  arc: {
      borderColor: "#000000"
  }
}
}
});
