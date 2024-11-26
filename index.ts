/*
* Author: Md. Sholayman
* Description: This file contains the server
* Date: 26 November 2024
*/



import app from "./app";

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port @${process.env.PORT}...`);
});
