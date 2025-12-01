from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserSerializer, UserUpdateSerializer
from .models import UserProfile


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer


class CurrentUserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        if not hasattr(request.user, 'profile'):
            UserProfile.objects.create(user=request.user)
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        if not hasattr(request.user, 'profile'):
            UserProfile.objects.create(user=request.user)
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(UserSerializer(request.user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AvatarUploadView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        if not hasattr(request.user, 'profile'):
            UserProfile.objects.create(user=request.user)
        
        if 'avatar' not in request.FILES:
            return Response({'error': 'No avatar provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        profile = request.user.profile
        profile.avatar = request.FILES['avatar']
        profile.save()
        
        return Response(UserSerializer(request.user).data)


class UserRatingView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            if not hasattr(user, 'profile'):
                UserProfile.objects.create(user=user)
            rating = user.profile.trust_rating
            return Response({'user_id': user.id, 'rating': rating})
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)