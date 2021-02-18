
from django.contrib import admin
from django.db import router
from django.urls import path ,include
from django.conf.urls import include, url
from rest_framework import routers


from . import views


urlpatterns = [
    path(r'', views.index, name='index'),

    path('person/<int:pk>/', views.PersonById.as_view()),
    path('person', views.PersonList.as_view()),
    path('unassignedpeople', views.UnassignedPersonList.as_view()),
    path('device/<int:pk>/', views.DeviceById.as_view()),
    path('device', views.DeviceList.as_view()),
    url(r'^role_json', views.RoleList.as_view()),
    path('team_json/<int:pk>/', views.TeamById.as_view()),
    path('team_json', views.TeamList.as_view()),
    url(r'^timerange_json/', views.TimeRangeList.as_view()),
    url(r'^sensordatapoint_json/', views.SensorDataPointList.as_view()),
    url(r'^status_json/', views.StatusList.as_view()),
    url(r'^sensor_json/', views.SensorList.as_view()),
    path('heartrate_json/<int:pk>/', views.HeartRateById.as_view()),
    path('heartrate_json/', views.HeartRateList.as_view()),
    path('bloodpressure_json/<int:pk>/', views.BloodPressureById.as_view()),
    path('bloodpressure_json/', views.BloodPressureList.as_view()),
    path('heatindex_json/<int:pk>/', views.HeatIndexById.as_view()),
    path('heatindex_json/', views.HeatIndexList.as_view()),
    path('spo2_json/<int:pk>/', views.SpO2ById.as_view()),
    path('spo2_json/', views.SpO2List.as_view()),
]
