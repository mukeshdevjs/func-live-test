const VALID_TOKEN_SUCCESS_MESSAGE = "JWT token is valid.";
const EXPIRED_TOKEN_ERROR_MESSAGE = "Token has expired.";
const INVALID_TOKEN_ERROR_MESSAGE = "JWT token is invalid.";

const base64Encode = (data, isJSON = true) => {
  const parsedData = isJSON ? JSON.stringify(data) : data;
  return Utilities.base64EncodeWebSafe(parsedData).replace(/=+$/, "");
}

const base64Decode = (data) => {
  return Utilities.newBlob(Utilities.base64DecodeWebSafe(data)).getDataAsString();
}

const verifyJwtToken = ({ jwtToken, secretKey }) => {
  const [receivedHeader, receivedPayload, receivedSignature] = jwtToken.split(".");

  try {
    // Decode and parse the received Header and Payload
    const decodedHeader = JSON.parse(base64Decode(receivedHeader));
    const decodedPayload = JSON.parse(base64Decode(receivedPayload));

    // Recreate the combined encoded data
    const combineEncodedData = `${receivedHeader}.${receivedPayload}`;

    // Compute the HMAC signature using the provided secretKey
    const expectedSignatureBytes = Utilities.computeHmacSha256Signature(combineEncodedData, secretKey);
    const expectedSignature = base64Encode(expectedSignatureBytes, false);

    // Verify if the received signature matches the computed signature
    const isSignatureValid = (expectedSignature === receivedSignature);

    let message = isSignatureValid ? VALID_TOKEN_SUCCESS_MESSAGE : INVALID_TOKEN_ERROR_MESSAGE;

    if (isSignatureValid && decodedPayload.exp) {
      const now = Math.floor(new Date().getTime() / 1000);
      if (now >= decodedPayload.exp) {
        message = EXPIRED_TOKEN_ERROR_MESSAGE;
        return {
          header: decodedHeader,
          payload: decodedPayload,
          isValid: false,
          message,
        };
      }
    }

    return {
      header: decodedHeader,
      payload: decodedPayload,
      isValid: isSignatureValid,
      message,
    };

  } catch {
    return {
      isValid: false,
      message: INVALID_TOKEN_ERROR_MESSAGE
    };
  }
};

const doGet = () => {
  const response = {
    name: "verifyJwt",
    description: "Function to verify a JSON Web Token (JWT) using HMAC with SHA-256 algorithm.",
    input: {
      type: "object",
      properties: {
        jwtToken: {
          type: "string",
          description: "JWT token to be verified",
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDk1Mzc1MjksImlhdCI6MTcwOTUzNzQ2OSwibmFtZSI6IlRlc3QgVXNlciIsImVtYWlsIjoidGVzdHVzZXJAZXhhbXBsZS5jb20ifQ.NQcRGD15u4ErwoizF0YJVaHHeF_Gn3Arno4oxLaBBbM"
        },
        secretKey: {
          type: "string",
          description: "Secret key used for token verification",
          example: "some_secret_key"
        },
      },
      required: ["jwtToken", "secretKey"],
    },
    output: {
      type: "object",
      description: "Verification result containing header, payload, and validity of the JWT",
      example: {
        header: {
          alg: "HS256",
          typ: "JWT"
        },
        payload: {
          exp: 1709537529,
          iat: 1709537469,
          name: "Test User",
          email: "testuser@example.com"
        },
        isValid: true,
        message: VALID_TOKEN_SUCCESS_MESSAGE,
      }
    }
  };

  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
};

const doPost = (request = {}) => {
  const { postData: { contents } = {} } = request;
  const parsedData = JSON.parse(contents ?? "{}");

  let response = { output: "" };
  if ("input" in parsedData && "jwtToken" in parsedData["input"] && "secretKey" in parsedData["input"]) {
    const { jwtToken, secretKey } = parsedData["input"];

    const verificationResult = verifyJwtToken({ jwtToken, secretKey });

    response["output"] = verificationResult;
  }

  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
};