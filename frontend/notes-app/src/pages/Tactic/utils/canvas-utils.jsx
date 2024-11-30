import * as d3 from "d3";

export function createVoronoiFromPoints(points, canvas) {
    const delaunayPoints = points.map((point) => [point.x, point.y]);
    const delaunay = d3.Delaunay.from(delaunayPoints);
    const diagram = delaunay.voronoi([0, 0, canvas.width, canvas.height]);
  
    return diagram;
  }
  
  export function extractEdges(voronoi) {
    // Extract circumcenters and half-edges
    const circumcenters = voronoi.circumcenters;
    const halfedges = voronoi.delaunay.halfedges;
    const triangles = voronoi.delaunay.triangles;
  
    // Function to get circumcenter for a triangle
    const getCircumcenter = (i) => [
      circumcenters[2 * i],
      circumcenters[2 * i + 1],
    ];
  
    // Iterate through halfedges to extract Voronoi edges
    const edges = [];
    for (let e = 0; e < halfedges.length; e++) {
      //if (e < halfedges[e]) {
      // Ensure each edge is only processed once
      const t1 = Math.floor(e / 3); // First triangle
      const t2 = Math.floor(halfedges[e] / 3); // Adjacent triangle (if exists)
  
      const p1 = getCircumcenter(t1);
      const p2 = halfedges[e] === -1 ? null : getCircumcenter(t2); // Handle edges at boundaries
  
      // Add edge
      if (p2) {
        edges.push([p1, p2]);
      }
      // }
    }
    return edges;
  }
  