import { MongoClient, Db, Collection } from 'mongodb';
import dotenv from "dotenv";

dotenv.config();

const clientsCache = new Map<string, MongoClient>();

interface ClientConfig {
  clientId: string;
  clientName: string;
  uri: string;
  dbName: string;
}

const CLIENT_CONFIGS: Record<string, ClientConfig> = {
  "ford": {
    clientId: process.env.MONGODB_FORD_CLIENTID!,
    clientName: "ford",
    uri: process.env.MONGODB_FORD_URI!,
    dbName: process.env.MONGODB_FORD_DB!
  },
  "wheaton": {
    clientId: process.env.MONGODB_WHEATON_CLIENTID!,
    clientName: "wheaton",
    uri: process.env.MONGODB_WHEATON_URI!,
    dbName: process.env.MONGODB_WHEATON_DB!
  },
};

export async function getOrCreateClientDb(
  clientIdentifier: string,
  uri: string,
  dbName: string
): Promise<Db> {
  if (clientsCache.has(clientIdentifier)) {
    const client = clientsCache.get(clientIdentifier)!;
    console.log(`Reusing cached connection for client: ${clientIdentifier}`);
    return client.db(dbName);
  }

  console.log(`Creating new connection for client: ${clientIdentifier}`);
  let client: MongoClient | null = null;
  
  try {
    client = new MongoClient(uri, {
      minPoolSize: 5,
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 5000,
    });
    
    await client.connect();
    console.log(`Connected to MongoDB successfully for client: ${clientIdentifier}`);
    clientsCache.set(clientIdentifier, client);
    return client.db(dbName);
  } catch (error) {
    console.error(`Failed to connect to MongoDB for client ${clientIdentifier}:`, error);
    if (client) {
      client.close().catch(console.error);
    }
    clientsCache.delete(clientIdentifier);
    throw error;
  }
}

export function getClientConfig(clientId: string): ClientConfig | null {
  for (const client of Object.values(CLIENT_CONFIGS)) {
    if (client.clientId === clientId) {
      return client;
    }
  }
  
  return null;
}

export function getAvailableClients(): string[] {
  return Object.keys(CLIENT_CONFIGS);
}

export async function getClientDatabase(clientId: string): Promise<Db> {
  const config = getClientConfig(clientId);
  if (!config) {
    throw new Error(`Client configuration not found for clientId: ${clientId}`);
  }
  
  return await getOrCreateClientDb(config.clientId, config.uri, config.dbName);
}

export function formatSuccessResponse(data: any, clientId?: string, operation?: string, collection?: string) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: true,
            ...(clientId && { clientId }),
            ...(operation && { operation }),
            ...(collection && { collection }),
            data: data,
          }, null, 2),
        } as any,
      ],
      isError: false,
    };
}

export function formatErrorResponse(error: unknown, clientId?: string, operation?: string, collection?: string) {
const errorMessage = error instanceof Error ? error.message : String(error);
return {
    content: [
    {
        type: "text",
        text: JSON.stringify({
        success: false,
        ...(clientId && { clientId }),
        ...(operation && { operation }),
        ...(collection && { collection }),
        error: errorMessage,
        }, null, 2),
    } as any,
    ],
    isError: true,
};
}

export async function closeDatabaseConnections(): Promise<void> {
  console.log('Closing all MongoDB connections...');
  const closePromises: Promise<void>[] = [];
  
  for (const [clientIdentifier, client] of clientsCache.entries()) {
    console.log(`Closing connection for client: ${clientIdentifier}`);
    closePromises.push(
      client.close()
        .then(() => console.log(`Connection closed for client: ${clientIdentifier}`))
        .catch(error => console.error(`Error closing connection for client ${clientIdentifier}:`, error))
    );
  }
  
  await Promise.allSettled(closePromises);
  clientsCache.clear();
  console.log('All MongoDB connections closed.');
}

process.on('SIGINT', async () => {
  await closeDatabaseConnections();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDatabaseConnections();
  process.exit(0);
});