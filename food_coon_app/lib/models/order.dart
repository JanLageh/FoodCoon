class Order {
  final int? id;
  final int customerId;
  final int restaurantId;
  final int addressId;
  final int? driverId;
  final String status;
  final double subtotal;
  final double deliveryFee;
  final double tax;
  final double discount;
  final double total;
  final String notes;
  final String createdAt;

  Order({
    this.id,
    required this.customerId,
    required this.restaurantId,
    required this.addressId,
    this.driverId,
    required this.status,
    required this.subtotal,
    required this.deliveryFee,
    required this.tax,
    required this.discount,
    required this.total,
    this.notes = '',
    required this.createdAt,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'] as int?,
      customerId: json['customerId'] as int,
      restaurantId: json['restaurantId'] as int,
      addressId: json['addressId'] as int,
      driverId: json['driverId'] as int?,
      status: json['status'] as String,
      subtotal: (json['subtotal'] as num).toDouble(),
      deliveryFee: (json['deliveryFee'] as num).toDouble(),
      tax: (json['tax'] as num).toDouble(),
      discount: (json['discount'] as num).toDouble(),
      total: (json['total'] as num).toDouble(),
      notes: json['notes'] as String? ?? '',
      createdAt: json['createdAt'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
        if (id != null) 'id': id,
        'customerId': customerId,
        'restaurantId': restaurantId,
        'addressId': addressId,
        'driverId': driverId,
        'status': status,
        'subtotal': subtotal,
        'deliveryFee': deliveryFee,
        'tax': tax,
        'discount': discount,
        'total': total,
        'notes': notes,
        'createdAt': createdAt,
      };

  String get statusLabel {
    switch (status) {
      case 'placed':
        return 'Order Placed';
      case 'confirmed':
        return 'Confirmed';
      case 'preparing':
        return 'Preparing';
      case 'ready':
        return 'Ready for Pickup';
      case 'picked_up':
        return 'On the Way';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  }
}
