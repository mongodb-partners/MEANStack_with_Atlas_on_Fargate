// import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connectToDatabase } from "./database";
import { employeeRouter } from "./employee.routes";


import {
    SecretsManagerClient,
    GetSecretValueCommand,
    GetSecretValueCommandOutput
  } from "@aws-sdk/client-secrets-manager";
  
  const secret_name = "workshop/atlas_secret";
  
  const client = new SecretsManagerClient({
  });
  
  let response :string;
  
  client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
  ).then((data:any) => {
      let response = data;  
      const secret = response ? response.SecretString : null;
      const ATLAS_URI = secret;
      
      connectToDatabase(ATLAS_URI)
          .then(() => {
              const app = express();
              app.use(cors());
              app.use("/employees", employeeRouter);
      
              // start the Express server
              app.listen(5200, () => {
                  console.log(`Server running at http://localhost:5200...`);
              });
      
          })
          .catch(error => console.error(error));
      
    }
    ).catch((error:any) => {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    console.log(error);
    });

