# App Modernization with AWS Fargate(ECS) and MongoDB Atlas

## Introduction: 
This is a technical repo to demonstrate the application deployment using MongoDB Atlas and AWS Fargate.
This tuotorial is intended for those who wants to
1. Serverless Application Deployment for Production Environment
2. Production deployment to auto scale, HA and Security
3. Agile development of application moderinzation
4. Deployment of containerized application in AWS
5. Want to try out the AWS Fargate and MongoDB Atlas 

## [MongoDB Atlas](https://www.mongodb.com/atlas) 
MongoDB Atlas is an all purpose database having features like Document Model, Geo-spatial , Time-seires, hybrid deployment, multi cloud services.
It evolved as "Developer Data Platform", intended to reduce the developers workload on development and management the database environment.
It also provide a free tier to test out the application / database features.


## [AWS Fargate](https://aws.amazon.com/fargate/)
AWS Fargate is a serverless, pay-as-you-go compute engine that lets you focus on building applications without managing servers. AWS Fargate is compatible with both Amazon Elastic Container Service (ECS) and Amazon Elastic Kubernetes Service (EKS).

## Architecture Diagram:

<img width="800" alt="image" src="https://user-images.githubusercontent.com/101570105/200035448-797a15d3-62d7-4a21-b780-c64c3962e8b9.png">


