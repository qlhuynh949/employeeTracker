const prompt = require('inquirer').createPromptModule()
const dotenv = require('dotenv')
const db = require('./config/db.js')
const cTable = require('console.table');



let questions1 = [
  'What would you like to do?'
];

let dbChoices = [
  'View All Employees',
  'View All Employees by Department',
  'View All Employees by Manager',
  'Add Employee',
  'Remove Employee',
  'Update Employee Role',
  'Update Employee Manager',
  'View All Roles',
  'Add A Role',
  'Add A Department',
  'Remove A Department',
  'View All Departments',
  'View the total utilized budget of a department',
  'Quit'
]


async function startQuestions() {
  const initPrompt = await prompt([{
    type: 'list',
    name: 'choice',
    message: questions1[0],
    choices: dbChoices
  }
  ])
    .then(({ choice }) => {
      switch (choice) {
        case 'View All Employees':
          viewAllEmployee()
          break
        case 'View All Employees by Department':
          viewAllEmployeeByDepartment()
          break
        case 'View All Employees by Manager':
          viewAllEmployeeByManager()
          break
        case 'Add Employee':
          askToAddEmployee()
          break
        case 'Remove Employee':
          askToRemoveEmployee()
          break
        case 'Update Employee Role':
          askToUpdateEmployeeRole()
          break
        case 'Update Employee Manager':
          askToUpdateEmployeeManager()
          break
        case 'View All Roles':
          viewAllRoles()
          break
        case 'Add A Role':
          askToAddRole()
          break
        case 'Add A Department':
          askToCreateDepartment()
          break
        case 'Remove A Department':
          askToRemoveDepartment()
          break
        case 'View All Departments':
          viewAllDepartments()
          break
        case 'View the total utilized budget of a department':
          viewDepartmentTotals()
          break
        case 'Quit':
          db.end()
          break
        default:
          db.end()
          break
      }


    })
    .catch(e => console.error(e))
}

async function askToCreateDepartment() {
  const departmentPromt = await prompt([{
    type: 'input',
    name: `departmentName`,
    message: 'What is the name of the department to add?'
  }])
    .then(({ departmentName }) => {
      let department = { name: departmentName }
      createDepartment(department, () => {
        console.log(`${departmentName} Created!`)
        startQuestions()
      })
    })
}

const askToAddEmployee = () => {
  let managerData = getEmployees(managers => {
    let managerlist = []
    let noSelect = '0:No Manager'
    managerlist.push(noSelect)
    managers.forEach((element) => {
      let managerItem = `${element.employee_id}:${element.first_name} ${element.last_name}`
      managerlist.push(managerItem)
    })


    let rolesData = getRoles(roles => {
      let rolelist = []
      roles.forEach((element) => {
        let roleItem = `${element.role_id}:${element.title}`
        rolelist.push(roleItem)
      })

      const employeePrompt = prompt([
        {
          type: 'input',
          name: `employeeFirstName`,
          message: 'Please enter in the first name of new  employee.'
        },
        {
          type: 'input',
          name: `employeeLastName`,
          message: 'Please enter in the last name of new employee.'
        },
        {
          type: 'list',
          message: 'Who is the manager?',
          name: `employeeManager`,
          choices: managerlist
        },
        {
          type: 'list',
          message: 'What is their role?',
          name: `employeeRole`,
          choices: rolelist
        }
      ])
        .then(
          ({ employeeFirstName, employeeLastName, employeeManager, employeeRole }) => {
            let roleArray = employeeRole.split(':')
            let managerArray = employeeManager.split(':')
            let newEmployee = {
              first_name: employeeFirstName,
              last_name: employeeLastName,
              role_id: roleArray[0],
              manager_id: managerArray[0]
            }

            let newName = newEmployee.first_name + ' ' + newEmployee.last_name

            createEmployee(newEmployee, () => {
              console.log(`${newName} Created!`)
              startQuestions()
            })

          })
    })
  })
}


const askToRemoveEmployee = () => {
  let employeesData = getEmployees(employees => {
    let employeelist = []
    employees.forEach((element) => {
      let employItem = `${element.employee_id}:${element.first_name} ${element.last_name}`
      employeelist.push(employItem)
    })
    const employeePrompt = prompt([{
      type: 'list',
      message: 'Which Employee to remove?',
      name: `employeeItem`,
      choices: employeelist
    }])
      .then(({ employeeItem }) => {
        let employeeArray = employeeItem.split(':')
        deletEmployee(employeeArray[0], () => {
          console.log(`${employeeArray[1]} was removed.`)
          startQuestions()
        })

      })

  })
}

const deletEmployee = (id, cb) => {
  db.query('DELETE FROM employee WHERE ?', { employee_id: id }, err => {
    if (err) throw err
    cb()
  })
}


