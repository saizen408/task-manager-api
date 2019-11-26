var userInfo;

$(document).ready(function($) {
    $(document).on('submit', '.ui.form', function(event) {
      event.preventDefault();
    });
  });

if(!userInfo){
    $('#task_input_form').toggle();
}

$('.jiggle')
  .transition('jiggle')
;

$('.message .close')
  .on('click', function() {
    $(this)
      .closest('.message')
      .transition('fade')
    ;
  })
;

//signup form credentials
const signupForm = document.getElementById('sign_up_btn')
const signupName = document.getElementById('signup_name')
const signupEmail = document.getElementById('signup_email')
const signupPass = document.getElementById('signup_pass')

//login form credentials
const loginForm = document.getElementById('log_in_btn')
const inputEmail = document.getElementById('input_email')
const inputPassword = document.getElementById('input_password')

//new user instance
signupForm.addEventListener('click', async () => {
   
    const sName = signupName.value
    const sEmail = signupEmail.value
    const sPass = signupPass.value
    const sData = {
            name: sName,
            email: sEmail,
            password: sPass
        }

    try {
        const sResponse = await fetch('/users', {

            method: 'POST',
            body: JSON.stringify(sData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        userInfo = await sResponse.json();
        $('.ui.form').remove()
        $('.removable').remove()
        $('#h2_header').toggle()
        $('#task_input_form').toggle();
        activateListeners();

    } catch (error) {
        console.error('Error:', error)

    }

})
//existing user instance
loginForm.addEventListener('click', async () => {
    
    const email = inputEmail.value
    const password = inputPassword.value
    const data = {
            email,
            password
        }

    try {
        const response = await fetch('/users/login', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        userInfo = await response.json();
        
        fetchTasks();
        activateListeners();
        $('.ui.form').remove()
        $('.removable').remove()
        $('#h2_header').toggle()
        $('#task_input_form').toggle();
        
    } catch (error) {
        console.error('Error:', error)  
    }
})


function activateListeners() {
    $('#taskInput').keypress(function(event){
        if(event.which == 13) {
            createTask();
            $('#taskInput').val('');
        }
    });

    $('#taskAddBtn').mousedown(function(event){
        if(event.which == 1) {
            createTask();
            $('#taskInput').val('');
        }
    });

    $('.list').on('click', 'li', function(){
        updateTask($(this));
    })

    $('.list').on('click', 'span', function(e){
        e.stopPropagation();
        removeTask($(this).parent())
    })
}

function addTasks(tasks) {
    //add todos to page here
    tasks.forEach(function(task){
        addTask(task)
    });
}

function addTask(task) {
    var newTask = $('<li class="task">' + task.description + '<span><i class="fas fa-times"></i></span></li>');
    newTask.data('id', task._id)
    newTask.data('completed', task.completed)
    if(task.completed) newTask.addClass('done');
    $('.list').append(newTask);
    newTask.transition('jiggle')
}

function createTask(){
    //send request to create new task
    var userInput = $('#taskInput').val();
    var description = userInput
    var body = { description };

    try {
        $.ajax({
            url: '/tasks',
            method: 'POST',
            beforeSend: setHeader,
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(body)
        }).then(function(newTask){
            addTask(newTask)
            
        })
    } catch (error) {
        console.error('Error:', error) 
    }
    function setHeader(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + userInfo.token)
    } 
}

function removeTask(task){

    try {
        var clickedId = task.data('id');
        var deleteUrl = '/tasks/' + clickedId;
        $.ajax({
            url: deleteUrl,
            method: 'DELETE',
            beforeSend: setHeader
        }).then(function(data){
            task.transition('zoom');
        })
    } catch (error) {
        console.error('Error:', error) 
    }
    function setHeader(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + userInfo.token)
    } 
}

function updateTask(task) {
    var updateUrl = '/tasks/' + task.data('id');
    var isDone = !task.data('completed')
    var updateData = {completed: isDone}
    $.ajax({
        url: updateUrl,
        method: 'PATCH',
        beforeSend: setHeader,
        dataType: 'json',
        processData: false, 
        contentType: 'application/json',
        data: JSON.stringify(updateData)
    }).then(function(updatedTask){
        task.toggleClass('done')
        task.data('completed', isDone)
        
    })
    function setHeader(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + userInfo.token)
    } 
}

function fetchTasks() {

    $('.jiggle_task').transition('jiggle');

    $.ajax({
        url: '/tasks',
        type: 'GET',
        dataType: 'json',
        beforeSend: setHeader
    }).then(addTasks)

    function setHeader(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + userInfo.token)
    } 
}

//login form validation
$('.ui.form')
  .form({
    fields: {
        name: {
        identifier: 'name',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter a name'
          }
        ]
      },
      email: {
        identifier: 'email',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter a valid email address'
          }
        ]
      },
      password: {
        identifier: 'password',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter a password'
          },
          {
            type   : 'minLength[7]',
            prompt : 'Your password must be at least {ruleValue} characters'
          }
        ]
      }
    }
  })
;














