from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .serializers import RegisterSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class UserRatingView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            rating = 5.0
            return Response({'user_id': user.id, 'rating': rating})
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)