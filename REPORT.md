# Final Project Report - Continuous Integration and Continuous Deployment

## 1. Introduction

The project involved enhancing a **PERN stack (PostgreSQL, Express, React, Node.js)** application by implementing a **BMI Calculator** feature. The goal was to add input fields for height, weight, and age, calculate BMI, store the data in a database, and ensure proper testing using **Jest**.

## 2. Implemented Changes

### A. Database Schema & Configuration

#### Table Schema (`bmi_records`)

```sql
CREATE TABLE bmi_records (
  id SERIAL PRIMARY KEY,
  height DECIMAL NOT NULL COMMENT 'Height in meters',
  weight DECIMAL NOT NULL COMMENT 'Weight in kilograms',
  age INTEGER NOT NULL,
  bmi DECIMAL NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries on creation time
CREATE INDEX idx_bmi_records_created_at ON bmi_records(created_at);
```

**Key Features:**
- **Structured storage** for BMI data (height in meters, weight in kg, age, calculated BMI)
- **Timestamps** to track record creation
- **Indexing** for optimized query performance

### B. Backend (Express/Node.js) Testing

#### Tested Functionality

1. **BMI Calculation Logic**
   - Validated correct BMI computation (`weight / (height²)`)
   - Tested edge cases (zero/negative inputs)

2. **API Endpoints**
   - `POST /api/create/bmi`
     - Input validation (rejects missing/negative values)
     - Correctly stores data in PostgreSQL
   - `GET /api/user/bmi`
     - Returns all records in descending  order
   - `DELETE /api/user/bmi/:id`
     - Validates ID format
     - Handles non-existent records gracefully

3. **Error Handling**
   - Returns `400 Bad Request` for invalid inputs
   - Returns `500 Internal Server Error` for database failures

####  Test Cases (Jest)

```javascript
// backend/tests/bmiCalculator.test.js
const { calculateBMI } = require('../utils/bmiCalculator');

describe('BMI Calculator', () => {
  test('calculates BMI correctly for normal values', () => {
    // Test case 1: Normal values
    const height = 175; // cm
    const weight = 70; // kg
    const expectedBMI = 22.86; // 70 / (1.75 * 1.75)
    
    const result = calculateBMI(height, weight);
    expect(result).toBeCloseTo(expectedBMI, 2);
  });

  test('calculates BMI correctly for edge cases', () => {
    // Test case 2: Very tall
    expect(calculateBMI(200, 80)).toBeCloseTo(20.0, 2);
    
    // Test case 3: Very short
    expect(calculateBMI(150, 50)).toBeCloseTo(22.22, 2);
  });

  test('returns NaN for invalid inputs', () => {
    // Test case 4: Zero height
    expect(calculateBMI(0, 70)).toBeNaN();
    
    // Test case 5: Negative weight
    expect(calculateBMI(170, -50)).toBeNaN();
  });
});
```
![alt text](image/1.png)

### C. Frontend (React) Changes

- Added form inputs for **height (cm), weight (kg), age**
- Implemented **real-time BMI calculation**
- Integrated with backend APIs to **save/fetch/delete** records
- Added user-friendly **error messages** and **success feedback**

### D. CI/CD Implementation Plan

- **Test Automation**: Jest validates core logic
- **Database Migrations**: Managed via Knex
- **Environment Config**: Uses `process.env` for credentials

## 3. Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| PostgreSQL connection issues | Used `ssl: { rejectUnauthorized: false }` for local testing |
| Empty Jest test files | Added minimal test cases or removed unused files |
| Input validation edge cases | Added checks for negative/zero values in backend |

## 4. Current Status

The project has successfully implemented:
- Integrated a **BMI Calculator** with database persistence
- Implemented **RESTful APIs** for CRUD operations
- Ensured **data validity** through backend checks
- Included **automated tests** for critical functionality

## 1. Introduction

The project involved enhancing a **PERN stack (PostgreSQL, Express, React, Node.js)** application by implementing a **BMI Calculator** feature. The goal was to add input fields for height, weight, and age, calculate BMI, store the data in a database, and ensure proper testing using **Jest**.

## 2. Implemented Changes

### A. Database Schema & Configuration

#### Table Schema (`bmi_records`)

```sql
CREATE TABLE bmi_records (
  id SERIAL PRIMARY KEY,
  height DECIMAL NOT NULL COMMENT 'Height in meters',
  weight DECIMAL NOT NULL COMMENT 'Weight in kilograms',
  age INTEGER NOT NULL,
  bmi DECIMAL NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries on creation time
CREATE INDEX idx_bmi_records_created_at ON bmi_records(created_at);
```

