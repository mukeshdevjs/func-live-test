const convertMsToSeconds = (timeInMS) => {
  return Math.round(timeInMS / 1000);
}
  
const base64Encode = (data, isJSON = true) => {
  const parsedData = isJSON ? JSON.stringify(data) : data;
  return Utilities.base64EncodeWebSafe(parsedData).replace(/=+$/, "");
}
  
const createJwtToken = ({ secretKey, expiresIn, payload = {} }) => {
  // Sign token using HMAC with SHA-256 algorithm
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const currentTimeInMS = Date.now();
  const tokenExpireTime = new Date(currentTimeInMS);

  // Update token expire time
  tokenExpireTime.setSeconds(tokenExpireTime.getSeconds() + expiresIn);

  const jwtPayload = {
    exp: convertMsToSeconds(tokenExpireTime.getTime()),
    iat: convertMsToSeconds(currentTimeInMS),
    // Adding user"s data into Payload
    ...payload
  };

  // Encoding header data
  const encodedHeaderData = base64Encode(header);

  // Encoding payload data
  const encodedPayloadData = base64Encode(jwtPayload);

  const combineEncodedData = `${encodedHeaderData}.${encodedPayloadData}`;

  // Signing data
  const jwtSignatureBytes = Utilities.computeHmacSha256Signature(combineEncodedData, secretKey);

  const jwtSignature = base64Encode(jwtSignatureBytes, false);
  return `${combineEncodedData}.${jwtSignature}`;
};
  
const doGet = () => {
  const response = {
    name: "createJwt",
    description: "Function to generate a JSON Web Token (JWT) using HMAC with SHA-256 algorithm.",
    input: {
      type: "object",
      properties: {
        secretKey: {
          type: "string",
          description: "Secret key used for token generation.",
          example: "some_random_secret_key"
        },
        expiresIn: {
          type: "number",
          description: "Expiration time for the JWT in seconds.",
          example: 1 * 60 * 60,
          default: 1 * 60 * 60,
        },
        payload: {
          type: "object",
          description: "Data to be included in the JWT payload",
          example: {
            name: "Test User",
            email: "testuser@example.com",
          }
        },
      },
      required: ["secretKey", "payload"],
    },
    output: {
      type: "string",
      description: "The generated JWT token",
      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDk1Mzc1MjksImlhdCI6MTcwOTUzNzQ2OSwibmFtZSI6IlRlc3QgVXNlciIsImVtYWlsIjoidGVzdHVzZXJAZXhhbXBsZS5jb20ifQ.NQcRGD15u4ErwoizF0YJVaHHeF_Gn3Arno4oxLaBBbM"
    },
  };

  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
};
  
const doPost = (request = {}) => {
  const { postData: { contents } = {} } = request;
  const parsedData = JSON.parse(contents ?? "{}");

  let response = { output: "" };
  if ("input" in parsedData && "secretKey" in parsedData["input"] && "payload" in parsedData["input"]) {
    const {
      secretKey,
      expiresIn = 1 * 60 * 60,
      payload = {}
    } = parsedData["input"];

    const jwtToken = createJwtToken({ secretKey, expiresIn, payload });

    response["output"] = jwtToken;
  }

  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
};
