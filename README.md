# Introduction.

This project is created for the purposes of simulating CRUD functionalities through multiple API endpoints.

- This project utilizes POSTGRES as the database, Nodejs as the server and the Express framework so basic knowledge of the mentioned technologies will be useful in understanding how the project works.

### Project Functionalities:

- CREATE - Add a new person to the database.
- READ - Get information about a particular person stored in the database.
- UPDATE - Change details of the specified person within the database.
- DELETE - Remove a particular individual from the database

### Local machine setup:

To run this project on your local machine you will need to follow the following steps

- Download and install Postman desktop app to mock requests at different endpoints.
- Download and install POSTGRES from [POSTGRES windows download.](https://www.postgresql.org/download/windows/) Ensure to remember your credentials during setup as we will need them later. This includes user, host database, password and port.
- Download this project as a zip folder from Github and save it on your local computer.
- You can now unzip the folder and open it using a code editor preferably VS-CODE
- Run this in the intergrated terminal for VS-CODE to install all the dependancies. Ensure you are in the task 2 folder

```
npm install
```
- After the dependancies have been installed you need to open the index.js file and edit a couple of things as shown below.

- Uncomment the below block of code in the index.js file and replace the values with the values you obtained when installing POSTGRES on your computer

```
// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'test_one',
//     password: 'admin',
//     port: 5432,
// });
```

- After replacing the values with the ones you obtained from installing POSTGRES you can comment out the following block of code still on index.js

```
const pool = new Pool({
    connectionString: 'postgres:
//keqfpbiv:LF9fINSbY9Fp2l_tLYAcPokXUSCXg4m1@berry.db.elephantsql.com/keqfpbiv'
})
```
- After this we will go to the PGAdmin App, open it and we will see a list of servers on the left. when you click on it you will be prompted to enter a password which is the same one used when installing POSTGRES default being (admin). 

- After entering the password we will need to create a database and a table within the database we will use the inbuilt query tool that can be accessed using the commands (ALT+SHIFT+Q).

- In this instance my database name will be called test_one but in your case name it accordingly. So in the query interface I run this command to create my database and create a persons table.

```
CREATE DATABASE test_one;
CREATE TABLE persons_table(id SERIAL, name text);
```
- Now we are ready to simulate CRUD operations, the instructions can be found below server machine deployment setup.

### Server machine deployment setup: 

- In this section we will cover two aspects of deploying the project, one involves deploying the node-js server and the other involves creating an instance of the database on a database server. 

- For deploying the project you can use any provider but in this project Google App Engine was utilized to host the node-js server, instructions on how to deploy can be found here. [Deploying a Nodejs App to app engine](https://cloud.google.com/appengine/docs/standard/nodejs/runtime).

- For creating an instance of the POSTGRES database you can use any provider you wish but for this project I utilized [ElephantSQL](https://www.elephantsql.com/). If you have used ElephantSQL, create an account, create an instance of a POSTGRES database. After creating an instance of POSTGRES head on to the details of the instance and copy the URL as shown. This is what we need to ensure we can communicate with that instance.
- After grabbing the URL, replace the connectionString with the URL that you copied on the index.js file.
```
const pool = new Pool({
    connectionString: 'postgres:
//keqfpbiv:LF9fINSbY9Fp2l_tLYAcPokXUSCXg4m1@berry.db.elephantsql.com/keqfpbiv'
})
```
- Now your Node-js Server can communicate with the POSTGRES instance.
- Before we are ready to perform CRUD operations we need to create a table in the database instance that we created on ElephantSQL, this will hold all the data for our different persons. 
- You can do this by running the following query on the ElephantSQL dashboard Browser tab

```
CREATE TABLE persons_table(id SERIAL, name text);
```

- After going through the documentation on deploying a Node-js app you can deploy the project with the necessary modifications to the index.js file and it will be ready to go.


### 
### CRUD Simulation
- In this section we will simulate CRUD operations using Postman. If you are running this project on the local machine ensure that the node-js server is running and that you already created a database and created the persons_table. Ensure you have followed all instructions concerning the local machine setup as shown above. In Postman the url for testing the different operations looks like this.

``
localhost:8080/api
``

- If you are running this project on the server meaning you went according to the instructions as indicated in the server machine deployment setup above section , the endpoint will look something like this but in your case it is the url provided by app engine and will be different from the one stated below 

``
https://prod-appointments.uc.r.appspot.com/
``

### CREATE

- Ensure to use the appropriate URL when making this POST request using postman if you are doing it on your local machine your endpoint looks something like this 
``localhost:8080/api
``.And if you are doing this on the hosted server your endpoint looks something like this 
``
https://prod-appointments.uc.r.appspot.com/api
``

- If you are running this on a local machine ensure the node-js server is also running.
- For this operation we can utilize postman to send the request, this is a POST request, so ensure to select that on postman. The endpoint requires you to pass in the name of the person in the request body as JSON. 

```
{
      
     "name": "james"

}
```
- The endpoint will ensure you have not passed in a numerical value as well as an empty value. If this is successful a response like this will be generated and sent back to you. 


```
{
    "status": 200,
    "message": "Successfuly added somebody",
    "user_data": [
        {
            "id": 1,
            "name": "Arnold"
        }
    ]
}
```


### READ 

- Ensure to use the appropriate URL when making this GET request using postman if you are doing it on your local machine your endpoint looks something like this 
``localhost:8080/api/1
``.And if you are doing this on the hosted server your endpoint looks something like this 
``
https://prod-appointments.uc.r.appspot.com/api/1
``

- If you are running this on a local machine ensure the node-js server is also running.

- When retreiving details about a person using this endpoint we need to perform a GET request using postman, in this instance we need to pass in the ID of the person at the end of the URL for example /api/1. The endpoint will check if such a user exists within the database and if a record is found this is passed back to you.

```
{
    "status": 200,
    "user_result": [
        {
            "id": 1,
            "name": "Arnold"
        }
    ]
}
```
- If a user is not found within the database this is the response that you will get 

```
{
    "status": 200,
    "message": "No results found for the given ID"
}
```

### UPDATE

- Ensure to use the appropriate URL when making this PATCH request using postman if you are doing it on your local machine your endpoint looks something like this 
``localhost:8080/api/1
``.And if you are doing this on the hosted server your endpoint looks something like this 
``
https://prod-appointments.uc.r.appspot.com/api/1
``

- If you are running this on a local machine ensure the node-js server is also running.

- This endpoint allows us to update specific details of a user, the ID of the user is passed in the URL for example /api/3. This ID will be used to search for the specific user for which the details are to be updated. This endpoint also requires the name of the person to be passed in through the request body as JSON in the following format 
```
{
      
     "name": "Arnold"

}
```
- The endpoint will search if such a user exists in the records and if they do, the details will be updated and this will be returned back to you. 

```
{
    "status": 200,
    "message": "Updated details for user 1",
    "user_data": [
        {
            "id": 1,
            "name": "Arnold"
        }
    ]

}
```
### DELETE 

- Ensure to use the appropriate URL when making this DELETE request using postman if you are doing it on your local machine your endpoint looks something like this 
``localhost:8080/api/1
``.And if you are doing this on the hosted server your endpoint looks something like this 
``
https://prod-appointments.uc.r.appspot.com/api/1
``

- If you are running this on a local machine ensure the node-js server is also running.

- This endpoint is meant for deleting a particular user given an ID specified at the end of a URL such as /api/1. The endpoint will search the database for the given user and if they exist you will receive such a result confirming that the delete operation was successful

```
{
    "status": 200,
    "message": "Deleted the user with ID 1"
}
```

### Database structure UML diagram

![Uml diagram.](https://firebasestorage.googleapis.com/v0/b/production-restaurant-startup.appspot.com/o/Screenshot%202023-09-12%20194901.png?alt=media&token=ac1e07a5-0ac2-46c6-ba2e-cf766cad99b9)
