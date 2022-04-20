import { initializeApp, applicationDefault} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";
import "dotenv/config"

initializeApp({
  credential: applicationDefault(),
  databaseURL: process.env.DATABASE_URL,
})

//Verify they users ID token is valid.
export async function isTokenValid(req: any, res: any, next: any) {
  console.log(req.headers)
  const token: string = typeof req.headers.authorization === "string" ? req.headers.authorization : "";

  if (token) {
  getAuth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      console.log(decodedToken);
      next();
    })
    .catch((error) => {
      console.log(error);
      return res.status(401).json({ error: "Unauthorized" });
    });
  } else {
    return res.status(403).json({error: "No token provided"});
  }
}
