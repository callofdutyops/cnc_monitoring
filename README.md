# CNC monitoring dashboard
A dashboard shows the CNC status with a lot of charts and tables using
data from Kafka.  

# Main features
1. Consumer data from kafka using django-channel.
2. Based on django.
3. A lot of charts.

# Use 
1. Setup datasource
    Including setup Kafka, you can reference another my project 
    [cnc-data-simulator](https://github.com/callofdutyops/cnc-data-simulator)
2. Clone the project
    ```bash
    $ git clone https://github.com/callofdutyops/cnc-monitoring.git && cd cnc-monitoring
    ```
3. Install all the necessary libs (recommand doing this in a virtual env)
    ```bash
    $ pip install -r requirements.txt
    ```
4. Run and Play!
    ```bash
    $ cd gentellella
    $ python manage.py runserver 
    ```
    Then go to [http://localhost:8000/](http://localhost:8000/) or the URL you
    set in django.

# Special Thanks
[Gentelella Admin Template](https://github.com/puikinsh/gentelella)

[django-gentelella](https://github.com/GiriB/django-gentelella)