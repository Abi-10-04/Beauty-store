from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Category, Product, Cart, CartItem, Wishlist
from .serializers import CategorySerializer, ProductSerializer, CartSerializer, CartItemSerializer, WishlistSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Product.objects.all()
        category_name = self.request.query_params.get('category')
        if category_name:
            normalized_category = category_name.replace('-', ' ').strip()
            queryset = queryset.filter(category__name__iexact=normalized_category)
        return queryset

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        category_id = request.query_params.get('category_id')
        if category_id:
            products = Product.objects.filter(category_id=category_id)
            serializer = ProductSerializer(products, many=True)
            return Response(serializer.data)
        return Response({'error': 'category_id parameter required'}, status=status.HTTP_400_BAD_REQUEST)


class CartViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def my_cart(self, request):
        if request.user.is_staff or request.user.role == 'admin':
            carts = Cart.objects.select_related('user').prefetch_related('items__product').all()
            serializer = CartSerializer(carts, many=True)
            return Response(serializer.data)

        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)

        try:
            product = Product.objects.get(id=product_id)
            cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
            if created:
                # New item, set the requested quantity
                cart_item.quantity = int(quantity)
            else:
                # Existing item, add to current quantity
                cart_item.quantity += int(quantity)
            cart_item.save()
            return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        cart_item_id = request.data.get('cart_item_id')
        try:
            cart_item = CartItem.objects.get(id=cart_item_id)
            if not (request.user.is_staff or request.user.role == 'admin' or cart_item.cart.user == request.user):
                return Response({'error': 'Not authorized to modify this cart item'}, status=status.HTTP_403_FORBIDDEN)
            cart = cart_item.cart
            cart_item.delete()
            return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['put'])
    def update_item(self, request):
        cart_item_id = request.data.get('cart_item_id')
        quantity = request.data.get('quantity', 1)
        try:
            cart_item = CartItem.objects.get(id=cart_item_id)
            if not (request.user.is_staff or request.user.role == 'admin' or cart_item.cart.user == request.user):
                return Response({'error': 'Not authorized to modify this cart item'}, status=status.HTTP_403_FORBIDDEN)
            cart_item.quantity = int(quantity)
            cart_item.save()
            return Response(CartSerializer(cart_item.cart).data, status=status.HTTP_200_OK)
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'])
    def clear_cart(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        cart.items.all().delete()
        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)


class WishlistViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def my_wishlist(self, request):
        if request.user.is_staff or request.user.role == 'admin':
            wishlists = Wishlist.objects.select_related('user').prefetch_related('products').all()
            serializer = WishlistSerializer(wishlists, many=True)
            return Response(serializer.data)

        wishlist, created = Wishlist.objects.get_or_create(user=request.user)
        serializer = WishlistSerializer(wishlist)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_product(self, request):
        product_id = request.data.get('product_id')
        wishlist, created = Wishlist.objects.get_or_create(user=request.user)
        try:
            product = Product.objects.get(id=product_id)
            wishlist.products.add(product)
            return Response(WishlistSerializer(wishlist).data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'])
    def remove_product(self, request):
        product_id = request.data.get('product_id')
        wishlist, created = Wishlist.objects.get_or_create(user=request.user)
        try:
            product = Product.objects.get(id=product_id)
            wishlist.products.remove(product)
            return Response(WishlistSerializer(wishlist).data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