#### Database Configuration (`knexfile.js`)

```javascript
module.exports = {
  client: 'pg',
  version: '12',
  connection: {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: { rejectUnauthorized: false }
  },
  pool: { min: 1, max: 2 },
  migrations: { tableName: 'knex_migrations' },
  debug: true
};
```

**Key Features:**
- **Structured storage** for BMI data (height in meters, weight in kg, age, calculated BMI)
- **Timestamps** to track record creation
- **Indexing** for optimized query performance

### B. Backend (Express/Node.js) Testing

#### Tested Functionality

1. **BMI Calculation Logic**
   - Validated correct BMI computation (`weight / (height²)`)
   - Tested edge cases (zero/negative inputs)

2. **API Endpoints**
   - `POST /api/create/bmi`
     - Input validation (rejects missing/negative values)
     - Correctly stores data in PostgreSQL
   - `GET /api/user/bmi`
     - Returns all records in descending chronological order
   - `DELETE /api/user/bmi/:id`
     - Validates ID format
     - Handles non-existent records gracefully

3. **Error Handling**
   - Returns `400 Bad Request` for invalid inputs
   - Returns `500 Internal Server Error` for database failures

#### Example Test Cases (Jest)

```javascript
test("POST /api/create/bmi rejects missing height", async () => {
  const response = await request(app)
    .post("/api/create/bmi")
    .send({ weight: 70, age: 25, bmi: 22.86 });
  expect(response.statusCode).toBe(400);
});

test("BMI calculation returns correct value", () => {
  expect(calculateBMI(175, 70)).toBeCloseTo(22.86, 2); // 70 / (1.75²)
});
```

### C. Frontend (React) Changes

- Added form inputs for **height (cm), weight (kg), age**
- Implemented **real-time BMI calculation**
- Integrated with backend APIs to **save/fetch/delete** records
- Added user-friendly **error messages** and **success feedback**

### D. CI/CD Implementation Plan

- **Test Automation**: Jest validates core logic
- **Database Migrations**: Managed via Knex
- **Environment Config**: Uses `process.env` for credentials

## 3. Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| PostgreSQL connection issues | Used `ssl: { rejectUnauthorized: false }` for local testing |
| Empty Jest test files | Added minimal test cases or removed unused files |
| Input validation edge cases | Added checks for negative/zero values in backend |

## 4. Current Status

The project has successfully implemented:
- Integrated a **BMI Calculator** with database persistence
- Implemented **RESTful APIs** for CRUD operations
- Ensured **data validity** through backend checks
- Included **automated tests** for critical functionality

# 5. Stage 1: Docker Configuration Completion

### What Was Instructed
- Configure Docker volumes for PostgreSQL data persistence
- Modify docker-compose to run tests
- Submit:
  - Modified docker configuration files
  - Screenshot of successful test execution

### What Was Done

1. **Docker Volume Configuration**:

```yaml
# Added to docker-compose-prod.yml
volumes:
  postgres_data:
    driver: local

services:
  db:
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

2. **Test Service Setup**:

```yaml
services:
  test:
    build:
      context: ../backend
      dockerfile: Dockerfile.dev
    command: sh -c "npm install && npm run migrate:latest && npm test"
    depends_on:
      - db
