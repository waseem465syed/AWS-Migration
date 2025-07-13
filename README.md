# AWS CDK Infrastructure Project (TypeScript)

This project demonstrates a modular infrastructure-as-code (IaC) implementation using the **AWS Cloud Development Kit (CDK)** in **TypeScript**. The stack provisions foundational AWS resources such as **IAM roles**, **EC2 instances**, and **RDS databases**, structured across reusable and isolated stacks for better scalability and maintenance.

---

## 🏗️ Project Architecture

The CDK application is divided into the following modular stacks:

### 1. `IamStack`
- Creates IAM roles and policies.
- Ensures secure and principle-of-least-privilege permissions for compute resources.

### 2. `Ec2Stack`
- Provisions Amazon EC2 instances within a defined VPC and security group.
- Installs basic software using user data scripts.

### 3. `RdsStack`
- Creates an Amazon RDS instance (e.g., MySQL or PostgreSQL).
- Secure connection enabled using security groups and credentials managed via CDK.

### 4. `CdkProjectStack`
- The main stack that orchestrates deployment and integrates sub-stacks.
- Deployed from the `bin/cdk-project.ts` entry point.

---

## 📁 Project Structure

```text
.
├── bin/
│   └── cdk-project.ts        # Entry point of the CDK application
├── lib/
│   ├── cdk-project-stack.ts  # Main orchestration stack
│   ├── ec2-stack.ts          # EC2 resource definitions
│   ├── iam-stack.ts          # IAM roles and policies
│   └── rds-stack.ts          # RDS database setup
├── cdk.json
├── package.json
├── tsconfig.json
└── README.md

🚀 Deployment Instructions
1. Prerequisites

Ensure the following are installed:

    Node.js (v14+)

    AWS CDK CLI

    AWS CLI with valid credentials

2. Install Dependencies

npm install

3. Bootstrap the CDK (if not done previously)

cdk bootstrap

4. Deploy the Stack

cdk deploy

🛠️ Useful CDK Commands

cdk synth      # Synthesizes the CloudFormation template
cdk deploy     # Deploys the app to AWS
cdk destroy    # Deletes the deployed resources
cdk diff       # Shows diff between deployed and local changes

📌 Best Practices Demonstrated

    Modular design using separate stacks for IAM, EC2, and RDS

    Secure IAM role creation with scoped permissions

    Separation of concerns for scalable cloud architecture

    Use of constructs and stack composition for code reuse