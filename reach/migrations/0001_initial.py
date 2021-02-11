from django.db import migrations, models
import django.db.models.deletion
import reach.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='BloodPressure',
            fields=[
                ('BloodPressureID', models.AutoField(auto_created=True, primary_key=True, serialize=False)),
                ('LowMAP', models.PositiveIntegerField(default=60)),
                ('NormalLowMAP', models.PositiveIntegerField(default=70)),
                ('NormalHighMAP', models.PositiveIntegerField(default=100)),
                ('HighMAP', models.PositiveIntegerField(default=110)),
                ('BPIndex', models.CharField(max_length=50, unique=True)),
            ],
            options={
                'verbose_name': 'BloodPressure',
                'verbose_name_plural': 'Blood Pressure',
            },
        ),
        migrations.CreateModel(
            name='Device',
            fields=[
                ('DevicePK', models.AutoField(auto_created=True, primary_key=True, serialize=False)),
                ('IP', models.GenericIPAddressField(unique=True)),
                ('Description', models.CharField(max_length=50)),
                ('DeviceID', models.CharField(max_length=100, unique=True)),
                ('Type', models.CharField(choices=[('General', 'General'), ('Type 1', 'Type 1'), ('Type 2', 'Type 2')], max_length=50)),
                ('Status', models.CharField(choices=[('Available', 'Available'), ('Not Available', 'Not Available'), ('Under Repair', 'Under Repair')], max_length=50)),
                ('BatteryStatus', models.SmallIntegerField(blank=True, null=True)),
                ('SignalStrength', models.SmallIntegerField(blank=True, null=True)),
                ('isDelete', models.BooleanField(default=True)),
            ],
            options={
                'verbose_name': 'Device',
                'verbose_name_plural': 'Device',
            },
        ),
        migrations.CreateModel(
            name='HeartRate',
            fields=[
                ('HeartRateID', models.AutoField(auto_created=True, primary_key=True, serialize=False)),
                ('AgeGroup', models.CharField(max_length=50)),
                ('LowCritical', models.PositiveIntegerField(default=60)),
                ('LowTargetHR', models.PositiveIntegerField(default=100)),
                ('HighTargetHR', models.PositiveIntegerField(default=140)),
                ('HighCritical', models.PositiveIntegerField(default=200)),
                ('HRIndex', models.CharField(max_length=50, unique=True)),
            ],
            options={
                'verbose_name': 'HeartRate',
                'verbose_name_plural': 'Heart Rate',
            },
        ),
        migrations.CreateModel(
            name='HeatIndex',
            fields=[
                ('HeatIndexID', models.AutoField(auto_created=True, primary_key=True, serialize=False)),
                ('ModerateRisk', models.PositiveIntegerField(default=91)),
                ('HighRisk', models.PositiveIntegerField(default=103)),
                ('HIIndex', models.CharField(max_length=50, unique=True)),
            ],
            options={
                'verbose_name': 'HeatIndex',
                'verbose_name_plural': 'Heat Index',
            },
        ),
        migrations.CreateModel(
            name='Person',
            fields=[
                ('PersonID', models.AutoField(auto_created=True, primary_key=True, serialize=False)),
                ('FirstName', models.CharField(max_length=50)),
                ('LastName', models.CharField(max_length=50)),
                ('Status', models.CharField(choices=[('Available', 'Available'), ('Unavailable', 'Unavailable'), ('Assigned', 'Assigned')], default='Available', max_length=50)),
                ('ImageUrl', models.ImageField(blank=True, null=True, upload_to=reach.models.upload_path)),
                ('LastActive', models.DateTimeField(auto_now_add=True, null=True)),
                ('isDelete', models.BooleanField(default=False)),
                ('BloodPressureID', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='reach.BloodPressure')),
                ('HeartRateID', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='reach.HeartRate')),
                ('HeatIndexID', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='reach.HeatIndex')),
            ],
            options={
                'verbose_name': 'Person',
                'verbose_name_plural': 'Person',
            },
        ),
        migrations.CreateModel(
            name='Role',
            fields=[
                ('RoleID', models.AutoField(auto_created=True, primary_key=True, serialize=False)),
                ('Name', models.CharField(max_length=51)),
                ('Description', models.CharField(max_length=50)),
                ('Status', models.BooleanField(default=True)),
            ],
            options={
                'verbose_name': 'Role',
                'verbose_name_plural': 'Role',
            },
        ),
        migrations.CreateModel(
            name='Sensor',
            fields=[
                ('SensorID', models.AutoField(auto_created=True, primary_key=True, serialize=False)),
                ('Type', models.CharField(max_length=50)),
                ('DeviceID', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='reach.Device')),
            ],
            options={
                'verbose_name': 'Sensor',
                'verbose_name_plural': 'Sensor',
            },
        ),
        migrations.CreateModel(
            name='SpO2',
            fields=[
                ('SpO2ID', models.AutoField(auto_created=True, primary_key=True, serialize=False)),
                ('Low', models.PositiveIntegerField(default=90)),
                ('Normal', models.PositiveIntegerField(default=95)),
                ('SpO2Index', models.CharField(max_length=50, unique=True)),
            ],
            options={
                'verbose_name': 'SpO2',
                'verbose_name_plural': 'SpO2',
            },
        ),
        migrations.CreateModel(
            name='Team',
            fields=[
                ('TeamID', models.AutoField(auto_created=True, primary_key=True, serialize=False)),
                ('Name', models.CharField(max_length=51)),
                ('Description', models.CharField(max_length=50)),
                ('Status', models.BooleanField(default=True)),
            ],
            options={
                'verbose_name': 'Team',
                'verbose_name_plural': 'Team',
            },
        ),
        migrations.CreateModel(
            name='TimeRange',
            fields=[
                ('TimeRangeID', models.AutoField(auto_created=True, primary_key=True, serialize=False)),
                ('StartTimestamp', models.DurationField(blank=True, null=True)),
                ('EndTimestamp', models.DurationField(blank=True, null=True)),
                ('PersonID', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='reach.Person')),
            ],
            options={
                'verbose_name': 'TimeRange',
                'verbose_name_plural': 'Time Range',
            },
        ),
        migrations.CreateModel(
            name='Status',
            fields=[
                ('StatusID', models.AutoField(auto_created=True, primary_key=True, serialize=False)),
                ('PowerStatus', models.BooleanField(default=True)),
                ('DateTimestamp', models.TimeField(blank=True, null=True)),
                ('BatteryStatus', models.SmallIntegerField(blank=True, null=True)),
                ('SignalStrength', models.PositiveIntegerField(blank=True, null=True)),
                ('DeviceID', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='reach.Device')),
            ],
            options={
                'verbose_name': 'Status',
                'verbose_name_plural': 'Status',
            },
        ),
        migrations.CreateModel(
            name='SensorDataPoint',
            fields=[
                ('SensorDataPointID', models.AutoField(auto_created=True, primary_key=True, serialize=False)),
                ('DateTimestamp', models.DateTimeField(blank=True, null=True)),
                ('Value', models.FloatField()),
                ('PersonID', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='reach.Person')),
                ('SensorID', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='reach.Sensor')),
            ],
            options={
                'verbose_name': 'SensorDataPoint',
                'verbose_name_plural': 'Sensor Data Point',
            },
        ),
        migrations.AddField(
            model_name='person',
            name='RoleID',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='reach.Role'),
        ),
        migrations.AddField(
            model_name='person',
            name='SpO2ID',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='reach.SpO2'),
        ),
        migrations.AddField(
            model_name='person',
            name='TeamID',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='reach.Team'),
        ),
        migrations.AddField(
            model_name='device',
            name='PersonID',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='reach.Person'),
        ),
    ]
