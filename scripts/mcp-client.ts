import "dotenv/config";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const API_KEY = process.env["21ST_DEV_API_KEY"] || "";

async function main() {
  if (!API_KEY) {
    console.error("❌ Error: 21ST_DEV_API_KEY environment variable is missing.");
    console.error("Please add it to your .env or run with 21ST_DEV_API_KEY=your-key");
    process.exit(1);
  }

  const transport = new StdioClientTransport({
    command: "npx",
    args: ["-y", "@21st-dev/magic@latest", `API_KEY="${API_KEY}"`]
  });

  const client = new Client(
    { name: "sovereign-mcp-client", version: "1.0.0" },
    { capabilities: {} }
  );

  console.log("Connecting to 21st.dev Magic MCP server...");
  try {
    await client.connect(transport);
    console.log("✅ Successfully connected to 21st.dev MCP Server.");
    
    // Check if user passed arguments for searching
    const command = process.argv[2];
    const query = process.argv[3];
    
    if (command === "search" && query) {
      console.log(`\n🔍 Searching for UI component: "${query}"...\n`);
      const result = await client.callTool({
        name: "21st_magic_component_builder",
        arguments: {
          message: `I need a ${query}`,
          searchQuery: query,
          absolutePathToCurrentFile: process.cwd(),
          absolutePathToProjectDirectory: process.cwd(),
          standaloneRequestQuery: `User wants a ${query}`
        }
      });
      console.log(JSON.stringify(result, null, 2));
    } else if (command === "logo" && query) {
      console.log(`\n🔍 Searching for Logo: "${query}"...\n`);
      const result = await client.callTool({
        name: "logo_search",
        arguments: {
          queries: [query],
          format: "SVG"
        }
      });
      console.log(JSON.stringify(result, null, 2));
    } else {
      const tools = await client.listTools();
      console.log("\n🛠️ Available MCP Tools:");
      tools.tools.forEach((t) => {
        console.log(`- ${t.name}: ${t.description.trim().substring(0, 100)}...`);
      });
      console.log("\nUsage:");
      console.log("  npm run magic:search <query>  - Search and retrieve a UI component");
      console.log("  npm run magic:logo <query>    - Search and retrieve a logo (SVG)");
    }
  } catch (error) {
    console.error("❌ Connection or execution failed:", error);
  } finally {
    process.exit(0);
  }
}

main().catch(console.error);
