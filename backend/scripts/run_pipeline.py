import sys
import time
from pathlib import Path

# Add project root directory to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import config
from pipeline.preprocess import FlipkartDataPreprocessor
from pipeline.eda import FlipkartEDA
from database import db_manager

def main():
    print("=" * 70)
    print("      FLIPKART SENTIMENT ANALYSIS - PREPROCESSING & EDA PIPELINE    ")
    print("=" * 70)
    start_time = time.time()

    # Step 1: Preprocessing & Cleaning
    print("\n[Step 1/3] Executing Text Preprocessing Pipeline...")
    preprocessor = FlipkartDataPreprocessor(
        raw_datasets=config.RAW_DATASETS,
        cleaned_filepath=config.CLEANED_DATA_PATH
    )
    df_clean = preprocessor.process_dataset()

    # Step 2: Exploratory Data Analysis & Plot Generation
    print("\n[Step 2/3] Generating Exploratory Data Analysis (EDA) & Charts...")
    eda = FlipkartEDA(df_clean)
    metrics = eda.generate_all()

    # Step 3: Database Integration (MongoDB Atlas / Local)
    print("\n[Step 3/3] Checking MongoDB Database Integration...")
    if db_manager.is_connected():
        db_manager.save_eda_metrics(metrics)
        # Store a sample of 1,000 processed reviews in MongoDB
        sample_records = df_clean.head(1000).to_dict(orient='records')
        db_manager.insert_sample_reviews(sample_records, limit=1000)
    else:
        print("[MongoDB] Running in offline mode. Pipeline results saved locally.")

    elapsed = time.time() - start_time
    print("\n" + "=" * 70)
    print(f"PIPELINE COMPLETED SUCCESSFULLY in {elapsed:.2f} seconds.")
    print(f"- Cleaned dataset: {config.CLEANED_DATA_PATH}")
    print(f"- Visualizations: {config.VISUALIZATIONS_DIR}")
    print(f"- EDA Report:     {config.EDA_REPORT_PATH}")
    print("=" * 70)

if __name__ == "__main__":
    main()
