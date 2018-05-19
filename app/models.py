from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class CNCAlarm(models.Model):
    alarmID = models.CharField(max_length=255, unique=True)
    alarmName = models.CharField(max_length=255, unique=True)
    alarmReason = models.TextField(max_length=4000, null=True, blank=True)
    alarmAppearance = models.TextField(max_length=4000, null=True, blank=True)
    alarmSolution = models.TextField(max_length=4000, null=True, blank=True)

    def __str__(self):
        return self.alarmName


class CNCType(models.Model):
    typeName = models.CharField(max_length=255, unique=True)
    typeNo = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.typeName


class NCBrand(models.Model):
    brandName = models.CharField(max_length=255, unique=True)
    hasInternetInterface = models.BooleanField()

    def __str__(self):
        return self.brandName


class CNC(models.Model):
    cncName = models.CharField(max_length=255, unique=True)
    cncNo = models.CharField(max_length=255, unique=True)
    cncType = models.ForeignKey(
        CNCType,
        related_name='cncs',
        on_delete=models.PROTECT
    )
    ncBrand = models.ForeignKey(
        NCBrand,
        related_name='cncs',
        on_delete=models.PROTECT
    )
    cncManager = models.ForeignKey(
        User,
        related_name='cncs',
        on_delete=models.PROTECT
    )
    cncAlarm = models.ForeignKey(
        CNCAlarm,
        related_name='cncs',
        on_delete=models.PROTECT
    )

    cncIpAddressWithPort = models.CharField(max_length=255, unique=True)
    cncRegistCode = models.CharField(max_length=255, unique=True)
    cncMachineCode = models.CharField(max_length=255, unique=True)
    cncImageIndex = models.PositiveIntegerField()
    ipcIpAddressWithPort = models.CharField(max_length=255)
    lastClockSyncedTime = models.DateTimeField()
    isInUsing = models.BooleanField()

    reservedField_1 = models.CharField(max_length=255, null=True, blank=True)
    reservedField_2 = models.CharField(max_length=255, null=True, blank=True)
    reservedField_3 = models.CharField(max_length=255, null=True, blank=True)
    reservedField_4 = models.CharField(max_length=255, null=True, blank=True)
    reservedField_5 = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.cncName
