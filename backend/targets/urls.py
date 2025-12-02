from django.urls import path
from .views import (
    TargetListCreateView,
    ShelterListView,
    ConfirmTargetView,
    RejectTargetView,
)

urlpatterns = [
    path('targets/', TargetListCreateView.as_view(), name='target-list-create'),
    path('targets/<int:pk>/confirm/', ConfirmTargetView.as_view(), name='target-confirm'),
    path('targets/<int:pk>/reject/', RejectTargetView.as_view(), name='target-reject'),
    path('shelters/', ShelterListView.as_view(), name='shelter-list'),
]