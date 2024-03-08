# App Modernization with AWS Fargate(ECS) and MongoDB Atlas

## Introduction:
This is a technical repo to demonstrate the application deployment using MongoDB Atlas and AWS Fargate.
This tutorial is intended for those who want to
1. Serverless Application Deployment for Production Environment
2. Production deployment to auto-scale, HA, and Security
3. Agile development of application modernization
4. Deployment of containerized application in AWS
5. Want to try out the AWS Fargate and MongoDB Atlas

## [MongoDB Atlas](https://www.mongodb.com/atlas)
MongoDB Atlas is an all-purpose database having features like Document Model, Geo-spatial, Time Series, hybrid deployment, and multi-cloud services.
It evolved as a "Developer Data Platform", intended to reduce the developer workload on the development and management of the database environment.
It also provides a free tier to test out the application/database features.


## [AWS Fargate](https://aws.amazon.com/fargate/)
AWS Fargate is a serverless, pay-as-you-go compute engine that lets you focus on building applications without managing servers. AWS Fargate is compatible with both Amazon Elastic Container Service (ECS) and Amazon Elastic Kubernetes Service (EKS).

## Architecture Diagram:

<img width="359" alt="image" src="https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate/assets/101570105/b21ceaf2-667e-40d1-a6c1-653f2d65ef27">




## Pre-requisite:

AWS Console access



## Step-by-Step Fargate Deployment:


### Step 1: Set up the MongoDB Atlas cluster**


Please follow the [link](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster) to set up a free cluster in MongoDB Atlas



### Step 1a: Configure the Database access and Network Security

