
# 🏥 TechHealth Inc. AWS Infrastructure Modernization

This repository contains a complete AWS Infrastructure-as-Code (IaC) solution using AWS CDK (TypeScript) to migrate TechHealth Inc.’s legacy, console-created infrastructure into a secure, scalable, and repeatable cloud environment.

---

## 📌 Project Overview

**Client:** TechHealth Inc.  
**Objective:** Modernize a manually-built AWS infrastructure by adopting best practices using AWS CDK and CI/CD for version control, automation, and security.  

---

## 📐 Target Architecture

- **VPC** with proper public/private subnet separation
- **EC2 instance** in a **public subnet**
- **RDS MySQL** database in a **private subnet**
- **IAM Roles** for EC2 instance access via SSM
- **Security Groups** following least-privilege principles
- **Secrets** securely managed (e.g., using AWS Secrets Manager)

📶 **Network Flow**:
```
[Admin IP] → [EC2 in Public Subnet] → [RDS in Private Subnet]
```

---

## 🧱 CDK Stack Breakdown

| Stack File           | Responsibility                             |
|----------------------|---------------------------------------------|
| `cdk-project-stacks.ts` | VPC + Subnets + Network segmentation       |
| `iam-stack.ts`          | IAM roles & policies for EC2 access        |
| `ec2-stack.ts`          | EC2 instance + Security Group              |
| `rds-stack.ts`          | RDS MySQL instance + Security Group        |

---

## 📂 Project Structure

```
techhealth-iac/
├── lib/
│   ├── cdk-project-stacks.ts      # VPC & Network
│   ├── iam-stack.ts               # IAM roles
│   ├── ec2-stack.ts               # EC2 instance
│   └── rds-stack.ts               # RDS DB
├── bin/
│   └── main.ts                    # CDK app entry point
├── .gitignore
├── package.json
├── cdk.json
└── README.md                      # Project documentation
```

---

## 🚀 Deployment Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Bootstrap your AWS environment (once per environment)**
   ```bash
   cdk bootstrap
   ```

3. **Deploy all stacks**
   ```bash
   cdk deploy
   ```

4. **Destroy stacks (to avoid charges)**
   ```bash
   cdk destroy
   ```

---

## ✅ Success Criteria

- ✔️ Infrastructure is version-controlled
- ✔️ EC2 can SSH via specific admin IP
- ✔️ EC2 successfully connects to RDS
- ✔️ RDS is not publicly accessible
- ✔️ IAM roles provide only needed permissions
- ✔️ Network follows least-privilege access model

---

## 🛡️ AWS Best Practices Applied

- Network segregation with public/private subnets
- No public access to RDS
- IAM Roles for EC2 (not hard-coded credentials)
- Secrets securely generated and stored
- Cost-optimized with Free Tier instances (`t2.micro`, `db.t3.micro`)
- Destruction/redeployment tested for consistency

---

## 📘 Documentation

- [x] Architecture diagram (local or Lucidchart)
- [x] README.md
- [x] Inline code comments
- [x] Setup and deployment guide

---

## 🔒 Security Notes

- SSH is restricted to admin IP (`your-ip/32`)
- RDS MySQL only accepts traffic from EC2 SG
- IAM Role includes **AmazonSSMManagedInstanceCore** for SSM Session Manager (no key-pair login)

---


