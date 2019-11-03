from django.db import models
from django.core.files.storage import FileSystemStorage
from django.conf import settings
import os
from django.utils.timezone import now

upload_storage = FileSystemStorage(location=os.path.join(settings.BASE_DIR, "static"), base_url='/static/')

# Model for storing uploaded file information
class UploadFiles(models.Model):
    uploadType = models.CharField(max_length=70, default='not_set')
    uploadKey = models.CharField(max_length=70, default='not_set')
    file = models.FileField(upload_to='uploads/userdata', storage=upload_storage)

# Model for storing progress of triggered processes
class Progress(models.Model):
    filename = models.CharField(max_length=344, default="")
    message = models.TextField()
    time = models.DateTimeField(default=now)  

class Contact(models.Model):
    sno = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    email = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    time = models.DateTimeField(default=now)
    message = models.TextField()    