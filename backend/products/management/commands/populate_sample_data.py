from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from products.models import Category, Product
from offers.models import Offer
from reviews.models import Review
from users.models import User
import random


class Command(BaseCommand):
    help = 'Populate database with sample data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting to populate sample data...'))

        # Create categories
        categories_data = [
            {'name': 'Skincare', 'description': 'Face and skin care products'},
            {'name': 'Haircare', 'description': 'Hair care and treatments'},
            {'name': 'Makeup', 'description': 'Makeup and cosmetics'},
        ]

        categories = {}
        for cat_data in categories_data:
            cat, created = Category.objects.get_or_create(name=cat_data['name'], defaults={'description': cat_data['description']})
            categories[cat_data['name']] = cat
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created category: {cat_data["name"]}'))

        # Create products
        products_data = [
            # Skincare (15 products)
            {'name': 'Moisturizing Cream', 'description': 'Rich moisturizer for all skin types', 'price': 599, 'category': 'Skincare', 'stock': 50},
            {'name': 'Face Cleanser', 'description': 'Gentle cleansing gel', 'price': 399, 'category': 'Skincare', 'stock': 75},
            {'name': 'Vitamin C Serum', 'description': 'Brightening vitamin C serum', 'price': 1299, 'category': 'Skincare', 'stock': 30},
            {'name': 'Sunscreen SPF 50', 'description': 'UV protection sunscreen', 'price': 499, 'category': 'Skincare', 'stock': 100},
            {'name': 'Night Face Mask', 'description': 'Hydrating overnight mask', 'price': 749, 'category': 'Skincare', 'stock': 40},
            {'name': 'Face Wash', 'description': 'Daily face wash for clear skin', 'price': 349, 'category': 'Skincare', 'stock': 80},
            {'name': 'Aloe Vera Gel', 'description': 'Natural soothing aloe vera gel', 'price': 299, 'category': 'Skincare', 'stock': 60},
            {'name': 'Face Scrub', 'description': 'Gentle exfoliating face scrub', 'price': 449, 'category': 'Skincare', 'stock': 55},
            {'name': 'Toner', 'description': 'Refreshing skin toner', 'price': 399, 'category': 'Skincare', 'stock': 70},
            {'name': 'Sheet Mask', 'description': 'Hydrating sheet mask pack', 'price': 199, 'category': 'Skincare', 'stock': 120},
            {'name': 'Anti-aging Cream', 'description': 'Advanced anti-aging face cream', 'price': 1499, 'category': 'Skincare', 'stock': 25},
            {'name': 'Eye Cream', 'description': 'Specialized eye care cream', 'price': 899, 'category': 'Skincare', 'stock': 45},
            {'name': 'Lip Balm', 'description': 'Moisturizing lip balm', 'price': 199, 'category': 'Skincare', 'stock': 150},
            {'name': 'Body Lotion', 'description': 'Nourishing body lotion', 'price': 499, 'category': 'Skincare', 'stock': 90},
            {'name': 'Hand Cream', 'description': 'Intensive hand moisturizer', 'price': 349, 'category': 'Skincare', 'stock': 85},
            
            # Haircare (15 products)
            {'name': 'Shampoo', 'description': 'Sulfate-free shampoo', 'price': 449, 'category': 'Haircare', 'stock': 80},
            {'name': 'Hair Conditioner', 'description': 'Deep conditioning treatment', 'price': 499, 'category': 'Haircare', 'stock': 70},
            {'name': 'Hair Serum', 'description': 'Anti-frizz hair serum', 'price': 599, 'category': 'Haircare', 'stock': 50},
            {'name': 'Hair Mask', 'description': 'Intensive hair repair mask', 'price': 799, 'category': 'Haircare', 'stock': 45},
            {'name': 'Hair Spray', 'description': 'Strong hold hair spray', 'price': 349, 'category': 'Haircare', 'stock': 90},
            {'name': 'Hair Oil', 'description': 'Natural hair nourishing oil', 'price': 699, 'category': 'Haircare', 'stock': 65},
            {'name': 'Anti-Dandruff Shampoo', 'description': 'Specialized anti-dandruff shampoo', 'price': 549, 'category': 'Haircare', 'stock': 75},
            {'name': 'Leave-in Conditioner', 'description': 'Daily leave-in hair conditioner', 'price': 649, 'category': 'Haircare', 'stock': 55},
            {'name': 'Keratin Treatment Cream', 'description': 'Professional keratin hair treatment', 'price': 1299, 'category': 'Haircare', 'stock': 30},
            {'name': 'Hair Growth Oil', 'description': 'Stimulating hair growth oil', 'price': 899, 'category': 'Haircare', 'stock': 40},
            {'name': 'Color Protection Shampoo', 'description': 'Shampoo for colored hair', 'price': 599, 'category': 'Haircare', 'stock': 60},
            {'name': 'Heat Protectant Spray', 'description': 'Heat protection for styling', 'price': 499, 'category': 'Haircare', 'stock': 85},
            {'name': 'Hair Mousse', 'description': 'Volumizing hair mousse', 'price': 399, 'category': 'Haircare', 'stock': 70},
            {'name': 'Scalp Treatment', 'description': 'Specialized scalp care treatment', 'price': 749, 'category': 'Haircare', 'stock': 35},
            {'name': 'Hair Wax', 'description': 'Strong hold styling wax', 'price': 449, 'category': 'Haircare', 'stock': 80},
            
            # Makeup (15 products)
            {'name': 'Foundation', 'description': 'Full coverage liquid foundation', 'price': 899, 'category': 'Makeup', 'stock': 60},
            {'name': 'Lipstick', 'description': 'Long-lasting lipstick', 'price': 449, 'category': 'Makeup', 'stock': 100},
            {'name': 'Eyeliner', 'description': 'Waterproof eyeliner', 'price': 299, 'category': 'Makeup', 'stock': 120},
            {'name': 'Mascara', 'description': 'Volume and length mascara', 'price': 549, 'category': 'Makeup', 'stock': 85},
            {'name': 'Blush', 'description': 'Cream blush for natural glow', 'price': 399, 'category': 'Makeup', 'stock': 70},
            {'name': 'Compact Powder', 'description': 'Setting powder for makeup', 'price': 599, 'category': 'Makeup', 'stock': 95},
            {'name': 'Kajal', 'description': 'Intense black kajal pencil', 'price': 249, 'category': 'Makeup', 'stock': 140},
            {'name': 'Highlighter', 'description': 'Shimmery face highlighter', 'price': 699, 'category': 'Makeup', 'stock': 50},
            {'name': 'Primer', 'description': 'Face primer for smooth makeup', 'price': 799, 'category': 'Makeup', 'stock': 45},
            {'name': 'Makeup Setting Spray', 'description': 'Long-lasting makeup setting spray', 'price': 649, 'category': 'Makeup', 'stock': 55},
            {'name': 'Eyeshadow Palette', 'description': 'Complete eyeshadow palette', 'price': 999, 'category': 'Makeup', 'stock': 35},
            {'name': 'Bronzer', 'description': 'Natural bronzing powder', 'price': 549, 'category': 'Makeup', 'stock': 75},
            {'name': 'Concealer', 'description': 'Full coverage concealer', 'price': 499, 'category': 'Makeup', 'stock': 90},
            {'name': 'Lip Gloss', 'description': 'Shiny lip gloss', 'price': 349, 'category': 'Makeup', 'stock': 110},
            {'name': 'Brow Pencil', 'description': 'Precision eyebrow pencil', 'price': 399, 'category': 'Makeup', 'stock': 85},
        ]

        for prod_data in products_data:
            category = categories[prod_data['category']]
            product, created = Product.objects.get_or_create(
                name=prod_data['name'],
                defaults={
                    'description': prod_data['description'],
                    'price': prod_data['price'],
                    'category': category,
                    'stock': prod_data['stock']
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created product: {prod_data["name"]}'))

        # Create sample reviews for products
        self.stdout.write(self.style.SUCCESS('Creating sample reviews...'))
        products = Product.objects.all()
        users = User.objects.filter(is_staff=False)[:5]  # Get first 5 non-admin users
        
        if not users.exists():
            # Create some sample users if none exist
            sample_users = [
                {'username': 'user1', 'email': 'user1@example.com', 'first_name': 'John', 'last_name': 'Doe'},
                {'username': 'user2', 'email': 'user2@example.com', 'first_name': 'Jane', 'last_name': 'Smith'},
                {'username': 'user3', 'email': 'user3@example.com', 'first_name': 'Alice', 'last_name': 'Johnson'},
                {'username': 'user4', 'email': 'user4@example.com', 'first_name': 'Bob', 'last_name': 'Brown'},
                {'username': 'user5', 'email': 'user5@example.com', 'first_name': 'Charlie', 'last_name': 'Wilson'},
            ]
            for user_data in sample_users:
                user, created = User.objects.get_or_create(
                    username=user_data['username'],
                    defaults=user_data
                )
                if created:
                    user.set_password('password123')
                    user.save()
            users = User.objects.filter(is_staff=False)[:5]

        review_comments = [
            "Great product! Highly recommend.",
            "Good quality and fast delivery.",
            "Works as expected, satisfied with purchase.",
            "Excellent value for money.",
            "Love this product, will buy again.",
            "Decent quality, meets expectations.",
            "Very satisfied with the results.",
            "Good for everyday use.",
            "Better than expected!",
            "Worth every penny."
        ]

        for product in products:
            # Create 2-4 random reviews per product
            num_reviews = random.randint(2, 4)
            selected_users = random.sample(list(users), min(num_reviews, len(users)))
            
            for user in selected_users:
                rating = random.randint(3, 5)  # Random rating between 3-5
                comment = random.choice(review_comments)
                
                review, created = Review.objects.get_or_create(
                    user=user,
                    product=product,
                    defaults={
                        'rating': rating,
                        'comment': comment
                    }
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Created review for {product.name} by {user.username}'))

        self.stdout.write(self.style.SUCCESS(f'Created {Review.objects.count()} reviews'))

        # Create offers
        offers_data = [
            {'title': 'Summer Sale', 'description': 'Get 20% off on skincare', 'discount_percentage': 20, 'code': 'SUMMER20', 'valid_from': timezone.now(), 'valid_to': timezone.now() + timedelta(days=30)},
            {'title': 'New User', 'description': 'Get 15% off on first purchase', 'discount_percentage': 15, 'code': 'NEWUSER15', 'valid_from': timezone.now(), 'valid_to': timezone.now() + timedelta(days=90)},
            {'title': 'Flash Deal', 'description': 'Get 25% off on haircare products', 'discount_percentage': 25, 'code': 'HAIR25', 'valid_from': timezone.now(), 'valid_to': timezone.now() + timedelta(days=7)},
        ]

        for offer_data in offers_data:
            offer, created = Offer.objects.get_or_create(
                code=offer_data['code'],
                defaults={
                    'title': offer_data['title'],
                    'description': offer_data['description'],
                    'discount_percentage': offer_data['discount_percentage'],
                    'valid_from': offer_data['valid_from'],
                    'valid_to': offer_data['valid_to'],
                    'active': True
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created offer: {offer_data["title"]}'))

        # Create admin user
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@beautystores.com',
                'is_staff': True,
                'is_superuser': True,
                'role': 'admin',
                'first_name': 'Admin',
                'last_name': 'User'
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('Created admin user (username: admin, password: admin123)'))

        # Create sample user
        sample_user, created = User.objects.get_or_create(
            username='customer',
            defaults={
                'email': 'customer@beautystores.com',
                'role': 'user',
                'first_name': 'John',
                'last_name': 'Doe'
            }
        )
        if created:
            sample_user.set_password('customer123')
            sample_user.save()
            self.stdout.write(self.style.SUCCESS('Created sample user (username: customer, password: customer123)'))

        self.stdout.write(self.style.SUCCESS('Sample data population completed!'))
