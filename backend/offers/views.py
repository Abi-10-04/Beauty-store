from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.shortcuts import get_object_or_404

from .models import Offer
from .serializers import OfferSerializer


class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            # Allow anyone to view offers
            permission_classes = [AllowAny]
        else:
            # Only admin can create/update/delete
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        if self.request.user.is_staff or (hasattr(self.request.user, 'role') and self.request.user.role == 'admin'):
            # Admin sees all offers
            return Offer.objects.all()
        else:
            # Users see only active offers
            return Offer.objects.filter(active=True)
        

    #Apply coupon code for users during checkout

    @action(detail=False, methods=['post'])
    def apply_coupon(self, request):
        """Apply coupon code for users during checkout"""
        coupon_code = request.data.get('code', '').strip().upper()
        cart_total = request.data.get('cart_total', 0)

        if not coupon_code:
            return Response({'error': 'Coupon code is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            coupon = Offer.objects.get(code=coupon_code, active=True)
        except Offer.DoesNotExist:
            return Response({'error': 'Invalid coupon code'}, status=status.HTTP_400_BAD_REQUEST)

        # Check validity dates
        now = timezone.now()
        if coupon.valid_from > now:
            return Response({'error': 'Coupon is not yet valid'}, status=status.HTTP_400_BAD_REQUEST)
        if coupon.valid_to < now:
            return Response({'error': 'Coupon has expired'}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate discount
        discount_amount = (cart_total * coupon.discount_percentage) / 100
        final_price = cart_total - discount_amount

        return Response({
            'success': True,
            'coupon': {
                'code': coupon.code,
                'discount_percentage': coupon.discount_percentage,
                'title': coupon.title
            },
            'original_price': cart_total,
            'discount_amount': discount_amount,
            'final_price': max(0, final_price)  # Ensure final price is not negative
        }, status=status.HTTP_200_OK)
