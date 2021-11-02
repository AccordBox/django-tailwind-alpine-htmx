from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.urls import reverse
from django.shortcuts import get_object_or_404, render
import json

from .forms import TaskForm
from .models import Task


def create_task(request):
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            form.save()

            return HttpResponseRedirect(reverse('task-list'))
    else:
        form = TaskForm()

    return render(request, 'tasks/task_create.html', {'form': form})


def modal_create_task(request):
    if request.method == 'POST':
        json_data = json.loads(request.body)
        form = TaskForm(json_data)
        if form.is_valid():
            form.save()

            # we can send msg to the JS callback handler
            return JsonResponse(
                {
                    'message': 'Task created successfully',
                    'next': reverse('task-list')
                }
            )
    else:
        form = TaskForm()

    return render(request, 'tasks/modal_task_create.html', {'form': form})


def modal_create_task_htmx(request):
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            form.save()

            # https://htmx.org/headers/hx-trigger/
            response = HttpResponse('Task created successfully')
            response["HX-Trigger"] = json.dumps(
                {
                    "htmx-modal-response":
                        {
                            'next': reverse('task-list')
                        }
                })
            return response
    else:
        form = TaskForm()

    return render(request, 'tasks/modal_task_create_htmx.html', {'form': form})


def delete_task(request, id):
    obj = get_object_or_404(Task, id=id)
    obj.delete()
    return HttpResponse()


def task_list(request):
    context = {
        "object_list": Task.objects.order_by('-pk').all()
    }
    return render(request, "tasks/list.html", context)
