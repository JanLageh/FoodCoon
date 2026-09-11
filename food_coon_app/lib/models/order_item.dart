class OrderItem {
  final int? id;
  final int orderId;
  final int menuItemId;
  final int quantity;
  final double unitPrice;
  final String notes;

  OrderItem({
    this.id,
    required this.orderId,
    required this.menuItemId,
    required this.quantity,
    required this.unitPrice,
    this.notes = '',
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) {
    return OrderItem(
      id: json['id'] as int?,
      orderId: json['orderId'] as int,
      menuItemId: json['menuItemId'] as int,
      quantity: json['quantity'] as int,
      unitPrice: (json['unitPrice'] as num).toDouble(),
      notes: json['notes'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
        if (id != null) 'id': id,
        'orderId': orderId,
        'menuItemId': menuItemId,
        'quantity': quantity,
        'unitPrice': unitPrice,
        'notes': notes,
      };
}
