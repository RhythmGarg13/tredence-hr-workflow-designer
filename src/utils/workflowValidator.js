export const validateWorkflow = (nodes, edges) => {
  const errors = [];

  //Check for Start Node
  const startNodes = nodes.filter(n => n.type === 'start');
  if (startNodes.length === 0) {
    errors.push("The workflow must have a starting point.");
  } else if (startNodes.length > 1) {
    errors.push("A workflow can only have one starting point.");
  }

  //Orphan Node Detection (Disconnected Nodes)
  if (nodes.length > 1) {
    const connectedNodeIds = new Set();
    edges.forEach(edge => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });

    nodes.forEach(node => {
      if (!connectedNodeIds.has(node.id)) {
        errors.push(`'${node.data.label}' is floating and not connected to the workflow.`);
      }
    });
  }

  //Cycle Detection (Infinite Loops) using DFS
  const adjList = {};
  nodes.forEach(n => adjList[n.id] = []);
  edges.forEach(e => {
    if(adjList[e.source]) {
        adjList[e.source].push(e.target);
    }
  });

  const visited = new Set();
  const recursionStack = new Set();
  let hasCycle = false;

  const detectCycleDFS = (nodeId) => {
    if (recursionStack.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;

    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = adjList[nodeId] || [];
    for (let neighbor of neighbors) {
      if (detectCycleDFS(neighbor)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  };

  for (let node of nodes) {
    if (detectCycleDFS(node.id)) {
      hasCycle = true;
      break;
    }
  }

  if (hasCycle) {
    errors.push("The workflow contains a cycle. Steps cannot route back to themselves.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};