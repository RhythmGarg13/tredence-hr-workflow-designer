const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Simulates a GET request to fetch available automated actions.
  getAutomations: async () => {
    await delay(500); 
    return [
      { id: "send_email", label: "Send Email", params: ["to", "subject"] },
      { id: "generate_doc", label: "Generate Document", params: ["template", "recipient"] }
    ];
  },

  // Simulates a POST request to execute the workflow.
  simulateWorkflow: async (workflowPayload) => {
    await delay(1500); 

    const { nodes, edges } = workflowPayload;
    const logs = [];
    
    const startNode = nodes.find(n => n.type === 'start');
    if (!startNode) {
      throw new Error("Your workflow must contain a 'Start Step' node to begin.");
    }

    logs.push(`[SERVER API] Received payload. Started workflow from: ${startNode.data.label}`);

    let currentNode = startNode;
    let step = 1;
    let hasNext = true;

    while(hasNext && step < 20) {
      const edge = edges.find(e => e.source === currentNode.id);
      if (edge) {
        const nextNode = nodes.find(n => n.id === edge.target);
        if (nextNode) {
          logs.push(`Step ${step}: Executing [${nextNode.type.toUpperCase()}] -> ${nextNode.data.label}`);
          currentNode = nextNode;
          step++;
        } else {
          hasNext = false;
        }
      } else {
        logs.push(`Workflow execution completed successfully.`);
        hasNext = false;
      }
    }

    return { success: true, logs };
  }
};