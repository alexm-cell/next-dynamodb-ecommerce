import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const region = process.env.AWS_REGION;
export const db = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: region || "us-east-1" }),
  { marshallOptions: { removeUndefinedValues: true } },
);

export function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Configuration requise : ${name}`);
  return value;
}