const askToUpdateEmployeeManager = () => {
  let employeesData = getEmployees(employees => {
    let employeelist = []
    employees.forEach((element) => {
      let employItem = `${element.employee_id}:${element.first_name} ${element.last_name}`
      employeelist.push(employItem)
    })
    const employeePrompt = prompt([{
      type: 'list',
      message: 'Which Employee to update manager?',
      name: `employeeItem`,
      choices: employeelist
    }])
      .then(({ employeeItem }) => {
        let employeeArray = employeeItem.split(':')
        askEmployeeManagerToUpdate(employeeArray)

      })

  })
}

const askEmployeeManagerToUpdate = (employeeArray) => {
  let managerData = getEmployees(manager => {
    let managerlist = []
    manager.forEach((element) => {
      let managerItem = `${element.employee_id}:${element.first_name} ${element.last_name}`
      if (element.employee_id !== employeeArray[0]) {
        managerlist.push(managerItem)
      }
    })

    const managerChangePrompt = prompt([{
      type: 'list',
      message: 'Choose the manager to change to?',
      name: `managerChangeItem`,
      choices: managerlist
    }])
      .then(({ managerChangeItem }) => {

        let managerChangeArray = managerChangeItem.split(':')
        updateEmployeeManager(managerChangeArray[0], employeeArray[0], () => {
          console.log(`Manager changed to ${managerChangeArray[1]}.`)
          startQuestions()
        })

      })
  })
}



const askToUpdateEmployeeRole = () => {
  let employeesData = getEmployees(employees => {
    let employeelist = []
    employees.forEach((element) => {
      let employItem = `${element.employee_id}:${element.first_name} ${element.last_name}`
      employeelist.push(employItem)
    })
    const employeePrompt = prompt([{
      type: 'list',
      message: 'Which Employee to update role?',
      name: `employeeItem`,
      choices: employeelist
    }])
      .then(({ employeeItem }) => {
        let employeeArray = employeeItem.split(':')
        askEmployeeRoleToUpdate(employeeArray)

      })

  })
}

const askEmployeeRoleToUpdate = (employeeArray) => {
  let rolesData = getRoles(roles => {

    let rolelist = []
    roles.forEach((element) => {
      let roleItem = `${element.role_id}:${element.title}`
      rolelist.push(roleItem)
    })

    const roleChangePrompt = prompt([{
      type: 'list',
      message: 'Choose the role to change to?',
      name: `roleChangeItem`,
      choices: rolelist
    }])
      .then(({ roleChangeItem }) => {

        let roleChangeArray = roleChangeItem.split(':')
        updateEmployeeRole(roleChangeArray[0], employeeArray[0], () => {
          console.log(`Role changed to ${roleChangeArray[1]}.`)
          startQuestions()
        })

      })
  })
}

const updateEmployeeRole = (roleid, employeeid, cb) => {
  db.query('UPDATE employee SET role_id=? WHERE employee_id=?', [roleid, employeeid], err => {
    if (err) throw err
    cb()
  })
}

const updateEmployeeManager = (managerid, employeeid, cb) => {
  db.query('UPDATE employee SET manager_id=? WHERE employee_id=?', [managerid, employeeid], err => {
    if (err) throw err
    cb()
  })
}

const askToAddRole = () => {
  let departmentsData = getDepartments(departments => {
    let departlist = []
    departments.forEach((element) => {
      let deptItem = `${element.department_id}:${element.name}`
      departlist.push(deptItem)
    })
    const departmentPromt = prompt([{
      type: 'list',
      message: 'Which department is this new role for?',
      name: `departmentItem`,
      choices: departlist
    }
      ,
    {
      type: 'input',
      name: `roleTitle`,
      message: 'Please enter in the title for this new role.'
    },
    {
      type: 'input',
      name: `roleSalary`,
      message: 'Please enter in the salary for this new role.'
    }
    ])
      .then(({ departmentItem, roleTitle, roleSalary }) => {
        let deptArray = departmentItem.split(':')
        let roleItem = { department_id: deptArray[0], title: roleTitle, salary: roleSalary }
        //console.log(departItem)
        createRole(roleItem, () => { console.log(`New role added!`) })
        startQuestions()

      })
  })

}



const askToRemoveDepartment = () => {
  let departmentsData = getDepartments(departments => {
    let departlist = []
    departments.forEach((element) => {
      let deptItem = `${element.department_id}:${element.name}`
      departlist.push(deptItem)
    })
    const departmentPromt = prompt([{
      type: 'list',
      message: 'Which department to remove?',
      name: `departmentItem`,
      choices: departlist
    }])
      .then(({ departmentItem }) => {
        let deptArray = departmentItem.split(':')
        //let departItem = { department_id: deptArray[0], name: deptArray[1] }
        //console.log(departItem)
        deleteDepartment(deptArray[0], () => { console.log(`${deptArray[1]} deleted!`) })
        startQuestions()

      })
  })

}

