USE employees_DB;


INSERT INTO department (id, name)
VALUES 
    (1, "Sales"),
    (2, "Engineering"),
    (3, "Finance"),
    (4, "Legal");


INSERT INTO role 
    (id, title, salary, department_id)
VALUES 
    (1, "Salesperson", 150000, 1),
    (2, "Sales Lead", 200000, 1),
    (3, "Sales Lead", 200000, 1),
    (4, "Lead Engineer", 300000, 2),
    (5, "Accountant", 175000, 3),
    (6, "Head Accountant", 275000, 3),
    (7, "Legal Team Lead", 350000, 4),
    (8, "Lawyer", 150000, 4),
    (9, "Lawyer", 150000, 4);


INSERT INTO employee 
    (id, first_name, last_name, role_id, manager_id)
VALUES 
    (4, "Kassy", "Chase", 3, null),
    (5, "Emelia", "Henrick", 4, null),
    (7, "Magic", "Joanson", 6, null),
    (10, "Kyle", "Thronberry", 9, null),
    (3, "Hans", "Jodgmen", 2, 4),
    (1, "Mileena", "Khan", 1, 3),
    (2, "Jeffery", "Goldberg", 1, 3),
    (6, "Melanie", "Star", 5, 7),
    (8, "Zayne", "Malik", 7, 10),
    (9, "Adam", "Smith", 8, 10);