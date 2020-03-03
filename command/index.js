const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })

  var task = [
    {
      content:"First task",
      checked:false,
      createdAt: new Date(),
      tag: "tag"
    }
  ];

  console.log("Actually I can't integrate to pouchy store. sorry this task I can't finish and work.")

  console.log("Hai this is your task")
  console.log("\n")
  task.map((value,index) => (
    console.log(
      index +1 + '. ' + value.content + ' complete: ' +  value.checked
    )
  ))

  console.log("\n")

  console.log("1. Add Task")
  console.log("2. Complete Task")
  readline.question(`Please select action?`, (id) => {
   if(id == 1){
     readline.question('fill Content : ',(content) => {
       task.push({
         content: content,
         checked: false,
         createdAt: new Date()
       })
     })
   }
    readline.close()
  })
