// app/api/graphql/route.js
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";

import { db } from "@/app/lib/database/db";
import { ProductRow } from "@/app/types/definitions";
// 2. Define the Schema
const typeDefs = `#graphql
  type Product {
    id: ID!
    name: String!
    price: Float!
  }

  type Query {
    getAllProducts: [Product]
    getProductById(id: ID!): Product
  }
`;

// 4. Define the Resolvers with Types
const resolvers = {
  Query: {
    // We specify that this resolver returns a Promise of an array of ProductRows
    getAllProducts: async (): Promise<ProductRow[]> => {
      const [rows] = await db.query<ProductRow[]>("SELECT * FROM products");
      return rows;
    },

    // We type the 'args' object so TypeScript knows we expect an 'id' string
    getProductById: async (
      _parent: unknown,
      args: { id: string },
    ): Promise<ProductRow | null> => {
      const [rows] = await db.query<ProductRow[]>(
        "SELECT * FROM products WHERE product_id = ?",
        [args.id],
      );

      // Return the first row if it exists, otherwise return null
      return rows.length > 0 ? rows[0] : null;
    },
  },
  // FIX: This is a Field Resolver. It acts as a translator.
  // It takes the raw database row (parent) and maps it to the GraphQL schema.
  Product: {
    id: (parent: ProductRow) => parent.product_id,
    name: (parent: ProductRow) => parent.product_name,
    // We don't need one for 'price' because the DB column and Schema name already match exactly!
  },
};

// 4. Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// 5. Create the Next.js Handler
const handler = startServerAndCreateNextHandler<NextRequest>(server);

// 6. Export the exact HTTP methods Next.js expects
export { handler as GET, handler as POST };
