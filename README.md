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
![AWS Fargate(ECS) with MongoDB Atlas](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/FargateArchitecture.png)

## Pre-requisite:
Code editor: [VSCode](https://code.visualstudio.com/download)

Container: [Docker](https://docs.docker.com/get-docker/) and  [Docker compose](https://docs.docker.com/compose/install/)

Command Line execution: [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html)



## Step by Step Fargate Deployment:


### **Step1: Set up the MongoDB Atlas cluster**


Please follow the [link](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster) to setup a free cluster in MongoDB Atlas

Configure the database for [network security](https://www.mongodb.com/docs/atlas/security/add-ip-address-to-list/) and [access](https://www.mongodb.com/docs/atlas/tutorial/create-mongodb-user-for-cluster/).

### **Step2: Create the Elastic Container Repository(ECR)  **  

Setup the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html) environment

Create the ECR 

                  aws ecr create-repository \
                      --repository-name <repository name> \
                      --image-scanning-configuration scanOnPush=true \
                      --region <region>

### **Step3: Copy the code and configure **  

Git clone the code from the repository

              git clone https://github.com/mongodb-partners/MEANStack_with_Atlas_on_Fargate.git

Open the code in VSCode

![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/VSCode1.png)

Configure the MongoDB Connection string in "config.txt"

![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/VSCode2.png)



Configure the Docker image in "docker-compose.yml" under docker-ecs

![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/VSCode3.png)




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
![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/ECS3.png)

Copy the public IP address from the running task 



### **Step7: Testing the Application**

Test the application by invoking the <public ipaddress:8000> copied from the above step.

![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/Output1.png)
![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/Output2.png)
![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/Output3.png)


## Troubleshoot:
If the default VPC and Subnet are restricted to public access, a separate task can be created with the customized VPC , Subnet and Security Group.


![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/Output4.png)
![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/Output3c.png)
![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/Output3b.png)


## Summary:

 Hope this provide the steps to successfully deploy the containerized application on to AWS Fargate. 

 Pls share your feedback / queries to partners@mongodb.com