Configure the database for [database access](https://www.mongodb.com/docs/atlas/tutorial/create-mongodb-user-for-cluster/) and  [network security](https://www.mongodb.com/docs/atlas/security/add-ip-address-to-list/)


### Step 2: Create the secret in the Secret Manager


a. In AWS Console navigate to Secret Manager and click on Store a New secret


![image](https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate/assets/101570105/6a1a0d8d-f65d-474d-84fc-18e0b5834f94)


b. Choose Other type of secret then Plaintext tab and provide the full URL of MongoDB Atlas Cluster

![image](https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate/assets/101570105/e34bfad9-a967-4c29-9e3e-2ee0ba0875ac)


c. Proceed to the next page where you supply the secret name as ```workshop/atlas_secret```

![image](https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate/assets/101570105/337ab139-a02a-4d01-9c1d-6c0635161f5f)

d. Continue to other pages without any changes to store the secret

![image](https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate/assets/101570105/bcd0838f-5b03-4db7-9280-8d46d8b4dc4c)

e. Confirm the secret is created by observing it listed on the page. Note: you might need to hit the refresh button to reload the secrets.

![image](https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate/assets/101570105/44057453-1f55-4e63-b71f-60b5226bd87a)



### Step 3: Login to the AWS Console cloud shell and set up the ECS Copilot Application and environment

a. Login to AWS Console and launch the cloud shell
![image](https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate/assets/101570105/ec45cc06-87a5-4a3a-8810-902af43a3e1c)


b. Install ECS Copilot CLI by running the following commands

    sudo curl -Lo /usr/local/bin/copilot https://github.com/aws/copilot-cli/releases/latest/download/copilot-linux    && sudo chmod +x /usr/local/bin/copilot    && copilot --help


c. Clone the GitHub repository for the code

    git clone https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate.git
    cd MEANStack_with_Atlas_on_Fargate/code/MEANSTACK/partner-meanstack-atlas-fargate



<img width="1108" alt="image" src="https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate/assets/101570105/9f43a6ea-fe1b-4a26-b4fe-1498de66a98c">




d. Install the Application and Environment

    copilot init


<img width="888" alt="image" src="https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate/assets/101570105/77a34958-6317-4924-9cc3-5767f0ef841e">



Type your application a name ```atlasmean``` and hit Enter Key

Next, select Load Balanced Web Service and hit Enter Key


<img width="980" alt="image" src="https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate/assets/101570105/f90b1538-301d-4d43-9025-43da0b52790e">


We are now creating a service. There's a predefined service called server. Type ```server``` as the service name.

<img width="895" alt="image" src="https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate/assets/101570105/f86802ad-8d50-4136-9e3e-042eb6705572">



Select the ```server/Dockerfile``` from the menu and hit Enter key

<img width="975" alt="image" src="https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate/assets/101570105/f0641acd-d305-4015-9876-32917910fc2e">



Wait till initial infrastructure provisioning finishes and you are prompted for a deployment environment

Press `y` to deploy

![image](https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate/assets/101570105/d4412f58-2c8d-4c1f-8236-c6c26331e911)


Supply the environment name ```dev``` and hit Enter Key.

![image](https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate/assets/101570105/75bc635b-2f82-4eb1-8bc1-c6e327267081)


Ensure the server is deployed successfully.


<img width="968" alt="image" src="https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate/assets/101570105/733327a4-93c4-415e-bdb3-494bdd3b0967">



### Step 5: Update the Server URI to the frontend code

For the frontend application to communicate to the server service, it needs to know the server service URI. We have a placeholder in the code where you need to make the change.

a. First, we need to find the server service DNS. In AWS Console, navigate to EC2 and then in Left Side Navigation to Load Balancing|Load Balancers. Note the DNS name in the bottom right part of the page.


<img width="968" alt="image" src="https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate/assets/101570105/529cd7a0-2ed8-4f67-8d51-8e43b4db1aee">



<img width="968" alt="image" src="https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate/assets/101570105/0b3c69d3-8677-4c52-a3ca-4c61d850e818">



b. Next update ```employee.service.ts``` to point to the DNS. Leave the port as is.

<img width="921" alt="image" src="https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate/assets/101570105/190b790e-acca-49c4-a146-401ba4015f9a">



c. Run the following command

    nano client/src/app/employee.service.ts



d. Use arrow keys to navigate to the placeholder, and paste the DNS keeping the port number intact.

![image](https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate/assets/101570105/93254480-484f-4957-b123-12882025e76f)

e. ```Ctrl-X``` to save

![image](https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate/assets/101570105/d79293c7-0460-4c64-8956-39bea6c4a5e4)



### Step 6: Deploy the front-end code

a. Use the same command we used before ```copilot init``` and select ```Load Balanced Web Service```

<img width="962" alt="image" src="https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate/assets/101570105/44f00eb3-4eff-41e5-a64c-8ebb2d0a5213">



b. Supply ```frontend``` as the service name

<img width="894" alt="image" src="https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate/assets/101570105/5668079c-83d5-4d0b-bf89-cfece6069697">

c. Press `y` to deploy, and chose the `dev` environment we created earlier.

d. If you get the message below. Then type ```copilot deploy```.

![image](https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate/assets/101570105/63b8911e-5557-47d3-b500-ca3dd0a19cbf)


e. Make sure you select frontend (using the spacebar)

![image](https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate/assets/101570105/00e08fe1-16dc-41af-913d-f6aa30755927)


f. Wait for the deployment process to complete in AWS Console CloudFormation UI or from the CloudShell. You should see at least one running task.

![image](https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate/assets/101570105/dbd48dfc-f917-4a3f-b744-c3d83ab7296c)


g. Now, you need to find the DNS for the frontend.
Like before, navigate to EC2 --> Load Balancing --> Load Balancers.
Note there are now two load balancers, one for the frontend and the other for the server.
Select the frontend one. It has a listener configured on port 8080.

![image](https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate/assets/101570105/07087a23-e726-471e-a17b-5623d943a689)


![image](https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate/assets/101570105/53d562e2-6f6d-42f9-b2b8-de4ff584b005)



h. Now switch to the details tab and copy the DNS

<img width="982" alt="image" src="https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate/assets/101570105/a9165e35-8efa-4e29-9436-240da63ac5ca">



### Troubleshooting:

In case above steps dont work, use aws-cli to create Task definition and Service

https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_AWSCLI_Fargate.html

JSON File: 
```
{
    "family": "partner-meanstack-server-cli", 
    "networkMode": "awsvpc", 
    "executionRoleArn": "<execution_role_arn>",
    "taskRoleArn": "<execution_role_arn>",
    "containerDefinitions": [
        {
            "name": "<name_for_container>", 
            "image": "<ecr_image_uri>", 
            "portMappings": [
                {
                    "containerPort": 5200, 
                    "hostPort": 5200, 
                    "protocol": "tcp"
                }
            ], 
            "essential": true, 
        }
    ], 
    "requiresCompatibilities": [
        "FARGATE"
    ], 
    "memory": "4096", 
    "cpu": "2048"
}
```

Task Definition: ``` aws ecs register-task-definition --cli-input-json file:<path_to_file> ```

<img width="1314" alt="Screenshot 2022-11-28 at 12 41 04 AM" src="https://user-images.githubusercontent.com/114057324/204155274-f739e15b-020f-4763-8dfe-10cd52d7ed34.png">

Service:  ```aws ecs create-service --cluster <cluster_name> --service-name <service_name> --task-definition <task_definition_name> --desired-count 1 --launch-type "FARGATE" --network-configuration "awsvpcConfiguration={subnets=[subnet-abc123],securityGroups=[sg-abc123],assignPublicIp="ENABLED"}"```

<img width="1302" alt="Screenshot 2022-11-28 at 12 46 04 AM" src="https://user-images.githubusercontent.com/114057324/204155258-5494abd4-d452-4fb7-97b3-0e11cbb8299b.png">

<img width="1728" alt="Screenshot 2022-11-28 at 9 39 52 AM" src="https://user-images.githubusercontent.com/114057324/204192422-dfb2644f-b102-474a-95b9-b2333f49c544.png">



### **Step7: Testing the Application**

Test the application by invoking the <"DNS for frontend loadbalancer">:8080 copied from the above step.


<img width="1588" alt="image" src="https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate/assets/101570105/6601999f-efd6-4c6e-96b4-086ba491b89b">





## Summary:

Congratulations!! you have successully deployed the containerized application onto AWS ECS Fargte.

### Cleanup

Use the command ```copilot svc ls``` to list all the servrices


Use the command ```copilot svc delete --name frontend``` & ```copilot svc delete --name server``` to delete the services



<img width="806" alt="image" src="https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate/assets/101570105/814e8c7b-cadf-46fa-bc2e-aaa030c18de5">

Pls share your feedback/queries in the comments
