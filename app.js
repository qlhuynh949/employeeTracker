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
          break
        case 'Remove Employee':
          break
        case 'Update Employee Role':
          break
        case 'Update Employee Manager':
          break
        case 'View All Roles':
          viewAllRoles()

          break
        case 'Add A Role':
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

const askToRemoveDepartment = () => {
  let departments = getDepartments(departments => {
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

const getDepartments = (cb) => {
  db.query('SELECT * FROM department', (err, departments) => {
    if (err) throw err
    cb(departments)
  })
}

const createDepartment = (department, cb) => {
  db.query('INSERT INTO department SET ?', department, err => {
    if (err) throw err
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