```

3. **Dockerfile Updates**:

```dockerfile
# Added to backend/Dockerfile.dev
COPY database/migrations ./database/migrations
RUN npm install -g knex
```

### Errors Faced & Solutions

#### Error 1: `knex: not found`

![alt text](image/5.png)

**File:** `backend/Dockerfile.dev`  
**Solution:** Added `RUN npm install -g knex`  
**Change Made:** Line 10  
**Evidence:** Updated Dockerfile

#### Error 2: `ENOENT: no migrations directory`

![alt text](image/4.png)

**File:** `backend/Dockerfile.dev`  
**Solution:** Added `COPY database/migrations ./database/migrations`  
**Change Made:** Line 12  
**Evidence:** Dockerfile change

#### Error 3: `ECONNREFUSED ::1:5432`

![alt text](image/2.png)

**File:** `docker/docker-compose-prod.yml`  
**Solution:** Changed hostname to `db` + added `links`  
**Change Made:** Lines 8,17  
**Evidence:** compose file

#### Error 4: `getaddrinfo ENOTFOUND`

![alt text](image/3.png)

**File:** `docker/docker-compose-prod.yml`  
**Solution:** Added `hostname: db` to db service  
**Change Made:** Line 9  
**Evidence:** Final compose file

#### Error 5: `No configuration file found`

**File:** `backend/knexfile.js`  
**Solution:** Ensured correct path to migrations  
**Change Made:** Line 7  
**Evidence:** Updated configuration

### What Was Achieved

**Docker Volume Persistence**
- Verified by:

```bash
docker exec -it postgres_db psql -U postgres -d BMI -c "INSERT INTO bmi_records VALUES(1,1.75,70,25,22.86,NOW());"
docker-compose down && docker-compose up -d db
docker exec -it postgres_db psql -U postgres -d BMI -c "SELECT * FROM bmi_records;"
```

![alt text](image/6.png)
![alt text](image/7.png)

**Automated Testing Pipeline**
- Successful test execution via:

```bash
docker-compose -f docker-compose-prod.yml run test
```

### Required Screenshots

1. **Test Success**:
```bash
docker-compose -f docker-compose-prod.yml run test
```
![alt text](image/8.png)

2. **Volume Verification**:
```bash
docker volume inspect docker_postgres_data
```

![alt text](image/9.png)

3. **Data Persistence**:
```bash
docker exec -it postgres_db psql -U postgres -d BMI -c "SELECT * FROM bmi_records;"
```
![alt text](image/10.png)

## 6. Stage 1 Verification Checklist

| Requirement | Verification Method | Status |
|-------------|-------------------|--------|
| Docker volumes configured | `docker volume inspect` | Complete |
| Tests run via compose | Screenshot of test output | Complete |
| BMI data persists | Manual DB query before/after restart | Complete |

##  7. Execution Flow
```
# Clean environment
docker-compose -f docker-compose-prod.yml down -v

# Rebuild containers
docker-compose -f docker-compose-prod.yml build --no-cache

# Start database
docker-compose -f docker-compose-prod.yml up -d db

# Wait for DB initialization
sleep 5

# Run tests
docker-compose -f docker-compose-prod.yml run test

# Check volume creation
docker volume inspect docker_postgres_data

# Test manual persistence
docker exec -it postgres_db psql -U postgres -d BMI -c "INSERT INTO bmi_records VALUES(1,1.75,70,25,22.86,NOW());"

docker-compose restart

docker exec -it postgres_db psql -U postgres -d BMI -c "SELECT * FROM bmi_records;"l

# Verify network
docker-compose run test ping -c 4 db

