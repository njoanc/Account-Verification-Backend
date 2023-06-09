# Project Name

 *User Account Management Backend* application is responsible for managing user authentication and profiles.
  
## Running the Application

To run the application, you will need to have Node.js and MongoDB installed on your computer.
```
1. Clone this repository to your local machine.
2. In the terminal, navigate to the root of the code base.
3. Run *npm install* to install the necessary dependencies.
4. Rename *.env.example* file to *.env*
5. Modify *.env* file with your credentials
6. Run *npm run start:dev* to start the application.
```

## System Architecture

Our system is using the following components:
```
- MongoDB: for storing user data.
- Express.js: for building the web server.
- Passport.js: for handling authentication.
- Nodemailer: for sending emails.
- Supertest: for testing APIs
- AWS S3: for storing user profile photos.
- Swagger UI for APIs Documentation
```
## Features

### User Authentication
```
- Sign Up: User can create an account by providing basic information, including name, email, password, and additional information.
- Login and Logout: Users can log in and out of their account.
- Password Reset: Users can reset their password via email.
- Security Features
 * Password Strength Enforcement: Passwords should be at least 8 characters long and include a combination of uppercase and lowercase letters, numbers, and special characters.
 * Multi-factor authentication: The option to add a second form of authentication, such as Google Authenticator.
- Login Link: The ability to log in via a link that is emailed to the user.
- Reset Link: The ability to reset a password via a link that is emailed to the user.
```
### User Profile

```
- Profile Photo: Users can upload a photo to their profile.
- Name: First and Last Names.
- Gender: Male, Female, or Non-Binary.
- Age: User's age in years.
- Date of Birth: User's date of birth.
- Marital Status: SINGLE, MARRIED, DIVORCED, or WIDOWED.
- Nationality: User's country of citizenship.
```
### Account Verification

```
- A user is able  to input his National Identification Number (NID) or Passport Number.
- A user is able to upload images of their NID or passport.
- The account should be in three different states: UNVERIFIED, PENDING VERIFICATION, and VERIFIED.
- Verification is done by way of a person inspecting the submitted document.
- Email is sent as a notification to the user when the account is verified.
- The account is marked as verified.

```
### System DESIGN Architecture

In this architecture, the application is broken down into smaller, independent services that communicate with each other through APIs. This allows for easier scalability and better fault tolerance,

![Architecture](./User%20Account%20Management%20Architecture%20(4).jpg)

## Testing the Application

To run the tests for this application, follow these steps:

1. Make sure you have Node.js and npm installed on your machine
2. Clone the repository and navigate to the root directory
3. Install dependencies by running `npm install --save-dev supertest`
4. Run the tests by running `npm test`

### Swagger UI

```
- RUN your server
- Open a web browser.
- `http://localhost:4002/api-docs` to view the Swagger UI.
- Use the Swagger UI to interact with the API endpoints documentation and test the application.
 ``` 
### Postman
```
- Download and install Postman on your computer.
- Open Postman.
- Import the My Backend `User Management Application.postman_collection.json` file located in the root of the code base.
- Use Postman to interact with the API endpoints and test the application.
```
