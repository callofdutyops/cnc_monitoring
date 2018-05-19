from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User, CNCAlarm, NCBrand, CNCType, CNC

# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(CNCAlarm)
admin.site.register(NCBrand)
admin.site.register(CNCType)
admin.site.register(CNC)
