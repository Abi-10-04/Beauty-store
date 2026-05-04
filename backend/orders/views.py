from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderCreateSerializer
from products.models import Product, Cart


class OrderViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """List all orders (admin) or user's own orders (regular users)"""
        if request.user.is_staff or request.user.role == 'admin':
            orders = Order.objects.select_related('user').prefetch_related('items__product').all().order_by('-created_at')
        else:
            orders = Order.objects.filter(user=request.user).select_related('user').prefetch_related('items__product').order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """Get a single order"""
        try:
            if request.user.is_staff or request.user.role == 'admin':
                order = Order.objects.select_related('user').prefetch_related('items__product').get(id=pk)
            else:
                order = Order.objects.filter(user=request.user).select_related('user').prefetch_related('items__product').get(id=pk)
            serializer = OrderSerializer(order)
            return Response(serializer.data)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

    def partial_update(self, request, pk=None):
        """Update order status (admin only)"""
        if not (request.user.is_staff or request.user.role == 'admin'):
            return Response({'error': 'Only admins can update orders'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            order = Order.objects.get(id=pk)
            if 'status' in request.data:
                order.status = request.data['status']
                order.save()
            serializer = OrderSerializer(order)
            return Response(serializer.data)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'])
    def my_orders(self, request):
        if request.user.is_staff or request.user.role == 'admin':
            orders = Order.objects.all().order_by('-created_at')
        else:
            orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def create_order(self, request):
        serializer = OrderCreateSerializer(data=request.data)
        if serializer.is_valid():
            try:
                total_price = 0
                order_items = []

                for item in serializer.validated_data['items']:
                    product_id = item.get('product_id')
                    quantity = item.get('quantity', 1)

                    product = Product.objects.get(id=product_id)
                    if product.stock < quantity:
                        return Response(
                            {'error': f'{product.name} is out of stock'},
                            status=status.HTTP_400_BAD_REQUEST
                        )

                    price = product.price * quantity
                    total_price += price
                    order_items.append({
                        'product': product,
                        'quantity': quantity,
                        'price': price
                    })

                order = Order.objects.create(
                    user=request.user,
                    total_price=total_price,
                    shipping_address=serializer.validated_data['shipping_address'],
                    phone=serializer.validated_data['phone']
                )

                for item in order_items:
                    OrderItem.objects.create(
                        order=order,
                        product=item['product'],
                        quantity=item['quantity'],
                        price=item['price']
                    )
                    # Update stock
                    item['product'].stock -= item['quantity']
                    item['product'].save()

                # Clear cart
                cart = request.user.cart
                cart.items.all().delete()

                return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

            except Product.DoesNotExist:
                return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def order_detail(self, request):
        order_id = request.query_params.get('order_id')
        try:
            order = Order.objects.get(id=order_id, user=request.user)
            serializer = OrderSerializer(order)
            return Response(serializer.data)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
