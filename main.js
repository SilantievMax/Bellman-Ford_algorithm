class Graph {
  constructor(vertices) {
    this.V = vertices;
    this.graph = [];
  }

  addEdge(u, v, w) {
    this.graph.push([u, v, w]);
  }

  bellmanFord(src) {
    let dist = Array(this.V).fill(Infinity);
    dist[src] = 0;

    for (let i = 1; i < this.V; i++) {
      for (let [u, v, w] of this.graph) {
        if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
          dist[v] = dist[u] + w;
        }
      }
    }

    // Проверка на наличие отрицательных циклов
    for (let [u, v, w] of this.graph) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        console.log("Граф содержит отрицательный цикл");
        return;
      }
    }

    this.printSolution(dist);
  }

  printSolution(dist) {
    let resultsTableBody = document.querySelector('#resultsTable tbody');
    resultsTableBody.innerHTML = '';

    for (let i = 0; i < this.V; i++) {
      let row = document.createElement('tr');
      let vertexCell = document.createElement('td');
      let distanceCell = document.createElement('td');

      vertexCell.textContent = String.fromCharCode(65 + i);
      distanceCell.textContent = dist[i];

      row.appendChild(vertexCell);
      row.appendChild(distanceCell);
      resultsTableBody.appendChild(row);
    }
  }

  visualize() {
    let nodes = new vis.DataSet();
    let edges = new vis.DataSet();

    // Создание меток вершин
    let nodeLabels = [];
    for (let i = 0; i < this.V; i++) {
      nodeLabels.push(String.fromCharCode(65 + i)); // 65 - код символа 'A'
    }

    for (let i = 0; i < this.V; i++) {
      nodes.add({ id: i, label: nodeLabels[i] });
    }

    for (let [u, v, w] of this.graph) {
      edges.add({ from: u, to: v, label: w.toString(), arrows: 'to' });
    }

    let container = document.getElementById('mynetwork');
    let data = {
      nodes: nodes,
      edges: edges
    };
    let options = {};
    let network = new vis.Network(container, data, options);
  }
}

document.getElementById('graphForm').addEventListener('submit', function (event) {
  event.preventDefault();

  let vertices = parseInt(document.getElementById('vertices').value);
  let edgesInput = document.getElementById('edges').value;
  let source = document.getElementById('source').value

  let g = new Graph(vertices);

  let edges = edgesInput.split('\n');
  for (let edge of edges) {
    let [u, v, w] = edge.split(',').map((val, index) => {
      if (index === 2) {
        return Number(val)
      }

      return val.toUpperCase().charCodeAt() - 65
    });
    g.addEdge(u, v, w);
  }

  g.bellmanFord(source.toUpperCase().charCodeAt() - 65);
  g.visualize();
});