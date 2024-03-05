const { get, post } = require('../utils/axiosHelper');

// Define the API URL for the createJWT API endpoint
const API_URL = "https://script.google.com/macros/s/AKfycbz6lf_Ej_33jNWooE54wzAW8FSqYhkexkEmEAAwOtJ0MvoSxl_BHBmAS5RLQ8lUzFM/exec";

describe("Testing createJwt API", () => {

  // Tests for the GET request to the createJWT API endpoint
  describe("GET request to createJWT API", () => {
    let response;

    // Make a GET request before running each test
    beforeAll(async () => {
      response = await get(API_URL);
    })

    // Test for receiving a non-empty response
    test("Should receive a non-empty response", async () => {
      expect(response).not.toBe(null);
    })

    // Test for receiving a schema object with proper fields
    test("Should receive a schema object with proper fields", async () => {
      expect(response.name).toBeDefined();
      expect(response.description).toBeDefined();
      expect(response.input).toBeDefined();
      expect(response.output).toBeDefined();
    })

    // Test for the expected structure of the 'input' object
    test("Should have the expected structure for 'input' object", async () => {
      expect(response.input.type).toEqual('object');
      expect(response.input.properties).toEqual(expect.objectContaining({
        secretKey: expect.any(Object),
        payload: expect.any(Object),
        expiresIn: expect.any(Object)
      }));
      expect(response.input.required).toEqual(expect.arrayContaining(['secretKey', 'payload']));
    })

    // Test for the expected structure of the 'output' object
    test("Should have the expected structure for 'output' object", async () => {
      expect(response.output).toEqual(expect.objectContaining({
        type: expect.any(String),
        description: expect.any(String),
        example: expect.any(String),
      }));
    })
  })

  describe("POST request to createJWT API", () => {
    let response;

    // Test case for a valid request object
    test("Should generate a JWT for a valid request object", async () => {
      const requestObject = {
        "input": {
          "secretKey": "secretKey",
          "expiresIn": 60,
          "payload": {
            "name": "user",
            "age": 24
          }
        }
      };

      response = await post(API_URL, requestObject);
      expect(response).toHaveProperty('output');
      expect(response.output).toEqual(expect.any(String));
    });

    // Test case for missing input field
    test("Should return an empty output if 'input' field is missing", async () => {
      const requestObject = {
        // No 'input' field provided
      };

      response = await post(API_URL, requestObject);
      expect(response).toHaveProperty('output');
      expect(response.output).toBe("");
    });

    // Test case for missing 'secretKey' and 'payload'
    test("Should return an empty output if 'secretKey' and 'payload' are missing", async () => {
      const requestObject = {
        "input": {
          // No 'secretKey' and 'payload' provided
        }
      };

      response = await post(API_URL, requestObject);
      expect(response).toHaveProperty('output');
      expect(response.output).toBe("");
    });
  })
});
