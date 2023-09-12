
const express = require('express')
const app = express()
const port = process.env.PORT || 8080;
const { Pool } = require("pg");
const bodyParser = require('body-parser')
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//Establishing a connection to postgres database using node postgres
//For testing on a local postgres instance
// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'test_one',
//     password: 'admin',
//     port: 5432,
// });



//Establishing connection to the postgres database instance hosted on elephantsql
const pool = new Pool({
    connectionString: 'postgres://keqfpbiv:LF9fINSbY9Fp2l_tLYAcPokXUSCXg4m1@berry.db.elephantsql.com/keqfpbiv'
})



app.get("/", (req, res) => {
    res.json("Server is alive")
})


//READ- OBTAIN A USER WITH A GIVEN ID
app.get("/api/:user_id", (req, res) => {
    //Obtaining the record for an existing person using the provided id in the params 

    const text = "SELECT * FROM persons_table WHERE id=$1"
    const values = [req.params.user_id]


    pool.query(text, values).then((response) => {
        //After querying the database an array of the values is returned in JSON format
        //Checking if the record of the given user exists in the database 
        if (response.rows.length == 0) {
            res.json({
                status: 200,
                message: 'No results found for the given ID'
            })
        } else {
            res.json({
                status: 200,
                user_result: response.rows
            })
        }

    }).catch((err) => {
        res.json({
            status: 500,
            message: 'Internal server error failed establishing connection to the database'
        })
    })

})

//CREATE- ADDING A NEW USER
app.post("/api", (req, res) => {
    //Create a new person using provided name in the request body as json
    //Check to ensure that the name is not undefined
    //Data can be sent through the request body as raw json

    //Ensuring the passed value is not undefined and is not a number 
    if (typeof req.body.name != 'undefined' && typeof req.body.name == 'string') {

        const insert_person = "INSERT INTO persons_table(name) VALUES($1) RETURNING *"
        const person_name = [req.body.name]

        pool.query(insert_person, person_name).then((response) => {
            res.json({
                status: 200,
                message: 'Successfuly added somebody',
                user_data: response.rows
            })
        }).catch((err) => {
            res.json({
                status: 500,
                message: 'Internal server error failed adding the person'
            })
        }).catch((err) => {
            res.json({
                status: 500,
                message: 'Internal server error failed establishing connection to the database'
            })
        })
    } else if (typeof req.body.name == 'undefined') {
        res.json({
            status: 500,
            message: "You need to pass in a name in the request body"
        })


    } else if (typeof req.body.name != 'string') {

        res.json({
            status: 500,
            message: "You need to pass in a string type in the name field"
        })

    }


})

//UPDATE DETAILS FOR A SPECIFIC USER 
app.patch("/api/:user_id", (req, res) => {
    //Update details of an existing person 
    //get details from request body 
    //Obtain the id from the query params
    //Ensure the user exists first of all 
    //id of the person to be updated is passed in throught the route params and the new name is passed in through the request body

    const text = 'SELECT * FROM persons_table WHERE id=$1'
    const value = [req.params.user_id]

    pool.query(text, value).then((response) => {

        //Checking if user with the given ID exists in the database
        if (response.rows.length == 0) {
            res.json({
                status: 200,
                message: 'No results found for the given ID'
            })
        } else {

            //A user exists with the given ID so we may update the details of the user 
            //Ensuring the passed value is not undefined and is a number 
            if (typeof req.body.name != 'undefined' && typeof req.body.name == 'string') {


                const text_one = 'UPDATE persons_table SET name=$1 WHERE id=$2 RETURNING *'
                const value_one = [req.body.name, req.params.user_id]

                pool.query(text_one, value_one).then((response) => {
                    res.json({
                        status: 200,
                        message: `Updated details for user ${req.params.user_id}`,
                        user_data: response.rows

                    })
                }).catch((err) => {
                    res.json({
                        status: 500,
                        message: 'Internal server error failed establishing connection to the database'
                    })
                })

            } else if (typeof req.body.name == 'undefined') {
                res.json({
                    status: 500,
                    message: "You need to pass in a name in the request body"
                })

            } else if (typeof req.body.name != 'string') {
                res.json({
                    status: 500,
                    message: "You need to pass in a string type in the name field"
                })

            }




        }
    }).catch((err) => {
        res.json({
            status: 500,
            message: 'Internal server error failed establishing connection to the database'
        })
    })


})

//DELETE DETAILS FOR A SPECIFIC USER
app.delete("/api/:user_id", (req, res) => {

    //Delete the details of an existing person
    //Obtain the ID of the user from the params 

    const text = 'SELECT * FROM persons_table WHERE id=$1'
    const values = [req.params.user_id]

    pool.query(text, values).then((response) => {
        //After querying the database an array of the values is returned in JSON format
        //Checking if the record of the given user exists in the database 
        if (response.rows.length == 0) {
            res.json({
                status: 200,
                message: 'No results found for the given ID'
            })
        } else {

            //User exists within the database now delete
            const text_one = 'DELETE FROM persons_table WHERE id=$1'
            const values_one = [req.params.user_id]

            pool.query(text_one, values_one).then((response) => {
                res.json({
                    status: 200,
                    message: `Deleted the user with ID ${req.params.user_id}`
                })
            }).catch((err) => {
                res.json({
                    status: 500,
                    message: 'Internal server error failed establishing connection to the database'
                })
            })



        }

    }).catch((err) => {
        res.json({
            status: 500,
            message: 'Internal server error failed establishing connection to the database'
        })
    })
})


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})