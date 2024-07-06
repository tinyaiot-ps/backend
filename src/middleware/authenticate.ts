const jwt = require('jsonwebtoken');

export const isTokenExpired = (token: string) =>
  Date.now() >= JSON.parse(atob(token.split('.')[1])).exp * 1000;

export const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN_STRING

  if (token == null) return res.sendStatus(401); // if there's no token

  if (isTokenExpired(token)) return res.sendStatus(401); // if the token is expired

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err: any, user: any) => {
    if (err) return res.sendStatus(403); // any error means a bad token
    req.user = user;

    next(); // proceed to the next middleware function
  });
};

export const authenticateNoise = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN_STRING

  if (
    token !==
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidHlwZSI6Im5vaXNlIn0.f7B9OBDHlhRsDBRsENo1GPTjw-qBpGSP5nyhJCPUZF0'
  )
    return res.sendStatus(401); // check if token matches

  next(); // proceed to the next middleware function
};
