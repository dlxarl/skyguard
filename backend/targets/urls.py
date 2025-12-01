from django.urls import path
from .views import (
    TargetListCreateView,
    ShelterListView,
    PendingTargetListView,
    VerifyTargetView
)

urlpatterns = [
    path('targets/', TargetListCreateView.as_view(), name='target-list-create'),
    path('targets/pending/', PendingTargetListView.as_view(), name='target-pending'),
    path('targets/<int:pk>/verify/', VerifyTargetView.as_view(), name='target-verify'),
    path('shelters/', ShelterListView.as_view(), name='shelter-list'),
]