## Pre-requisite:
Code editor: [VSCode](https://code.visualstudio.com/download)

Container: [Docker Desktop (with docker compose)](https://www.docker.com/products/docker-desktop/)

Command Line execution: [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html)



## Step by Step Fargate Deployment:


### **Step1a: Set up the MongoDB Atlas cluster**


Please follow the [link](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster) to setup a free cluster in MongoDB Atlas



### Step1b: Configure the Network access **

Configure the database for [network security](https://www.mongodb.com/docs/atlas/security/add-ip-address-to-list/) 




### Step1c: Set up the Role based Authencation

Follow the [link](https://www.mongodb.com/docs/atlas/security/passwordless-authentication/#aws-ecs-fargate:~:text=an%20IAM%20role.-,AWS%20ECS%20Fargate,-To%20learn%20how) for IAM Role based authentication for [AWS Fargate](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html#create-task-execution-role)

On successfull creation of the role, click "Add permissions" and select "Attach policies" to add "AmazonEC2ContainerRegistryReadOnly" policy to the role.


<img width="1725" alt="image" src="https://user-images.githubusercontent.com/101570105/201688148-d3ad49a4-a067-44ef-8860-c7350e28cda1.png">



Copy the ARN created for the role

Select IAM Type as IAM role in MongoDB Atlas for the database user and  provide the ARN as shown below

![image](https://user-images.githubusercontent.com/114057324/201102950-4176fdc2-d3d7-4743-bef7-738553f75bd4.png)



### **Step2: Copy the code and configure **  

Git clone the code from the repository

              git clone https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate.git
              
              cd code/MEANSTACK/partner-meanstack-atlas-fargate



Open the code in VSCode

Configure the MongoDB Connection string in ".env" in partner-meanstack-atlas-fargate --> server --> .env file. Update the server details.



<img width="1204" alt="image" src="https://user-images.githubusercontent.com/101570105/201385351-e462d966-615a-40ca-8be7-0494c7cb90a3.png">




### **Step3a: Create the Elastic Container Repository(ECR)  **  

Setup the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html) environment

Create the ECR and note down the URI for each of the repository.

                  	aws ecr create-repository \
                  --repository-name partner-meanstack-atlas-fargate-client \
                  --image-scanning-configuration scanOnPush=true \
                  --region us-east-1
                  
                  
                   aws ecr create-repository \
                  --repository-name partner-meanstack-atlas-fargate-server \
                  --image-scanning-configuration scanOnPush=true \
                  --region us-east-1



### **Step3b: Open the code and update for docker-compose.yaml **  



Configure the Docker image in "docker-compose.yml" in partner-meanstack-atlas-fargate folder.

Update the details for x-aws-vpc , x-aws-role, images of both server and client and platform. For the image, paste the URI copied from earlier step.

Ensure the VPC is having atleast two public subnets in different AZs. if any of the subnets are in the same AZs, the docker-compose up command will fail.

<img width="1139" alt="image" src="https://user-images.githubusercontent.com/101570105/201689664-3ea7fe68-0e90-4baf-aac7-193fac998b0a.png">




Ensure the docker desktop is up and running. if not start the [docker deamon](https://docs.docker.com/config/daemon/)








### **Step4: Build the docker image and push to ECR **  

update the ECR URI with the account_id in the below command.

ensure the current directory is ...code/partner-meanstack-atlas-fargate


		aws ecr get-login-password --region us-east-1| docker login --username AWS --password-stdin <account_id>.dkr.ecr.us-east-1.amazonaws.com

		docker context use default

		docker compose build

		docker compose push

		docker context create ecs  partner-meanstack-atlas-fargate

		docker context use partner-meanstack-atlas-fargate

		docker compose up
         



Note: While creating the docker context, it will give option for selecting the AWS authentication. Choose the default. Please refer [link](https://docs.docker.com/cloud/ecs-integration/) for further details


************************************************************************

? Create a Docker context using:  [Use arrows to move, type to filter]

> An existing AWS profile

  AWS secret and token credentials
  
  AWS environment variables
  
************************************************************************


This will automatically create the AWS CloudFormation stack and deploy the stack.


![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/cloudformation.png)


Verify the the stack is completed successfully


Verify the ECS cluster , task definition and services are created successfully.

<img width="1724" alt="image" src="https://user-images.githubusercontent.com/101570105/201421165-d5f4c212-ae2f-4419-b2e6-14e009128009.png">


<img width="1724" alt="image" src="https://user-images.githubusercontent.com/101570105/201421736-0fa26d10-faec-434e-9b5d-2c080bd3aa30.png">


<img width="1724" alt="image" src="https://user-images.githubusercontent.com/101570105/201420271-1eb283a9-d8c8-42af-8147-32a61cd59e52.png">



Copy the DNS Name from the Load Balancer

<img width="1728" alt="image" src="https://user-images.githubusercontent.com/101570105/201686833-ea1162e2-b64e-4287-9ec7-4418f6f6bf22.png">


update the private url in code with the copied DNS Name. (partner-meanstack-atlas-fargate --> client --> src --> app --> employee.service.ts )

<img width="1395" alt="image" src="https://user-images.githubusercontent.com/101570105/201687263-25bfc59b-efb0-4890-808a-1aac91ccb912.png">

Ensure the code is saved successfully.

complete the rebuild. It will be a rolling update and the changes will be deployed, without impact to the running instances.

		docker compose use default
		
		docker compose build
		
		docker compose push
		
		docker context use partner-meanstack-atlas-fargate

		docker compose up
		

Ensure the both the client and server tasks are up and running after the update.

<img width="1723" alt="image" src="https://user-images.githubusercontent.com/101570105/201417465-06cd97ec-561b-4d73-ba4e-affa1f79db33.png">



Ensure the AWS Cloud map service is registered with both client and server services.

<img width="1723" alt="image" src="https://user-images.githubusercontent.com/101570105/201417137-036036f9-c93c-466a-9c6c-7f4605389300.png">


copy the public ip address of the client task

<img width="1696" alt="image" src="https://user-images.githubusercontent.com/101570105/201416515-4fc6f497-cd4d-4f44-b885-bd1b144ce6eb.png">


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

Test the application by invoking the public ipaddress:8080 copied from the above step.


<img width="1637" alt="image" src="https://user-images.githubusercontent.com/101570105/201416331-d9f891fb-fd5c-4e69-9824-02fb6b78cb80.png">


## Summary:

 Hope this provide the steps to successfully deploy the containerized application on to AWS Fargate. 

 Pls share your feedback / queries to partners@mongodb.com
