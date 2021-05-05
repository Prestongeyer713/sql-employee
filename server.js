const mysql = require("mysql");
const inquirer = require("inquirer");
require('console.table');



const promptMessages = {
    viewAllEmployees: "View All Employees",
    viewByDepartment: "View All Employees By Department",
    viewByManager: "View All Employees By Manager",
    addEmployee: "Add An Employee",
    removeEmployee: "Remove An Employee",
    updateRole: "Update Employee Role",
    updateEmployeeManager: "Update Employee Manager",
    viewAllRoles: "View All Roles",
    exit: "Exit"
};
const connectionProperties = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employees_DB"
}

const connection = mysql.createConnection(connectionProperties);


connection.connect(function(err) {
    if (err) throw err;
    mainMenu();
  });

  
  function mainMenu() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add an employee",
            "View by manager",
            "Exit"
        ]
      })
    .then(function(answer) {
        if (answer.action === 'View all departments') {
            viewByDepartment();
        } else if (answer.action === 'View all roles') {
            viewAllRoles();
        } else if (answer.action === 'View all employees') {
            viewAllEmp();
        } else if (answer.action === 'Add a department') {
            addDepartment();
        } else if (answer.action === 'Add an employee') {
            addEmployee();
        } else if (answer.action === 'View By Manager') {
            viewByManager();
        }
        else if (answer.action === 'Exit') {
            connection.end();
        }
    })
    }
function viewAllEmp() {
    var query = "SELECT * FROM employee";
        connection.query(query, function(err, res) {
            console.log(`EMPLOYEES:`)
        res.forEach(employee => {
            console.log(`ID: ${employee.id} | Name: ${employee.first_name} ${employee.last_name} | Role ID: ${employee.role_id} | Manager ID: ${employee.manager_id}`);
        })
        mainMenu();
        });
    };
    function viewByDepartment() {
        const query = `SELECT department.name AS department, role.title, employee.id, employee.first_name, employee.last_name
        FROM employee
        LEFT JOIN role ON (role.id = employee.role_id)
        LEFT JOIN department ON (department.id = role.department_id)
        ORDER BY department.name;`;
        connection.query(query, (err, res) => {
            if (err) throw err;
            console.log('\n');
            console.log('VIEW EMPLOYEE BY DEPARTMENT');
            console.log('\n');
            console.table(res);
            mainMenu();
        });
    }
function viewAllRoles() {
    var query = "SELECT * FROM role";
        connection.query(query, function(err, res) {
            console.log(`ROLES:`)
        res.forEach(role => {
            console.log(`ID: ${role.id} | Title: ${role.title} | Salary: ${role.salary} | Department ID: ${role.department_id}`);
        })
        mainMenu();
        });
    };
function addEmployee(){

    let roleArr = [];
    let managerArr = [];

    promisemysql.createConnection(connectionProperties
    ).then((conn) => {

        return Promise.all([
            conn.query('SELECT id, title FROM role ORDER BY title ASC'), 
            conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC")
        ]);
    }).then(([roles, managers]) => {

        for (i=0; i < roles.length; i++){
            roleArr.push(roles[i].title);
        }

        for (i=0; i < managers.length; i++){
            managerArr.push(managers[i].Employee);
        }

        return Promise.all([roles, managers]);
    }).then(([roles, managers]) => {

        managerArr.unshift('--');

        inquirer.prompt([
            {
                name: "firstName",
                type: "input",
                message: "First name: ",
                validate: function(input){
                    if (input === ""){
                        console.log("**FIELD REQUIRED**");
                        return false;
                    }
                    else{
                        return true;
                    }
                }
            },
            {
                name: "lastName",
                type: "input",
                message: "Lastname name: ",
                validate: function(input){
                    if (input === ""){
                        console.log("**FIELD REQUIRED**");
                        return false;
                    }
                    else{
                        return true;
                    }
                }
            },
            {
                name: "role",
                type: "list",
                message: "What is their role?",
                choices: roleArr
            },{
                name: "manager",
                type: "list",
                message: "Who is their manager?",
                choices: managerArr
            }]).then((answer) => {

                let roleID;
                let managerID = null;

                for (i=0; i < roles.length; i++){
                    if (answer.role == roles[i].title){
                        roleID = roles[i].id;
                    }
                }

                for (i=0; i < managers.length; i++){
                    if (answer.manager == managers[i].Employee){
                        managerID = managers[i].id;
                    }
                }

                connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES ("${answer.firstName}", "${answer.lastName}", ${roleID}, ${managerID})`, (err, res) => {
                    if(err) return err;

                    console.log(`\n EMPLOYEE ${answer.firstName} ${answer.lastName} ADDED...\n `);
                    mainMenu();
                });
            });
    });
}

function viewByManager() {
    const query = `SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, department.name AS department, employee.id, employee.first_name, employee.last_name, role.title
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id && employee.manager_id != 'NULL')
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY manager;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW EMPLOYEE BY MANAGER');
        console.log('\n');
        console.table(res);
        mainMenu();
    });
}