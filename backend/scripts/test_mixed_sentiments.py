import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from predict import SentimentPredictor

# 25+ Mixed Sentiment & Contrastive Test Cases
MIXED_SENTIMENT_TEST_SET = [
    {"text": "Excellent delivery, but the product quality is terrible.", "expected": "negative"},
    {"text": "The product is good, but the customer service was disappointing.", "expected": "negative"},
    {"text": "Fast shipping, however the cooler is completely broken and leaking.", "expected": "negative"},
    {"text": "Great packaging, but the item stopped working after 2 hours.", "expected": "negative"},
    {"text": "Nice color and look, but performance is worst.", "expected": "negative"},
    {"text": "Good price, but useless product.", "expected": "negative"},
    {"text": "Awesome design, although the motor is making terrible noise.", "expected": "negative"},
    {"text": "Delivery was quick, but item is damaged.", "expected": "negative"},
    {"text": "Looks premium, but quality is cheap and defective.", "expected": "negative"},
    {"text": "Very cheap price, but defective product delivered.", "expected": "negative"},
    
    {"text": "Packaging was bad, but the air cooler performance is absolutely amazing!", "expected": "positive"},
    {"text": "Late delivery, but the product quality is top notch and works great.", "expected": "positive"},
    {"text": "Box was slightly damaged, but cooling is awesome and worth every rupee.", "expected": "positive"},
    {"text": "Seller took 5 days to dispatch, but the item is excellent.", "expected": "positive"},
    {"text": "Slow shipping, but highly recommended product!", "expected": "positive"},
    
    {"text": "The product is okay. Nothing special but it works fine.", "expected": "neutral"},
    {"text": "Average quality, works fine for small room.", "expected": "neutral"},
    {"text": "Neither good nor bad, just an ordinary fan.", "expected": "neutral"},
    {"text": "Decent price, decent cooling.", "expected": "neutral"},
    {"text": "It is fine for the price, nothing extraordinary.", "expected": "neutral"},

    {"text": "I expected much better quality for this price.", "expected": "negative"},
    {"text": "Great expectations but total disappointment.", "expected": "negative"},
    {"text": "Looks good in pictures but bad in reality.", "expected": "negative"},
    {"text": "Super fast delivery, but defective item inside.", "expected": "negative"},
    {"text": "Superb packing, but product is not working.", "expected": "negative"}
]

def run_mixed_sentiment_benchmark():
    predictor = SentimentPredictor()
    correct = 0
    total = len(MIXED_SENTIMENT_TEST_SET)
    
    print("=" * 80)
    print("      MIXED-SENTIMENT & CONTRASTIVE CLAUSE BENCHMARK TEST      ")
    print("=" * 80)
    print(f"Evaluating {total} complex contrastive test reviews...\n")
    
    failures = []
    
    for idx, item in enumerate(MIXED_SENTIMENT_TEST_SET, 1):
        res = predictor.predict(item["text"])
        predicted = res["sentiment"].lower()
        expected = item["expected"].lower()
        is_pass = predicted == expected
        if is_pass:
            correct += 1
            status = "[PASS]"
        else:
            status = "[FAIL]"
            failures.append({
                "id": idx,
                "text": item["text"],
                "expected": expected,
                "predicted": predicted,
                "confidence": res["confidence"]
            })
            
        print(f"[{idx:02d}/{total}] {status} | Expected: {expected.upper():8s} | Predicted: {predicted.upper():8s}")
        print(f"     Review: \"{item['text']}\"")
        if res["confidence"]:
            conf_str = ", ".join([f"{k}: {v}%" for k, v in res["confidence"].items()])
            print(f"     Probas: [{conf_str}]")
        print("-" * 80)
        
    accuracy = (correct / total) * 100
    print("\n" + "=" * 80)
    print(f"MIXED SENTIMENT ACCURACY: {correct}/{total} ({accuracy:.2f}%)")
    print(f"FAILED CASES: {len(failures)} / {total}")
    print("=" * 80)
    
    if failures:
        print("\nDETAILED FAILURE ANALYSIS:")
        for f in failures:
            print(f"#{f['id']}: \"{f['text']}\"")
            print(f"   -> Expected: {f['expected'].upper()} | Got: {f['predicted'].upper()}")
            print(f"   -> Confidence Scores: {f['confidence']}")

if __name__ == "__main__":
    run_mixed_sentiment_benchmark()
