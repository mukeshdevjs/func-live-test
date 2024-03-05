# This repository contains source code of following functions:
- createJwt
- verifyJwt

Note: Both of these function is deployed on func.live and it uses google app script environment. So if you run this function in nodeJS environment then you may get an error in some lines as some utility functions used in above functions runs only in google app script environment.

### func.live urls of both functions:
- https://www.func.live/functions/createJwt: This function is used for creating the JWT token as per instructions mentioned in schema.
- https://www.func.live/functions/verifyJwt:  This function is used for verifying the JWT token.

### I used following approach for creating and deploying functions on func.live:
- I used google app script for creating both functions i.e createJwt and verifyJwt.
- Then used both functions google app scripts URLs and this [doc](https://www.func.live/contributing) for deployment on func.live.
 
### Google App script URLs for both functions which are used while deployment on func.live:
  - [createJwt](https://script.google.com/macros/s/AKfycbz6lf_Ej_33jNWooE54wzAW8FSqYhkexkEmEAAwOtJ0MvoSxl_BHBmAS5RLQ8lUzFM/exec)
  - [verifyJwt](https://script.google.com/macros/s/AKfycbwJf7fRudKVMXWsMhAwYTnrMdF6hY3LCy4KW55P5x1f4-qxgtLRjl0v65fWORZ-yihdnw/exec)

### I have also written test cases to test both of Google App Script URLs. Please follow below steps to run the test cases:
- **npm i**
- **npm run test**

------

Note - I have setup environment for both the google app script URLs. You can see .env for the further info. Generally, pushing the .env file is not considered a best practice, but here I pushed, assuming it's a test task :)  
