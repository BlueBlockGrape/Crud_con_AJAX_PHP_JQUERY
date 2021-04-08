$(document).ready(function(){

    let $editar = false;
    console.log("Jquery funciona");
    $('#task-result').hide();
    fetchTask();

    $('#search').keyup(function() {
        if($('#search').val()){
            let search = $('#search').val();
            console.log(search);
            $.ajax({
                url: 'task-search.php',
                data: {search},
                type: 'POST',
                data: {search},
                success: function (response) {
                    if(!response.error) {
                    console.log(response);
                      let tasks = JSON.parse(response);
                      let template = '';
                      tasks.forEach(task => {
                        template += `
                               <li><a href="#" class="task-item">${task.name}</a></li>
                              ` 
                      });
                      $('#task-result').show();
                      $('#container').html(template);
                    }
                }
            })
       }
    });

    $('#tareas-form').submit(e => {
        e.preventDefault();
        const postData = {
            name: $('#name').val(),
            description: $('#description').val(),
            id: $('#taskId').val()  
        };
        let $url = $editar === false ? 'task-add.php' : 'task-edit.php';
        $.post($url, postData, (response) => {
            //console.log(response);
            fetchTask();
            $('#tareas-form').trigger('reset');
        });
        
    });

    function fetchTask() {
        $.ajax({
            url: 'task-list.php',
            type: 'GET',
            success: function(response) {
                console.log(response);
                let tasks = JSON.parse(response);
                let template = '';
                tasks.forEach(task => {
                    template += `
                        <tr taskID = "${task.id}">
                            <td >${task.id}</td>
                            <td><a href="#" class="task-item">${task.name}</a></td>
                            <td>${task.description}</td>
                            <td>
                                <button class="task-delete btn btn-danger">
                                    DELETE
                                </button>
                            </td>
                        </tr>
                    `
                });
                $('#task').html(template);
            }
        });
    }

    $(document).on('click', '.task-delete', function (){
        if(confirm('¿Esta seguro de eliminar tarea?')){
            let element = $(this)[0].parentElement.parentElement;
            let id = $(element).attr('taskId');
            $.post('task-delete.php', {id}, function (response) {
                fetchTask();
            })
        }
    });

    $(document).on('click', '.task-item', function(){
        let element = $(this)[0].parentElement.parentElement;
        let id = $(element).attr('taskId');
        $.post('task-single.php', {id}, function(response){
            const task = JSON.parse(response);
            $('#name').val(task.name);
            $('#description').val(task.description);
            $('#taskId').val(task.id);
            $editar=true;
        })
    })


});