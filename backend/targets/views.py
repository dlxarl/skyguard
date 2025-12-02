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
        queryset = Target.objects.filter(
            status__in=['confirmed', 'unconfirmed'],
            parent_target__isnull=True
        )
        
        target_status = self.request.query_params.get('status')
        if target_status in ['unconfirmed', 'confirmed']:
            queryset = queryset.filter(status=target_status)
        
        probability = self.request.query_params.get('probability')
        if probability in ['low', 'medium', 'high']:
            queryset = queryset.filter(probability=probability)
        
        target_type = self.request.query_params.get('type')
        if target_type:
            queryset = queryset.filter(target_type=target_type)
        
        return queryset

    def perform_create(self, serializer):
        target_type = serializer.validated_data.get('target_type', 'drone')
        serializer.save(
            author=self.request.user, 
            status='pending',
            title=target_type.upper()
        )


class ShelterListView(generics.ListAPIView):
    queryset = Shelter.objects.all()
    serializer_class = ShelterSerializer
    permission_classes = [permissions.AllowAny]


class ConfirmTargetView(APIView):
    permission_classes = [permissions.IsAdminUser]
    
    def post(self, request, pk):
        try:
            target = Target.objects.get(pk=pk)
            if target.status != 'unconfirmed':
                return Response(
                    {'error': f'Target is already {target.status}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            target.confirm()
            return Response({
                'status': 'confirmed',
                'message': f'Target confirmed. {target.report_count} users rewarded with +0.25 rating.'
            })
        except Target.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class RejectTargetView(APIView):
    permission_classes = [permissions.IsAdminUser]
    
    def post(self, request, pk):
        try:
            target = Target.objects.get(pk=pk)
            if target.status != 'unconfirmed':
                return Response(
                    {'error': f'Target is already {target.status}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            target.reject()
            return Response({
                'status': 'rejected',
                'message': f'Target rejected. {target.report_count} users penalized with -0.25 rating.'
            })
        except Target.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)