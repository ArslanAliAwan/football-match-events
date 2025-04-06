# 🏟️ Football Match Events - AWS CDK TypeScript Project

This is a cloud infrastructure project built using **AWS CDK** with **TypeScript** for managing football match events. It provisions AWS resources such as **Lambda**, **API Gateway**, **DynamoDB**, **S3**, **EventBridge**, and **IAM roles** to build a scalable event-driven architecture.

---

## 📁 Project Structure

```
infrastructure/
├── bin/
│   └── football-match-event.ts         # CDK entry point
├── lib/
│   ├── apigateway-construct.ts         # API Gateway resources
│   ├── dynamodb-construct.ts           # DynamoDB tables
│   ├── eventbridge-construct.ts        # EventBridge setup
│   ├── iam-constructs.ts               # IAM roles/policies
│   ├── lambda-constructs.ts            # Lambda integration
│   ├── s3-construct.ts                 # S3 bucket setup
│   ├── config.ts                       # Centralized config
│   └── index.ts                        # Stack composition

src/
├── lambdas/
│   ├── ingestion/                      # Ingestion Lambdas
│   ├── processing/                     # Processing Lambdas
│   └── query/                          # Query Lambdas
├── types/                              # Shared types/interfaces

test/                                   # Unit tests

.env                                    # Environment variables
cdk.json                                # CDK app configuration
jest.config.js                          # Test config
tsconfig.json                           # TypeScript config
README.md                               # Project documentation
```

---

## 🚀 Getting Started

### 📦 Install dependencies

```bash
npm install
```

### 🛠️ Useful Commands

- `npm run build` – Compile TypeScript to JavaScript
- `npm run watch` – Watch for file changes and auto-compile
- `npm run test` – Run unit tests via Jest
- `npx cdk synth` – Synthesize CloudFormation template
- `npx cdk diff` – Compare deployed stack with current state
- `npx cdk deploy` – Deploy the stack to your AWS environment

---

## 🧪 Local Deployment (Using LocalStack)

> ⚠️ This setup has **not been fully tested** in this project. The instructions below provide a conceptual overview for local deployment using [LocalStack](https://docs.localstack.cloud).

### 🐳 Start LocalStack

```bash
localstack start
```

### 🔧 Configure AWS CLI (for LocalStack)

```bash
aws configure --profile localstack
# Access Key ID: test
# Secret Access Key: test
# Region: eu-central-1
```

### 🚀 Deploy to LocalStack

Update your CDK stack like this (already done in `football-match-event.ts`):

```ts
env: {
  account: '000000000000', // LocalStack default account
  region: 'eu-central-1'
}
```

Then deploy:

```bash
AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test AWS_REGION=eu-central-1 \
npx cdk deploy --profile localstack
```

> You may need to add custom endpoints in your constructs to point to LocalStack services.

---

## ⚙️ CI/CD Deployment via GitLab

> ⚠️ This setup is **not tested** yet but serves as a base for deploying this CDK stack using GitLab CI/CD.

### ✅ Example `.gitlab-ci.yml`

```yaml
stages:
  - build
  - deploy

before_script:
  - npm install
  - npm run build

build:
  stage: build
  script:
    - echo "Build successful."

deploy:
  stage: deploy
  image: node:18
  script:
    - npm install -g aws-cdk
    - npm ci
    - npm run build
    - npx cdk deploy --require-approval never
  only:
    - main
```

### 🔐 Secrets/Variables Needed

Set the following environment variables in GitLab CI/CD:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION` (e.g. `eu-central-1`)

---

## 🧠 Notes

- Ensure all Lambda handlers in `src/lambdas` are properly referenced in the CDK stack under `lambda-constructs.ts`.
- IAM roles are modularized in `iam-constructs.ts` for secure and scalable permissions.
- Each construct is decoupled to support future testing and reuse.

---

## ⚠️ Disclaimer

> The local deployment using **LocalStack** and the **GitLab CI/CD** pipeline has **not been tested** in this project. The guidance provided here is based on standard best practices and is meant to offer a starting point for a real-world production setup.

---

## 📄 License

MIT © 2025 Arslan Ali Awan
