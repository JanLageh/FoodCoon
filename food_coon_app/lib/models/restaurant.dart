class Restaurant {
  final int id;
  final String name;
  final String description;
  final String logoUrl;
  final String coverUrl;
  final String phone;
  final double lat;
  final double lng;
  final String openingTime;
  final String closingTime;
  final double rating;
  final List<String> cuisines;

  Restaurant({
    required this.id,
    required this.name,
    required this.description,
    required this.logoUrl,
    required this.coverUrl,
    required this.phone,
    required this.lat,
    required this.lng,
    required this.openingTime,
    required this.closingTime,
    required this.rating,
    required this.cuisines,
  });

  factory Restaurant.fromJson(Map<String, dynamic> json) {
    return Restaurant(
      id: json['id'] as int,
      name: json['name'] as String,
      description: json['description'] as String? ?? '',
      logoUrl: json['logoUrl'] as String? ?? '',
      coverUrl: json['coverUrl'] as String? ?? '',
      phone: json['phone'] as String? ?? '',
      lat: (json['lat'] as num).toDouble(),
      lng: (json['lng'] as num).toDouble(),
      openingTime: json['openingTime'] as String? ?? '',
      closingTime: json['closingTime'] as String? ?? '',
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      cuisines: (json['cuisines'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'description': description,
        'logoUrl': logoUrl,
        'coverUrl': coverUrl,
        'phone': phone,
        'lat': lat,
        'lng': lng,
        'openingTime': openingTime,
        'closingTime': closingTime,
        'rating': rating,
        'cuisines': cuisines,
      };

  bool get isOpen {
    final now = DateTime.now();
    final openParts = openingTime.split(':');
    final closeParts = closingTime.split(':');
    if (openParts.length < 2 || closeParts.length < 2) return true;

    final openMinutes =
        int.parse(openParts[0]) * 60 + int.parse(openParts[1]);
    final closeMinutes =
        int.parse(closeParts[0]) * 60 + int.parse(closeParts[1]);
    final nowMinutes = now.hour * 60 + now.minute;

    return nowMinutes >= openMinutes && nowMinutes <= closeMinutes;
  }
}