const createEmployee = (employee, cb) => {
  db.query('INSERT INTO employee SET ?', employee, err => {
    if (err) throw err
    cb()
  })
}

const updateEmployee = (updates, id, cb) => {
  db.query('UPDATE employee SET ? WHERE ?', [updates, { employee_id: id }], err => {
    if (err) throw err
    cb()
  })
}

const getEmployees = (cb) => {
  db.query('SELECT * FROM employee', (err, employees) => {
    if (err) throw err
    cb(employees)
  })
}

const getEmployeeById = (id, cb) => {
  db.query(`
    SELECT * FROM employee
    WHERE ?
  `, { employee_id: id }, (err, data) => {

    if (err) throw err
    // return items
    cb(data)
  })
}

const getRoles = (cb) => {
  db.query('SELECT * FROM role', (err, role) => {
    if (err) throw err
    cb(role)
  })
}

const getDepartments = (cb) => {
  db.query('SELECT * FROM department', (err, departments) => {
    if (err) throw err
    cb(departments)
  })
}

const createDepartment = (department, cb) => {
  db.query('INSERT INTO department SET ?', department, err => {
    if (err) throw err
    cb()
  })
}



const deleteDepartment = (id, cb) => {
  db.query('DELETE FROM department WHERE ?', { department_id: id }, err => {
    if (err) throw err
    cb()
  })
}


const deleteRole = (id, cb) => {
  db.query('DELETE FROM role WHERE ?', { role_id: id }, err => {
    if (err) throw err
    cb()
  })
}

const updateRole = (updates, id, cb) => {
  db.query('UPDATE role SET ? WHERE ?', [updates, { role_id: id }], err => {
    if (err) throw err
    cb()
  })
}

const createRole = (role, cb) => {
  db.query('INSERT INTO role SET ?', role, err => {
    if (err) throw err
    cb()
  })
}


const viewDepartmentTotals = () => {

  db.query(`select 
 d.name as department
, sum(r.salary) as Total
from employee e
inner join role r on e.role_id = r.role_id
inner join department d on r.department_id = d.department_id
group by d.name;
    `, (err, employee) => {
    if (err) { console.log(err) }
    console.table(employee)
    startQuestions()
  })

}

const viewAllDepartments = () => {

  db.query(`select
  d.department_id as departmentid 
, d.name as department
from department d 
order by d.name;
    `, (err, department) => {
    if (err) { console.log(err) }
    console.table(department)
    startQuestions()
  })

}

const viewAllRoles = () => {

  db.query(`select
  r.role_id as roleid
  , r.title
  , r.salary
  , d.department_id as id 
  , d.name as department
from role r 
inner join department d on r.department_id = d.department_id
order by d.name;
    `, (err, department) => {
    if (err) { console.log(err) }
    console.table(department)
    startQuestions()
  })

}


const viewAllEmployeeByDepartment = () => {

  db.query(`select 
e.employee_id as id
, e.first_name
, e.last_name
, r.title
, d.name as department
, r.salary
, m.first_name + ' ' + m.last_name as manager
from employee e
inner join role r on e.role_id = r.role_id
inner join department d on r.department_id = d.department_id
left join employee m on e.manager_id = e.employee_id
order by d.name;
    `, (err, employee) => {
    if (err) { console.log(err) }
    console.table(employee)
    startQuestions()
  })

}

const viewAllEmployeeByManager = () => {

  db.query(`select 
e.employee_id as id
, e.first_name
, e.last_name
, r.title
, d.name as department
, r.salary
, m.first_name + ' ' + m.last_name as manager
from employee e
inner join role r on e.role_id = r.role_id
inner join department d on r.department_id = d.department_id
left join employee m on e.manager_id = e.employee_id
order by m.last_name, m.first_name;
    `, (err, employee) => {
    if (err) { console.log(err) }
    console.table(employee)
    startQuestions()
  })

}



const viewAllEmployee = () => {

  db.query(`select 
e.employee_id as id
, e.first_name
, e.last_name
, r.title
, d.name as department
, r.salary
, m.first_name + ' ' + m.last_name as manager
from employee e
inner join role r on e.role_id = r.role_id
inner join department d on r.department_id = d.department_id
left join employee m on e.manager_id = e.employee_id
order by e.employee_id;
    `, (err, employee) => {
    if (err) { console.log(err) }
    console.table(employee)
    startQuestions()
  })

}


startQuestions()