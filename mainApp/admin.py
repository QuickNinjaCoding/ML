from django.contrib import admin
from .models import UploadFiles, Progress, Contact

# Register your models here. 
admin.site.register(UploadFiles)
admin.site.register(Progress)
admin.site.register(Contact)