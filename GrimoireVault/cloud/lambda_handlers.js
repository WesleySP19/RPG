/**
 * GRIMOIRE VAULT - AWS LAMBDA HANDLERS (WebSocket API)
 * Deploy these to AWS Lambda to power the Serverless Real-time VTT.
 * Required: DynamoDB Table 'GrimoireConnections' (PK: sessionKey, SK: connectionId)
 */

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const { routeKey, connectionId } = event.requestContext;
    const body = event.body ? JSON.parse(event.body) : {};

    switch (routeKey) {
        case '$connect':
            return { statusCode: 200, body: 'Connected.' };

        case '$disconnect':
            // Logic to cleanup DynamoDB would go here (search by connectionId)
            return { statusCode: 200, body: 'Disconnected.' };

        case 'join':
            // Maps connectionId to a specific Session (SessionKey)
            await ddb.put({
                TableName: 'GrimoireConnections',
                Item: { sessionKey: body.sessionKey, connectionId }
            }).promise();
            return { statusCode: 200, body: 'Joined Session.' };

        case 'sync':
            // Broadcast message back to everyone in the same session
            const sessionKey = body.sessionKey;
            const connections = await ddb.query({
                TableName: 'GrimoireConnections',
                KeyConditionExpression: 'sessionKey = :sk',
                ExpressionAttributeValues: { ':sk': sessionKey }
            }).promise();

            const postCalls = connections.Items.map(async (conn) => {
                if (conn.connectionId === connectionId) return; // Skip sender

                const apigwManagementApi = new AWS.ApiGatewayManagementApi({
                    endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
                });

                try {
                    await apigwManagementApi.postToConnection({
                        ConnectionId: conn.connectionId,
                        Data: JSON.stringify(body.payload)
                    }).promise();
                } catch (e) {
                    if (e.statusCode === 410) {
                        // Cleanup stale connections
                        await ddb.delete({ TableName: 'GrimoireConnections', Key: { sessionKey, connectionId: conn.connectionId } }).promise();
                    }
                }
            });

            await Promise.all(postCalls);
            return { statusCode: 200, body: 'Sync broadcasted.' };

        default:
            return { statusCode: 404, body: 'Route not found.' };
    }
};
