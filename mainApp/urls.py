from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static, settings
from . import views  

urlpatterns = [
    path('', views.index, name='homepage'),
    path('solver', views.solver, name='solver'),
    path('pullprogress', views.pullprogress, name='pullprogress'),
    path('upload', views.uploader, name='upload'),
    path('trigger', views.trigger, name='trigger'),
    path('preprocessor', views.preprocessor, name='preprocessor'),
    path('about', views.about, name='about'),
    path('contact', views.contact, name='contact'),
]
