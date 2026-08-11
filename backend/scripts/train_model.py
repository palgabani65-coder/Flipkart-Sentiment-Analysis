import sys
import time
from pathlib import Path

# Add project root directory to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import config
from pipeline.train import FlipkartModelTrainer

def main():
    print("=" * 75)
    print("       FLIPKART SENTIMENT ANALYSIS - ML MODEL TRAINING PIPELINE      ")
    print("=" * 75)
    
    trainer = FlipkartModelTrainer(
        data_path=config.CLEANED_DATA_PATH,
        random_state=42
    )
    
    summary_df = trainer.run_full_pipeline()
    
    print("\n[Summary] Best Trained Model Overview:")
    print(f"- Selected Model: {trainer.best_model_name}")
    print(f"- Best Model Saved: {config.MODEL_PATH}")
    print(f"- TF-IDF Saved:     {config.VECTORIZER_PATH}")
    print(f"- Metadata Saved:   {config.METADATA_PATH}")

if __name__ == "__main__":
    main()
