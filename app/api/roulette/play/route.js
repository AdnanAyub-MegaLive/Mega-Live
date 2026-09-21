// The former cookie wallet is retired. All rounds require a verified Mega session.
export async function POST(){return Response.json({error:'Use /api/player with a verified Mega launch session.'},{status:410});}
