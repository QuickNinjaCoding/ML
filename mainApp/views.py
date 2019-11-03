from django.shortcuts import render, HttpResponse
from django.urls import path
from django.core import management
import subprocess
from .models import UploadFiles, Progress, Contact
import pandas as pd
import json
import os
from django.conf import settings 

# Create your views here
def index(request): 
    return render(request, 'mainApp/index.html')

def solver(request): 
    return render(request, 'mainApp/solver.html')

def contact(request): 
    return render(request, 'mainApp/contact.html')

def about(request): 
    return render(request, 'mainApp/about.html')

def preprocessor(request): 
    return render(request, 'mainApp/preprocessor.html')

def uploader(request):
    # If the request method is post, we will allow otherwise we will not allow file uploads
    if request.method == 'POST':
        fileToUpload = request.FILES['fileToUpload']
        uploadType = request.POST['uploadType']
        uploadKey = request.POST['uploadKey'] 

        # Save the file to the database
        fs = UploadFiles(file=fileToUpload, uploadType=uploadType, uploadKey=uploadKey)
        fs.save() 
        
        print(settings.BASE_DIR + "\\static\\uploads\\userdata\\"+ fs.file.name[17:])
        df = pd.read_csv(settings.BASE_DIR + "\\static\\uploads\\userdata\\"+ fs.file.name[17:])
        # TODO: Automatically detect the type of attributes in the dataframe
        # for col in df.columns: 

        # Return filename(unique identifier) and its columns 
        excel = {"name":fs.file.name[17:], "columns": list(df.columns)}  
        
        return HttpResponse(json.dumps(excel))     
    else:
        return HttpResponse('Only post request is allowed')   

def trigger(request):
    if request.method=='POST':
        resp = json.loads(request.body)  
        command = f'python manage.py process -d  {request.body.decode()}'
        command = command.replace('"', '\\"')  
        a = subprocess.Popen(command, shell=True) 
        return HttpResponse(f'Your process has been started with pid {a.pid} on the server')

    else:
        return HttpResponse('Only post request is allowed here in trigger') 

def pullprogress(request):
    if request.method=='POST': 
        # Convert the json string to a python dictionary
        myDict = json.loads(request.body)

        # Pull out all the progress messages from the server 
        progressObjs = [item.message for item in Progress.objects.filter(filename=myDict['file'])]

        # Convert the messages to a string array and return it
        string = json.dumps(progressObjs) 
        return HttpResponse(string)
    
    # If request method is not post return this string
    else:
        return HttpResponse('Only post request is allowed here in trigger') 

def contact(request):
    if request.method=='POST':
        name = request.POST['name']
        email = request.POST['email']
        phone = request.POST['phone']
        message = request.POST['message']
 

        # Make sure name, email or message is not blank and push to the db
        if len(name)>0 and len(email)>0 and len(message)>0:
            contact = Contact(name=name, email=email, phone=phone, message=message)
            contact.save() 
        else:    
            print(request, 'Error sending message. Make sure the information you typed is complete and valid!')
    return render(request, 'mainApp/contact.html')