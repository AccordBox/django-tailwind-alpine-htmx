from django.urls import path

from .views import (
    create_task, task_list, delete_task, modal_create_task, modal_create_task_htmx
)

urlpatterns = [
    path("create/", create_task, name="task-create"),
    path("modal-create/", modal_create_task, name="modal-task-create"),
    path("modal-create-htmx/", modal_create_task_htmx, name="modal-task-create-htmx"),

    path("<id>/delete/", delete_task, name="task-delete"),
    path("", task_list, name="task-list"),
]
