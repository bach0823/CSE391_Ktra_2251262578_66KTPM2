//  render tasks
function renderTasks() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            data.tasks.forEach(task => {
                addTaskToDOMWithStatus(task.name, task.priority, task.status);
            });
        })
        .catch(error => console.error('Lỗi tải tasks:', error));
}
document.addEventListener('DOMContentLoaded', renderTasks);


function addTaskToDOMWithStatus(name, priority, status) {
    var taskList = document.getElementById('taskList');
    var priorityClass = 'priority-' + priority.toLowerCase();
    
    // Xác định class cho badge status
    var statusBadgeClass = '';
    switch(status) {
        case 'Done':
            statusBadgeClass = 'bg-success text-white';
            break;
        case 'In Progress':
            statusBadgeClass = 'bg-warning text-dark';
            break;
        default: // "To Do"
            statusBadgeClass = 'bg-light text-dark border';
    }

    // Xác định class cho progress circle
    var progressClass = 'progress-circle';
    if (status === 'Done') progressClass += ' done';
    if (status === 'In Progress') progressClass += ' in-progress';

    var taskHTML = `
        <div class="task-card mb-3 p-3 d-flex align-items-center justify-content-between">
            <div class="me-3">
                <small class="text-muted">Task</small>
                <div class="fw-semibold">${name}</div>
            </div>
            <div class="me-4 text-center">
                <small class="text-muted">Priority</small>
                <div class="${priorityClass} fw-bold">${priority}</div>
            </div>
            <div class="me-3">
                <span class="badge ${statusBadgeClass} rounded-pill px-3 py-2">${status}</span>
            </div>
            <div class="me-3">
                <div class="${progressClass}"></div>
            </div>
            <div class="d-flex gap-1">
                <button class="btn btn-sm btn-icon btn-edit" title="Edit">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-icon btn-delete" title="Delete">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `;

    taskList.insertAdjacentHTML('beforeend', taskHTML);
}



// Lấy tất cả các nút priority và status và xử lý sư kiện
const priorityButtons = document.querySelectorAll('.priority-btn');
const statusButtons = document.querySelectorAll('.status-btn');

priorityButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
        priorityButtons.forEach(function(b) {
            b.classList.remove('active');
        });

        this.classList.add('active');
        document.getElementById('taskPriority').value = this.dataset.priority;
    });
});

statusButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
        statusButtons.forEach(function(b) {
            b.classList.remove('active');
        });

        this.classList.add('active');
        document.getElementById('taskStatus').value = this.dataset.status;
    });
});


// Lấy nút "Add" trong modal
const btnAdd = document.getElementById('btnAdd');

btnAdd.addEventListener('click', function() {
    // Lấy element input
    const taskNameInput = document.getElementById('taskName');
    // Lấy giá trị đã nhập, trim() để loại bỏ khoảng trắng thừa
    const taskValue = taskNameInput.value.trim();
    // Lấy element hiển thị lỗi
    const taskError = document.getElementById('taskError');

    // Xóa trạng thái lỗi cũ (nếu có từ lần trước)
    taskNameInput.classList.remove('is-invalid');

    // === Kiểm tra 1: Input rỗng ===
    if (taskValue === '') {
        taskNameInput.classList.add('is-invalid');
        taskError.textContent = 'Vui lòng nhập tên Task!';
        return;
    }

    // === Kiểm tra 2: Vượt quá 100 ký tự ===
    if (taskValue.length > 100) {
        taskNameInput.classList.add('is-invalid');
        taskError.textContent = 'Tên task không được vượt quá 100 ký tự! (Hiện tại: ' + taskValue.length + ' ký tự)';
        return;
    }

    // === Nếu hợp lệ → Thêm task mới ===
    const priority = document.getElementById('taskPriority').value;
    const status = document.getElementById('taskStatus').value;
    addTaskToDOM(taskValue, priority, status);

    // Reset form sau khi thêm thành công
    taskNameInput.value = '';
    taskNameInput.classList.remove('is-invalid');

    var modalElement = document.getElementById('addTaskModal');
    var modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
});



function addTaskToDOM(name, priority, status) {
    var taskList = document.getElementById('taskList');
    var priorityClass = 'priority-' + priority.toLowerCase();

    var statusBadgeClass = '';
    switch(status) {
        case 'Done':
            statusBadgeClass = 'bg-success text-white';
            break;
        case 'In Progress':
            statusBadgeClass = 'bg-warning text-dark';
            break;
        default:
            statusBadgeClass = 'bg-light text-dark border';
    }

    var progressClass = 'progress-circle';
    if (status === 'Done') progressClass += ' done';
    if (status === 'In Progress') progressClass += ' in-progress';

    var taskHTML = `
        <div class="task-card mb-3 p-3 d-flex align-items-center justify-content-between">
            <div class="flex-grow-1">
                <small class="text-muted">Task</small>
                <div class="fw-semibold">${name}</div>
            </div>
            <div class="me-4 text-center">
                <small class="text-muted">Priority</small>
                <div class="${priorityClass} fw-bold">${priority}</div>
            </div>
            <div class="me-3">
                <span class="badge ${statusBadgeClass} rounded-pill px-3 py-2">${status}</span>
            </div>
            <div class="me-3">
                <div class="${progressClass}"></div>
            </div>
            <div class="d-flex gap-1">
                <button class="btn btn-sm btn-icon btn-edit" title="Edit">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-icon btn-delete" title="Delete">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `;

    taskList.insertAdjacentHTML('beforeend', taskHTML);
}


document.addEventListener('click', function(e) {
    if (e.target.closest('.btn-delete')) {
        var card = e.target.closest('.task-card');
        if (confirm('Bạn có chắc muốn xóa task này?')) {
            // Thêm animation trước khi xóa
            card.style.opacity = '0';
            card.style.transform = 'translateX(50px)';
            card.style.transition = 'all 0.3s ease';
            // Xóa khỏi DOM sau khi animation kết thúc
            setTimeout(function() {
                card.remove();
            }, 300);
        }
    }
});



