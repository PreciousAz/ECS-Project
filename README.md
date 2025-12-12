 CI/CD Pipeline to Amazon ECS (EC2 Launch Type)
A complete end-to-end DevOps pipeline deploying a containerized Node.js application to **Amazon ECS (EC2 launch type)** using **GitHub Actions** and **Amazon ECR**.

This project demonstrates real-world AWS infrastructure configuration, CI/CD automation, error handling, and ECS deployment tuning.

---

# 📌 Architecture Overview

**Technologies Used**
- GitHub Actions
- Docker
- Amazon ECS (EC2)
- Amazon ECR
- EC2 Auto Scaling Group
- IAM OIDC Authentication
- Task Definitions & Revisions
- AWS Logs (CloudWatch)

**Deployment Flow**
1. Developer pushes code to GitHub
2. GitHub Actions builds Docker image
3. Image tagged automatically using a version bump script
4. Image pushed to ECR
5. ECS task definition updated programmatically
6. ECS service deploys the new revision to EC2 instance

---

# 🧩 Key Features

### ✔ Fully automated CI/CD pipeline  
Build → Tag → Push → Deploy → Verify

### ✔ Secure AWS authentication using OIDC  
No long-lived AWS keys required.

### ✔ ECS EC2 architecture  
Includes:
- Auto Scaling Group  
- Amazon Linux 2023 ECS-Optimized AMI  
- IAM role + instance profile  
- Proper task execution role

### ✔ Smart ECS Deployment Strategy  
- Minimum healthy percent = 0  
- Maximum percent = 100  
- Ensured compatibility with single-instance clusters

---

# ⚠️ Challenges & Solutions

### 🔹 OIDC authentication failing  
**Fix:** Updated IAM trust policy to allow GitHub OIDC provider.

### 🔹 ECS task definition field errors  
**Fix:** Removed unsupported ECS fields (e.g., `enableFaultInjection`).

### 🔹 EC2 instances failing to launch due to IAM instance profile  
**Fix:** Attached correct instance profile to launch template.

### 🔹 ECS tasks stuck in PENDING  
**Fix:** Adjusted deployment percentages + disabled AZ rebalancing.

---

# 📂 Repository Structure

