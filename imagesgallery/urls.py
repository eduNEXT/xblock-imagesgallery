from django.urls import re_path
from . import views

urlpatterns = [
    # Other URL patterns
    re_path(r'^get_jsfile/(?P<filename>[\w\-\.]+\.js)$', views.get_jsfile, name='get_jsfile'),
    path('my-view/', views.my_view, name='my_view'),
]
