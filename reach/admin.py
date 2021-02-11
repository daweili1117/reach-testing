from django.contrib import admin

from .models import *


class personHeartRate(admin.TabularInline):
    model = Person
    extra = 1


class personBloodPressure(admin.TabularInline):
    model = Person
    extra = 1


class personHeat(admin.TabularInline):
    model = Person
    extra = 1


class personSpO2(admin.TabularInline):
    model = Person
    extra = 1


class PersonAdmin(admin.ModelAdmin):
    list_display = ['PersonID', 'TeamID', 'FirstName', 'LastName', 'RoleID', 'ImageUrl',
                    'HeartRateID', 'SpO2ID', 'BloodPressureID', 'HeatIndexID',
                    'LastActive']
    search_fields = ['FirstName', 'LastActive']


class TeamAdmin(admin.ModelAdmin):
    list_display = ['Name', 'Description', 'Status']
    search_fields = ['Name', 'Status']


class DeviceAdmin(admin.ModelAdmin):
    list_display = ['DevicePK', 'PersonID', 'IP', 'Description', 'DeviceID', 'Type', 'Status', 'BatteryStatus']
    search_fields = ['DevicePK', 'PersonID', 'IP', 'Description', 'DeviceID', 'Type', 'Status', 'BatteryStatus']

class RoleAdmin(admin.ModelAdmin):
    list_display = ['Name', 'Description', 'Status']
    search_fields = ['Name', 'Status']

class TimeRangeAdmin(admin.ModelAdmin):
    list_display = ['PersonID', 'StartTimestamp', 'EndTimestamp']


class SensorDataPointAdmin(admin.ModelAdmin):
    list_display = ['SensorDataPointID', 'PersonID', 'DateTimestamp', 'Value']


class StatusAdmin(admin.ModelAdmin):
    list_display = ['DeviceID', 'PowerStatus', 'DateTimestamp', 'BatteryStatus', 'SignalStrength']


class SensorAdmin(admin.ModelAdmin):
    list_display = ['Type', 'DeviceID']


class HeartRateAdmin(admin.ModelAdmin):
    inlines = [personHeartRate]
    list_display = ['HRIndex', 'AgeGroup', 'LowCritical', 'LowTargetHR', 'HighTargetHR', 'HighCritical']


class BloodPressureAdmin(admin.ModelAdmin):
    inlines = [personBloodPressure]
    list_display = ['BPIndex', 'LowMAP', 'NormalLowMAP', 'NormalHighMAP', 'HighMAP', 'BPIndex']

class HeatIndexAdmin(admin.ModelAdmin):
    inlines = [personHeat]
    list_display = ['HIIndex', 'ModerateRisk', 'HighRisk']


class SpO2Admin(admin.ModelAdmin):
    inlines = [personSpO2]
    list_display = ['SpO2Index', 'Low', 'Normal']

admin.site.register(Person, PersonAdmin)
admin.site.register(Team, TeamAdmin)
admin.site.register(Device, DeviceAdmin)
admin.site.register(Role, RoleAdmin)
admin.site.register(TimeRange, TimeRangeAdmin)
admin.site.register(SensorDataPoint, SensorDataPointAdmin)
admin.site.register(Status, StatusAdmin)
admin.site.register(Sensor, SensorAdmin)
admin.site.register(HeartRate, HeartRateAdmin)
admin.site.register(BloodPressure, BloodPressureAdmin)
admin.site.register(HeatIndex, HeatIndexAdmin)
admin.site.register(SpO2, SpO2Admin)
