// Never issue a fresh cookie balance as a substitute for the Mega wallet.
export async function GET(){return Response.json({error:'Use /api/player with a verified Mega launch session.'},{status:410});}
