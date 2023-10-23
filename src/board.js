import { handleContextMenu } from "./contextmenu";
import { handleDrag } from "./dragndrop";
import {
  add_task_btn,
  boardDoing,
  boardFinished,
  boardTask,
  task_entry,
  task_entry_form,
  task_slots,
} from "./elements";
import { addTask, getTasks } from "./localstorage";
export var taskCount;
export function list_taskUI() {
  if (document.querySelectorAll("#boardTask div.board-item").length >= 1) {
    boardTask.innerHTML = "";
  }
  if (document.querySelectorAll("#boardDoing div.board-item").length >= 1) {
    boardDoing.innerHTML = "";
  }
  if (document.querySelectorAll("#boardFinished div.board-item").length >= 1) {
    boardFinished.innerHTML = "";
  }

  if (getTasks()) {
    // Update tasks
    // Fetch those tasks from localstorage
    const localTasks = getTasks();
    taskCount = {
      pending: localTasks.filter((t) => t.status == 0).length,
      doing: localTasks.filter((t) => t.status == 1).length,
      finished: localTasks.filter((t) => t.status == 2).length,
    };
    if (taskCount.pending == 0) {
      boardTask.innerHTML = `<div id="task-drop" class="drop-task-here">
      <i class="ic-drop-task">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-plus-square"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      </i>
      <span>Drop Task Here</span>
    </div>`;
    }
    if (taskCount.doing == 0) {
      boardDoing.innerHTML = `<div id="doing-drop" class="drop-task-here">
      <i class="ic-drop-task">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-plus-square"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      </i>
      <span>Drop Task Here</span>
    </div>`;
    }
    if (taskCount.finished == 0) {
      boardFinished.innerHTML = `<div id="finished-drop" class="drop-task-here">
      <i class="ic-drop-task">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-plus-square"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      </i>
      <span>Drop Task Here</span>
    </div>`;
    }

    localTasks.forEach((task_, i) => {
      const task = document.createElement("div");
      task.classList.add("board-item");
      task.setAttribute("data-id", task_.task_id);
      task.setAttribute("draggable", true);
      task.innerHTML = task_.task;
      // We create an empty slot for each task
      const slot = document.createElement("div");
      slot.setAttribute("id", "dummy_slot");
      slot.setAttribute("data-child", task_.task_id);

      if (task_.status == 0) {
        boardTask.prepend(task);
        boardTask.prepend(slot);
        task_slots.unshift(slot);
      } else if (task_.status == 1) {
        boardDoing.prepend(task);
        boardDoing.prepend(slot);
        task_slots.unshift(slot);
      } else {
        boardFinished.prepend(task);
        boardFinished.prepend(slot);
        task_slots.unshift(slot);
      }
      // add context menu
      task.addEventListener("contextmenu", function (e) {
        handleContextMenu(e);
      });

      task.addEventListener("dragstart", function (e) {
        handleDrag(e, task);
      });
    });
  }
}

function addTaskTrigger(e) {
  task_entry_form.style.display = "block";
  // set focus
  document.getElementById("task_entry").focus();

  document.querySelector(".add_task_display").style.display = "none";
  // add border
  add_task_btn.style.border = "2px solid #9C27B0";
  // add_task_btn.style.boxShadow = "inset 0px 0px 7px 0px #9C27B0";
  // bind submit event on that input
  function hideEntrybox() {
    task_entry_form.style.display = "none";
    // show task label
    document.querySelector(".add_task_display").style.display = "flex";
    // remove border
    add_task_btn.style.border = "2px solid transparent";
  }
  window.addEventListener("keyup", function (e) {
    if (e.key == "Escape") {
      // TODO: Add a condition to call the function only when input is open
      hideEntrybox();
    }
    task_entry.addEventListener("focusout", function (e) {
      hideEntrybox();
    });
  });
  task_entry_form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (task_entry.value.trim().length > 0) {
      const taskName = task_entry.value.trim();
      task_entry.value = "";
      addTask(taskName);
      list_taskUI();

      // reset task box
      // hide task entry box
      hideEntrybox();
    }
  });
}
export function handleAddTask() {
  var ev;
  add_task_btn.addEventListener("click", function (e) {
    ev = e;
    addTaskTrigger(e);
  });

  document.addEventListener("keydown", function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      addTaskTrigger(ev);
    }
  });
}
