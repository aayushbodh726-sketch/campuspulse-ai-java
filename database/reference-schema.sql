-- Reference schema for design discussion. The local app uses JPA/Hibernate ddl-auto=update.
-- Review and convert this into a versioned Flyway/Liquibase migration before production use.
CREATE TABLE departments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE
);
CREATE TABLE app_users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL,
  department_id BIGINT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL,
  CONSTRAINT fk_app_users_department FOREIGN KEY (department_id) REFERENCES departments(id)
);
CREATE TABLE ticket_categories (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  department_id BIGINT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT fk_category_department FOREIGN KEY (department_id) REFERENCES departments(id)
);
CREATE TABLE tickets (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  ticket_number VARCHAR(32) NOT NULL UNIQUE,
  requester_id BIGINT NOT NULL,
  category_id BIGINT NOT NULL,
  department_id BIGINT NOT NULL,
  assigned_staff_id BIGINT NULL,
  title VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(140) NOT NULL,
  impact VARCHAR(20) NOT NULL,
  urgency VARCHAR(20) NOT NULL,
  priority VARCHAR(20) NOT NULL,
  status VARCHAR(24) NOT NULL,
  resolution_deadline DATETIME NOT NULL,
  resolved_at DATETIME NULL,
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  CONSTRAINT fk_ticket_requester FOREIGN KEY (requester_id) REFERENCES app_users(id),
  CONSTRAINT fk_ticket_category FOREIGN KEY (category_id) REFERENCES ticket_categories(id),
  CONSTRAINT fk_ticket_department FOREIGN KEY (department_id) REFERENCES departments(id),
  CONSTRAINT fk_ticket_staff FOREIGN KEY (assigned_staff_id) REFERENCES app_users(id),
  INDEX idx_ticket_status (status),
  INDEX idx_ticket_location_category (location, category_id),
  INDEX idx_ticket_due_date (resolution_deadline)
);
CREATE TABLE ticket_history (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  ticket_id BIGINT NOT NULL,
  actor_id BIGINT NULL,
  old_status VARCHAR(24) NULL,
  new_status VARCHAR(24) NOT NULL,
  note VARCHAR(500) NOT NULL,
  created_at DATETIME NOT NULL,
  CONSTRAINT fk_history_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id),
  CONSTRAINT fk_history_actor FOREIGN KEY (actor_id) REFERENCES app_users(id),
  INDEX idx_history_ticket_created (ticket_id, created_at)
);
CREATE TABLE campus_notices (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(140) NOT NULL,
  body TEXT NOT NULL,
  category VARCHAR(60) NOT NULL,
  published_at DATETIME NOT NULL,
  expires_at DATETIME NULL,
  published BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE campus_faqs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  question VARCHAR(240) NOT NULL UNIQUE,
  answer TEXT NOT NULL,
  category VARCHAR(80) NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at DATETIME NOT NULL
);
