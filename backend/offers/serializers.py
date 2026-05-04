from rest_framework import serializers
from .models import Offer


class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = ['id', 'title', 'description', 'discount_percentage', 'code', 'active', 'valid_from', 'valid_to', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
