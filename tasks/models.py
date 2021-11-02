from django.db import models
from django.utils import timezone


class Task(models.Model):
    title = models.CharField(max_length=250)
    due_date = models.DateField(default=timezone.now)
