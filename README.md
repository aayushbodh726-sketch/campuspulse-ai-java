# CampusPulse AI — Java + Spring Boot + MySQL Edition

**A student-built smart campus issue reporting and resolution platform** for a college interview or portfolio demonstration.

> This is a student project prototype, not an official APG Shimla University system. The included records and account credentials are illustrative. Do not publish the demo accounts or place real student records in this project.

## Why this edition exists

The live Hatchable prototype uses Hatchable's hosted JavaScript runtime and PostgreSQL. This separate edition is designed to demonstrate the requested **Java + Spring Boot + MySQL** stack. It is a runnable local project; it does not replace or modify the Hatchable deployment.

## Features in this MVP

- Spring Security form login with BCrypt password hashing and three demo roles: student, staff, administrator.
- Relational persistence with MySQL and Spring Data JPA.
- Ticket creation with validation, category-to-department routing, generated ticket numbers, priority suggestions, and resolution targets.
- Role-aware ticket visibility: students see their own tickets, staff see their department/assigned tickets, admins see all tickets.
- Controlled ticket-status transitions with timestamped audit history.
- Dashboard totals, open/overdue/resolved counts, average resolution hours, and category reports.
- Recurring-issue detection by category + location over the previous 90 days.
- Campus notices and a verified FAQ context for the assistant.
- Optional server-side Grok assistant integration. The API key is read from an environment variable and is never sent to the browser.
- Responsive screens, validation feedback, seeded demo tickets, policy unit tests, and Docker Compose for local MySQL.

## Technology

- Java 21
- Spring Boot 3.5.16
- Spring MVC + Thymeleaf
- Spring Security
- Spring Data JPA / Hibernate
- MySQL 8.4 LTS
- Maven
- Optional xAI Grok API (`grok-4.7` by default, configurable)

## Fastest setup on Windows + VS Code

### 1. Install the tools

Install a JDK 21, Maven 3.6.3+, and either Docker Desktop or MySQL Server 8.4. Restart VS Code after installing the JDK and Maven, then open the `campuspulse-java` folder.

Verify from the VS Code terminal:

```powershell
java -version
mvn -version
```

### 2. Start MySQL using Docker (recommended for the first run)

From the project folder:

```powershell
docker compose up -d mysql
```

This creates a local database called `campuspulse` and a development database user. The local credentials are defined in `docker-compose.yml`; they are for development only. Do not reuse them for a hosted production database.

If MySQL is already installed locally instead, create a database named `campuspulse` and update `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` for your local database.

### 3. Run the application

```powershell
mvn spring-boot:run
```

Open **http://localhost:8080**. Hibernate creates/updates the development tables and the demo initializer adds example departments, categories, accounts, notices, FAQs, and tickets on first run.

### 4. Sign in with a demo account

| Role | Email | Password |
|---|---|---|
| Student | `student@campuspulse.local` | `Student123!` |
| Staff | `staff@campuspulse.local` | `Staff123!` |
| Administrator | `admin@campuspulse.local` | `Admin123!` |

These accounts are seeded only while `APP_DEMO_SEED=true` (the development default). They are deliberately simple local demo credentials. **Never deploy with demo seeding enabled or leave these passwords usable on a public server.**

### 5. Turn on the Grok assistant (optional)

Create an API key in the xAI Console. Then set it in the terminal **before starting the Java app**:

```powershell
$env:XAI_API_KEY="your-xAI-api-key"
$env:XAI_MODEL="grok-4.7"
mvn spring-boot:run
```

The service uses the server-side xAI endpoint configured as `https://api.x.ai/v1`. The API key must remain private. Do not paste it into HTML/JavaScript, screenshots, GitHub, or this chat. API usage may incur charges. If no key is set, the assistant shows a safe setup message and core ticket features continue to work.

## Useful commands

Run the unit tests:

```powershell
mvn test
```

Build an executable JAR:

```powershell
mvn clean package
```

Run the built JAR:

```powershell
java -jar target/campuspulse-java-1.0.0.jar
```

Stop the local MySQL container:

```powershell
docker compose down
```

Remove the local MySQL volume and all local database data (destructive):

```powershell
docker compose down -v
```

## Project structure

```text
campuspulse-java/
├── pom.xml
├── docker-compose.yml
├── .env.example
├── database/
│   └── reference-schema.sql
├── docs/
│   └── architecture.md
└── src/
    ├── main/java/com/campuspulse/
    │   ├── CampusPulseApplication.java
    │   ├── config/          # Spring Security
    │   ├── controller/      # MVC routes and request handling
    │   ├── dto/             # Form objects and dashboard summary
    │   ├── model/           # JPA entities and enums
    │   ├── repository/      # Spring Data JPA interfaces
    │   └── service/         # Ticket rules, dashboard, seeding, Grok client
    ├── main/resources/
    │   ├── application.properties
    │   ├── templates/       # Thymeleaf pages + fragments
    │   └── static/          # CSS and small progressive-enhancement JS
    └── test/java/           # Ticket policy unit tests
```

## Data model

- `app_users` — accounts, password hashes, role, optional department
- `departments` — IT services, facilities, housekeeping, administration
- `ticket_categories` — category-to-department mappings
- `tickets` — ticket, impact, urgency, priority, status, deadline and assignment
- `ticket_history` — immutable status change history records
- `campus_notices` — published campus guidance
- `campus_faqs` — verified answer source for Grok context

The current development configuration uses `spring.jpa.hibernate.ddl-auto=update` for convenience. Before a production deployment, switch to reviewed Flyway/Liquibase migrations and `ddl-auto=validate`, disable demo seeding, configure HTTPS and secure hosting, rotate all credentials, and review privacy, retention, and access policies.

## Security and privacy notes

- Passwords are hashed using BCrypt.
- Spring Security protects authenticated pages and checks staff/admin roles on restricted routes.
- Ticket-level access is additionally enforced in the service layer; merely guessing another ticket's ID does not grant access.
- CSRF protection remains enabled for server-rendered form posts.
- The Grok key is read by the server; the browser never receives it.
- The assistant is grounded in the FAQ content provided to it and must not invent official campus policy. Urgent safety issues must be directed to verified emergency/campus contacts.
- This MVP does not provide email verification, user self-registration, file uploads, real-time notifications, or multi-campus tenancy.

## Suggested interview demo

1. Sign in as Student and submit a Wi-Fi issue in `Block B · Computer Lab`.
2. Open the ticket and show the category, priority, deadline, and initial history event.
3. Sign out and sign in as Staff. Open a ticket assigned to the IT Services department and change its status.
4. Sign in as Admin and show the role/department assignment screen.
5. Open Campus Insights and explain category counts and recurring issue detection.
6. Ask CampusPulse AI how to report an issue (with the XAI key configured).
7. Explain the layered architecture: Controller → Service → Repository → MySQL, plus security at the route and service levels.

## Known limitations

- This is an interview-oriented MVP, not production-ready campus software.
- Demo accounts and demo records are for local testing only.
- The Grok integration needs a separately configured xAI API key in this Java runtime, even if another AI provider was connected to the Hatchable version.
- The visual pages are server-rendered with Thymeleaf, not a SPA.
- Before real deployment, add integration tests against a disposable MySQL instance, database migrations, registration/invitation management, user administration audit records, and a formal privacy review.
