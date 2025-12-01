from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Target, Shelter
from .serializers import TargetSerializer, ShelterSerializer

class TargetListCreateView(generics.ListCreateAPIView):
    serializer_class = TargetSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        return Target.objects.filter(status='confirmed')

    def perform_create(self, serializer):
        serializer.save(author=self.request.user, status='pending')

class PendingTargetListView(generics.ListAPIView):
    serializer_class = TargetSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return Target.objects.filter(status='pending')

class VerifyTargetView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            target = Target.objects.get(pk=pk)
            target.status = 'confirmed'
            target.save()
            return Response({'status': 'Target verified successfully'}, status=status.HTTP_200_OK)
        except Target.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class ShelterListView(generics.ListAPIView):
    queryset = Shelter.objects.all()
    serializer_class = ShelterSerializer
    permission_classes = [permissions.AllowAny]