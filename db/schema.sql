Drop database if exists employees_db;
Create database employees_db;
Use employees_db;
Create Table department(
  department_id int primary key auto_increment not null,
  `name` varchar(30) unique not null
);
Use employees_db;
Create Table role(
  role_id int primary key auto_increment not null,
  title varchar(30) not null,
  salary decimal not null,
  department_id int not null,
  INDEX department_index (department_id),
  FOREIGN KEY (department_id) REFERENCES department(department_id) ON DELETE CASCADE
);
Use employees_db;
Create Table employee(
  employee_id int primary key auto_increment not null,
  first_name varchar(30) not null,
  last_name varchar(30) not null,
  role_id int not null,
  INDEX role_index (role_id),
  FOREIGN KEY (role_id) REFERENCES role(role_id) ON DELETE CASCADE,
  manager_id int,
  INDEX mananger_index (manager_id),
  FOREIGN KEY (manager_id) REFERENCES employee(employee_id) ON DELETE
  SET
    NULL
);