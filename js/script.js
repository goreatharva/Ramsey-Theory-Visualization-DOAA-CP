// Choose Feature Buttons
document.getElementById('btnCalculator').addEventListener('click', () => {
    showSection('calculator');
});

document.getElementById('btnGraph').addEventListener('click', () => {
    showSection('graphContainer');
});

document.getElementById('btnTheory').addEventListener('click', () => {
    showSection('theory');
});

// Interactive Ramsey Number Calculator Logic
document.getElementById('calculateRamsey').addEventListener('click', function() {
    const r = parseInt(document.getElementById('rValue').value);
    const k = parseInt(document.getElementById('kValue').value);

    // A simple function to calculate Ramsey number R(r, k)
    const ramseyNumber = (r, k) => {
        if (r === k && r ===1) return r; 
        if (r === k && r ===2) return r + 1;

        if (r ===1) return k; 
        if (k ===1) return r;

        return ramseyNumber(r -1 , k) + ramseyNumber(r , k -1); 
    };

    const result = ramseyNumber(r,k); 
    document.getElementById('ramseyResult').innerText = `R(${r}, ${k}) = ${result}`; 
});

// Graph Generation Logic
document.getElementById('generateGraph').addEventListener('click', function() {
    const redCount = parseInt(document.getElementById('redCount').value);
    const blueCount = parseInt(document.getElementById('blueCount').value);
    const graphType = document.getElementById('graphType').value;

    // Clear previous graph
    document.getElementById('graphCanvas').innerHTML = '';

    // Create a scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // Aspect ratio set to match square
    const renderer = new THREE.WebGLRenderer({ antialias: true });
   
    // Set the size of the renderer to match the container
    const container = document.getElementById('graphCanvas');
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Create vertices
    const vertices = [];
    for (let i = 0; i < redCount + blueCount; i++) {
        vertices.push(Math.random() * (10) - (5)); // x
        vertices.push(Math.random() * (10) - (5)); // y
        vertices.push(Math.random() * (10) - (5)); // z
    }

    // Create BufferGeometry for vertices
    const geometry = new THREE.BufferGeometry();
    const positionAttribute = new Float32Array(vertices);
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positionAttribute, 3));

    // Create edges (red and blue)
    const redEdges = [];
    const blueEdges = [];

    if (graphType === 'closed') {
        // Closed structure connections
        for (let i = 0; i < redCount; i++) {
            for (let j = i + 1; j < redCount; j++) { // Ensure no self-loops and duplicate edges
                redEdges.push(i, j);
            }
        }

        for (let i = redCount; i < redCount + blueCount; i++) {
            for (let j = i + 1; j < redCount + blueCount; j++) { // Ensure no self-loops and duplicate edges
                blueEdges.push(i, j);
            }
        }
        
    } else if (graphType === 'open') {
        // Open structure connections
        for (let i = 0; i < redCount; i++) {
            redEdges.push(i, (i + 1) % redCount); // Connect each red vertex in a circle
        }

        for (let i = redCount; i < redCount + blueCount; i++) {
            blueEdges.push(i, ((i - redCount + 1) % blueCount) + redCount); // Connect each blue vertex in a circle
        }
    }

  // Create LineSegments for red edges with increased thickness
  const redLineMaterial = new THREE.LineBasicMaterial({ color: 'red' });
  const redLinesGeometry = new THREE.BufferGeometry().setFromPoints(redEdges.map(i => new THREE.Vector3(vertices[i * 3], vertices[i * 3 + 1], vertices[i * 3 + 2])));
  const redLines = new THREE.LineSegments(redLinesGeometry, redLineMaterial);

  // Create LineSegments for blue edges with increased thickness
  const blueLineMaterial = new THREE.LineBasicMaterial({ color: 'blue' });
  const blueLinesGeometry = new THREE.BufferGeometry().setFromPoints(blueEdges.map(i => new THREE.Vector3(vertices[i * 3], vertices[i * 3 + 1], vertices[i * 3 + 2])));
  const blueLines = new THREE.LineSegments(blueLinesGeometry, blueLineMaterial);

  scene.add(redLines);
  scene.add(blueLines);

  // Adjust camera position based on number of vertices to ensure full visibility
  camera.position.z = Math.max(redCount, blueCount) * 3;

  function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
  }

  animate();
});

// Helper function to show/hide sections
function showSection(sectionId) {
   const sections = ['calculator', 'graphContainer', 'theory'];
   sections.forEach(id => {
       document.getElementById(id).style.display = id === sectionId ? 'block' : 'none';
   });
}
