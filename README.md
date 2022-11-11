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

Container: [Docker](https://docs.docker.com/get-docker/) and  [Docker compose](https://docs.docker.com/compose/install/)

Command Line execution: [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html)



## Step by Step Fargate Deployment:


### **Step1a: Set up the MongoDB Atlas cluster**


Please follow the [link](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster) to setup a free cluster in MongoDB Atlas



### Step1b: Configure the Network access **

Configure the database for [network security](https://www.mongodb.com/docs/atlas/security/add-ip-address-to-list/) 




### Step1c: Set up the Role based Authencation

Follow the [link](https://www.mongodb.com/docs/atlas/security/passwordless-authentication/#aws-ecs-fargate:~:text=an%20IAM%20role.-,AWS%20ECS%20Fargate,-To%20learn%20how) for IAM Role based authentication for [AWS Fargate](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html#create-task-execution-role)


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
Update the details for x-aws-vpc, images of both server and client and platform. For the image, paste the URI copied from earlier step.

Ensure the VPC is having atleast two public subnets in different AZs. if any of the subnets are in the same AZs, the docker-compose up command will fail.

<img width="1290" alt="image" src="https://user-images.githubusercontent.com/101570105/201418021-295844f4-103b-4b47-8bf7-772813f216bd.png">



Ensure the docker is up and running. if not start the [docker deamon](https://docs.docker.com/config/daemon/)








### **Step4: Build the docker image and push to ECR **  

update the region and ECR URI in the below command.

ensure the current directory in ...code/partner-meanstack-atlas-fargate


		aws ecr get-login-password --region us-east-1| docker login --username AWS --password-stdin <account_id>.dkr.ecr.us-east-1.amazonaws.com

		docker context use default

		docker compose build

		docker compose push

		docker context create ecs  partner-meanstack-atlas-fargate

		docker context use partner-meanstack-atlas-fargate

		docker compose up
         



Note: While creating the docker context, it will give option for selecting the AWS authentication. Choose the default.


************************************************************************

? Create a Docker context using:  [Use arrows to move, type to filter]

> An existing AWS profile

  AWS secret and token credentials
  
  AWS environment variables
  
************************************************************************


This will automatically create the AWS CloudFormation stack and deploy the stack.


![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/cloudformation.png)


Verify the the stack is completed successfully


Verify the ECS cluster , services and tasks are created successfully.

![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/ECS1.png)
![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/ECS2.png)


Copy the public IP address from the server task 

<img width="1204" alt="image" src="https://user-images.githubusercontent.com/101570105/201412861-4127e92c-c9cb-4907-9e18-f6d01f4f6233.png">


update the private uri in code with the copied IP address. (partner-meanstack-atlas-fargate --> client --> src --> app --> employee.service.ts )

<img width="1259" alt="image" src="https://user-images.githubusercontent.com/101570105/201414667-6d388869-1ff9-4af6-8fc0-010eb5efdb7b.png">

complete the rebuild.

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



### **Step7: Testing the Application**

Test the application by invoking the <public ipaddress:8080> copied from the above step.


<img width="1637" alt="image" src="https://user-images.githubusercontent.com/101570105/201416331-d9f891fb-fd5c-4e69-9824-02fb6b78cb80.png">



## Summary:

 Hope this provide the steps to successfully deploy the containerized application on to AWS Fargate. 

 Pls share your feedback / queries to partners@mongodb.com
