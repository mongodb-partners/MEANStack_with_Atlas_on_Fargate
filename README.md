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

<img width="1204" alt="image" src="https://user-images.githubusercontent.com/101570105/201373972-3da85a7a-76c0-45d2-a2fd-2b172e134985.png">


Configure the MongoDB Connection string in ".env" in partner-meanstack-atlas-fargate --> server --> .env file.

<img width="1204" alt="image" src="https://user-images.githubusercontent.com/101570105/201374139-0aacba37-81af-4d4e-bd05-759e6522caed.png">


Configure the Docker image in "docker-compose.yml" in partner-meanstack-atlas-fargate folder.
Update the details for VPC, image and platform. For the image, paste the URI copied from earlier step.

<img width="1204" alt="image" src="https://user-images.githubusercontent.com/101570105/201374335-6a888c76-9985-40b8-93d7-e3b8fa17701b.png">


Ensure the docker is up and running. if not start the [docker deamon](https://docs.docker.com/config/daemon/)



### **Step3: Create the Elastic Container Repository(ECR)  **  

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





### **Step4: Build the docker image and push to ECR **  
  
         #!/bin/bash
         
         cd ./MEANStack_with_Atlas_on_Fargate/code/Atlas-AppEngine-Integration/
         
         aws ecr get-login-password --region <region>| docker login --username AWS --password-stdin <account_id>.dkr.ecr.<region>.amazonaws.com
         
         docker build -t <repository name> . --platform=linux/amd64
         
         docker tag <repository name>:latest <accountid>.dkr.ecr.<region>.amazonaws.com/<repository name>:latest
         
         docker images
         
         docker push <accountid>.dkr.ecr.<region>.amazonaws.com/<repository name>:latest
         
     
         

pls refer the [link](https://docs.aws.amazon.com/AmazonECR/latest/userguide/getting-started-cli.html) for reference and troubleshooting.

    
### **Step5: Create the ECS container and run the container ** 

         docker context create ecs  <context name>
         
         docker context use <contenxt name>

         docker-compose up


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


Copy the public IP address from the running task 



### **Step7: Testing the Application**

Test the application by invoking the <public ipaddress:8000> copied from the above step.

![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/Output1.png)
![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/Output2.png)
![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/Output3.png)
![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/Output4.png)

## Troubleshoot:
If the default VPC and Subnet are restricted to public access, a separate task can be created with the customized VPC , Subnet and Security Group.

![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/ECS3.png)
![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/ECS4.png)
![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/ECS3c.png)
![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/ECS3b.png)


## Summary:

 Hope this provide the steps to successfully deploy the containerized application on to AWS Fargate. 

 Pls share your feedback / queries to partners@mongodb.com
