from django.contrib import admin
from .models import Offer


@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ['title', 'discount_percentage', 'code', 'active', 'valid_from', 'valid_to']
    list_filter = ['active', 'created_at']
    search_fields = ['title', 'code']
    readonly_fields = ['created_at', 'updated_at']
