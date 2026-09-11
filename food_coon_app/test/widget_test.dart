import 'package:flutter_test/flutter_test.dart';
import 'package:food_coon_app/main.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const FoodCoonApp());
    expect(find.byType(FoodCoonApp), findsOneWidget);
  });
}
