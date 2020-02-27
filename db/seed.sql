Use employees_db;
insert into department(`name`)
values
  ('Engineering'),
  ('Sales'),
  ('Finance'),
  ('Legal');
Use employees_db;
insert into role(title, salary, department_id)
values
  ('Sales Lead', 100000, 2),
  ('Sales Person', 80000, 2),
  ('Lead Engineer', 150000, 1),
  ('Software Engineer', 120000, 1),
  ('Accountant', 125000, 3),
  ('Legal Team Lead', 250000, 4),
  ('Lawyer', 190000, 4);
Use employees_db;
insert into employee(first_name, last_name, role_id)
values
  ('John', 'Doe', 1),
  ('Mike', 'Chan', 2),
  ('Ashley', 'Rodriquez', 3),
  ('Kevin', 'Tupik', 4),
  ('Malia', 'Brown', 5),
  ('Sarah', 'Lourd', 6),
  ('Tom', 'Allen', 7);