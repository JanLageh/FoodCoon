class MenuCategory {
  final int id;
  final int restaurantId;
  final String name;

  MenuCategory({
    required this.id,
    required this.restaurantId,
    required this.name,
  });

  factory MenuCategory.fromJson(Map<String, dynamic> json) {
    return MenuCategory(
      id: json['id'] as int,
      restaurantId: json['restaurantId'] as int,
      name: json['name'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'restaurantId': restaurantId,
        'name': name,
      };
}
