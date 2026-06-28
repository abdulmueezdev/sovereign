import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["-y", "@21st-dev/magic@latest", 'API_KEY="DUMMY_KEY"']
  });

  const client = new Client(
    { name: "test-client", version: "1.0.0" },
    { capabilities: {} }
  );

  await client.connect(transport);
  
  try {
    const result = await client.callTool({
      name: "logo_search",
      arguments: {
        queries: ["github"],
        format: "SVG"
      }
    });
    console.log("Result:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Error calling tool:", err.message);
  }
  
  process.exit(0);
}

main().catch(console.error);
