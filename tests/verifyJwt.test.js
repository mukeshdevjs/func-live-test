const { get, post } = require('../utils/axiosHelper');

// Define the API URL for the verifyJwt API endpoint
const API_URL = "https://script.google.com/macros/s/AKfycbwJf7fRudKVMXWsMhAwYTnrMdF6hY3LCy4KW55P5x1f4-qxgtLRjl0v65fWORZ-yihdnw/exec";

describe("Testing verifyJwt API", () => {

  // Tests for the GET request to the verifyJwt API endpoint
  describe("GET request to verifyJwt API", () => {
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
        jwtToken: expect.any(Object),
        secretKey: expect.any(Object),
      }));
      expect(response.input.required).toEqual(expect.arrayContaining(['jwtToken', 'secretKey']));
    })

    // Test for the expected structure of the 'output' object
    test("Should have the expected structure for 'output' object", async () => {
      expect(response.output).toEqual(expect.objectContaining({
        type: expect.any(String),
        description: expect.any(String),
        example: expect.any(Object),
      }));
    })
  })

  describe("POST request to verifyJwt API", () => {
    let response;

    // Test case for a valid request object
    test("Should verify a JWT for a valid request object", async () => {
      const requestObject = {
        "input": {
          "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDk1NTk3MjcsImlhdCI6MTcwOTU1OTY2NywibmFtZSI6InVzZXIiLCJhZ2UiOjI0fQ.RsiQXprPCEL69HampOzSDYqCCi3RD0zk2u9M8H7KG7c",
          "secretKey": "secretKey"
        }
      };

      response = await post(API_URL, requestObject);
      expect(response).toHaveProperty('output');
      expect(response.output).toEqual(expect.objectContaining({
        header: expect.any(Object),
        payload: expect.any(Object),
        isValid: expect.any(Boolean),
        message: expect.any(String),
      }));
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

    // Test case for missing 'secretKey' and 'jwtToken'
    test("Should return an empty output if 'secretKey' and 'jwtToken' are missing", async () => {
      const requestObject = {
        "input": {
          // No 'secretKey' and 'jwtToken' provided
        }
      };

      response = await post(API_URL, requestObject);
      expect(response).toHaveProperty('output');
      expect(response.output).toBe("");
    });
  })
});
