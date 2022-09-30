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

## Step by Step Fargate Deployment:


### **Step1: Set up the MongoDB Atlas cluster**
         
   MongoDB Atlas provides a free cluster setup. Pls follow the link to setup the [free cluster](https://www.mongodb.com/docs/atlas/getting-started/)
         
### **Step2: Download and containerize the application**        

  Download the sample application from this repository  - " [FargateDemoApp.zip](https://github.com/Babusrinivasan76/ebsintegrationwithatlas/raw/main/ebsDemoApp.zip) ". 
         
  This application is having 3 APIs to register the user details to MongoDB Atlas(./api/v1/users) , to Query the user (./api/v1/login) and to check the health of the application (./api/v1/health)
         
  Change the .env parameters as per the MongoDB Database and collections you created in step1
         
  Change the database connection details in app.py
  

### **Step3: Set up the VPC, Subnet, NAT Gateway**

  1.login to the AWS Console and search for the VPC Services

  2.Click "Create VPC"

   ![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/01-CreateVPCSubnetNAT.png)


  3.Select "VPC and more", Type the VPC tag name and Enter the IPV4 CIDR block, 

![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/02-createVPCSubnetNAT.png)


  4.Select the number of AZs, Public and Private Subnets, NAT GW , VPC Endpoint and click "Create VPC"

![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/03-createVPCSubnetNAT.png)



### **Step4: Set up the Internet Gateway(IGW)**

1.From the left side panel of VPC menu, select the "Internet Gateway"

2. Click "Create Internet Gateway"

![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/01-createIGW.png)


3. Provide the Name Tag and clicke "Create Internet Gateway"

![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/02-CreateIGW.png)


4. Attach the VPC created in the previous step, by select "Attach to VPC" from "Actions" dropdown

![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/03-CreateIGW.png)


5.Ensure the IGW is created successfully and attached with the VPC

![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/04-CreateIGW-Completion.png)


### **Step5: Set up the RouteTable for Public and Private Subnets**

1.select the "Route Tables" from the left side menu of VPC Services

2.Click "Create Route Table"

![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/01-createpublicrt.png)

3.Enter the Route table name, Select the VPC and add tags. Click "Create Route Table"

![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/02-createpublicrt.png)

4. Associate the public subnets
![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/03-createpublicrt.png)
![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/04-createpublicrt-subnetassociation.png)
![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/05-createpublicrt-subnetassociation.png)

5. Simillarly create the route table for the private subnet and associate the private subnets
![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/06-createprivatert.png)
![](https://github.com/Babusrinivasan76/fargateintegrationwithatlas/blob/main/images/07-createprivatert.png)

### **Step6: Set up ECS Cluster**

[Follow the step provided to create the ECS Cluster](https://github.com/Babusrinivasan76/setupecscluster/blob/main/README.md)

### **Step7: Testing the Application**

Test the application by invoking the endpoint (appended with the /api/v1/healthcheck)



## Summary:

 Any contanirized application can be deployed within no time using this template. 
 Instead of ebsdemoapp.zip , you can use your application zip file and deploy the application.
 Pls share your feedback / queries to partners@mongodb.com