```
![alt text](image/11.png)

# Stage 2: Jenkins Local Setup for GitHub Push Automation

## Objective
Configure Jenkins to automatically trigger a pipeline when a commit message contains `@push`, then push the code back to GitHub after running basic build and test stages.

## What We Did

1. **Set Up Jenkins Locally**
   - Installed required plugins (Git, Pipeline, GitHub Integration)

2. **Stored GitHub Credentials in Jenkins**
   - Added a **Personal Access Token (PAT)** with `repo` permissions in GitHub
   - Saved it in Jenkins under **Credentials → Global Credentials** with ID `github-credentials`

![alt text](image/13.png)
![alt text](image/12.png)

3. **Created a Jenkins Pipeline Job**
   - Named the job `Studentnumber_app_pipeline` (e.g., `12345_app_pipeline`)
   - Configured the pipeline to fetch the `Jenkinsfile` directly from the GitHub repository (**SCM integration**)

![alt text](image/14.png)

4. **Wrote the `Jenkinsfile`**
   - Defined stages to:
     1. **Check commit messages** for `@push`
     2. **Build** the application (placeholder for future steps)
     3. **Run tests** (placeholder for Jest tests)
     4. **Push changes back to GitHub** using stored credentials

5. **Tested the Pipeline**
   - Made a commit with `@push` in the message:
   ```bash
   git commit -m "Test Jenkins pipeline @push"
   git push origin main
   ```
   - Verified that Jenkins:
     - Detected the `@push` keyword
     - Executed all stages
     - Pushed the code back to GitHub

## Explanation of the `Jenkinsfile`

The `Jenkinsfile` defines the pipeline stages using **Declarative Pipeline Syntax**:

```groovy
pipeline {
  agent any  // Runs on any available Jenkins agent
  environment {
    // Loads GitHub credentials stored in Jenkins
    GITHUB_CREDS = credentials('github-credentials')
  }
  stages {
    stage('Check Commit Message') {
      steps {
        script {
          // Fetches the last commit message
          def commitMsg = sh(returnStdout: true, script: 'git log -1 --pretty=%B').trim()
          // Fails the pipeline if "@push" is missing
          if (!commitMsg.contains("@push")) {
            error("Commit message does not contain '@push'. Aborting.")
          }
        }
      }
    }
    stage('Build') {
      steps { echo "Building..." }  // Placeholder for build steps (e.g., npm install)
    }
    stage('Test') {
      steps { echo "Running tests..." }  // Placeholder for test commands (e.g., npm test)
    }
    stage('Push to GitHub') {
      steps {
        // Authenticates with GitHub using credentials
        withCredentials([usernamePassword(
          credentialsId: 'github-credentials',
          usernameVariable: 'GITHUB_USER',
          passwordVariable: 'GITHUB_TOKEN'
        )]) {
          sh '''
            git config --global user.email "jenkins@example.com"
            git config --global user.name "Jenkins"
            // Updates the remote URL with credentials and pushes
            git remote set-url origin https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/NamgyelHuk708/DSO101_Final.git
            git push origin HEAD:main
          '''
        }
      }
    }
  }
}
```

## Challenges & Solutions

### Challenge 1: Jenkins couldn't fetch the `Jenkinsfile`
**Solution:** Verified the **repository URL** and **Script Path** in job configuration.

### Challenge 2: Pipeline failed on `@push` check
**Solution:** Ensured the commit message **exactly** contained `@push`.

### Challenge 3: Permission denied during GitHub push
**Solution:** Regenerated the GitHub PAT with `repo` scope and re-added credentials to Jenkins.

## Screenshots

1. **Successful Pipeline Run**  
![alt text](image/16.png)

# Stage 3: GitHub Actions Pipeline for Docker Builds

The goal of Stage 3 was to automate the building and pushing of Docker images for both the **frontend** and **backend** services to **Docker Hub** whenever changes are pushed to the `main` branch of the GitHub repository.

## Implementation Details

1. Docker Hub Integration
- Stored credentials securely using GitHub Secrets (DOCKERHUB_USERNAME, DOCKERHUB_TOKEN).

![alt text](image/20.png)
![alt text](image/19.png)

### Workflow Configuration
Created `.github/workflows/docker-build.yml` with:

```yaml
name: Docker Build and Push
on:
  push:
    branches: [main]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Debug Docker Hub Username
        run: echo "Docker Hub Username length:" $(echo "${{ secrets.DOCKERHUB_USERNAME }}" | wc -c)
        
      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
          
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
        
      - name: Build and Push Backend (Dev)
        uses: docker/build-push-action@v5
        with:
          context: backend
          file: backend/Dockerfile.dev
          push: true
          tags: namgyelhuk708/bmi-backend-dev:latest
          
      - name: Build and Push Frontend (Dev)
        uses: docker/build-push-action@v5
        with:
          context: frontend
          file: frontend/Dockerfile.dev
          push: true
          tags: namgyelhuk708/bmi-frontend-dev:latest
```

## Challenges & Solutions

### Challenge 1: Docker Build Context Missing
**Error:** `docker: 'docker buildx build' requires 1 argument`

**Solution:** Used explicit `context` parameter in build-push-action and verified directory structure matches workflow expectations.

### Challenge 2: Invalid Docker Tag Format
**Error:** `invalid tag "/bmi-backend-dev:latest"`

**Solution:** Added debug step to verify secret length and hardcoded username temporarily for testing.


### Challenge 3: NPM Dependency Conflicts
**Error:** `npm ERR! Fix the upstream dependency conflict`

**Solution:** Modified Dockerfiles to use `--legacy-peer-deps` flag and updated both frontend and backend Dockerfiles.

```dockerfile
# Updated install command in Dockerfile.dev
RUN npm install --legacy-peer-deps
```
## Verification & Testing

### Successful Execution
1. **Workflow Run:** Successfully completed all build and push operations
2. **Docker Hub Results:**
   - Backend image: `namgyelhuk708/bmi-backend-dev:latest`
   - Frontend image: `namgyelhuk708/bmi-frontend-dev:latest`

## Screenshots

1. **Successful Pipeline Run**

 ![alt text](image/17.png)


2. **Docker Hub Images Published**

![alt text](image/18.png)

## Stage 3: Deploy to Render 
1. **Create the DB in the render**

![alt text](image/21.png)

2. **Deploy the backend and update the environment**

![alt text](image/22.png)

![alt text](image/23.png)

3. **Update the environment variable and update the frontend to make ready fo deployment**

![alt text](image/25.png)

4. **Frontend Deployment**

![alt text](image/26.png)

## Remder Url: https://bmi-frontend-dev-8.onrender.com/