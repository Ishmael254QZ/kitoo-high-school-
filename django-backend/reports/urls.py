from django.urls import path
from . import views

urlpatterns = [
    path('student-performance/', views.student_performance_report, name='student_performance'),
    path('fee-collection/', views.fee_collection_report, name='fee_collection'),
    path('kcse-analytics/', views.kcse_analytics, name='kcse_analytics'),
]
