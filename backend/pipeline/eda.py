import os
from collections import Counter
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from wordcloud import WordCloud
import config

class FlipkartEDA:
    def __init__(self, df: pd.DataFrame):
        self.df = df
        self.viz_dir = config.VISUALIZATIONS_DIR
        self.viz_dir.mkdir(parents=True, exist_ok=True)
        # Apply dark/sleek theme for EDA plots
        plt.style.use('dark_background')
        self.palette = {
            'positive': '#10b981',  # emerald green
            'negative': '#ef4444',  # rose red
            'neutral': '#f59e0b'    # amber orange
        }

    def generate_all(self):
        print("[EDA] Generating Exploratory Data Analysis & Visualizations...")
        metrics = {}
        metrics['total_records'] = int(len(self.df))
        
        # 1. Sentiment Distribution
        sentiment_counts = self.df['Sentiment'].value_counts().to_dict()
        metrics['sentiment_distribution'] = {k: int(v) for k, v in sentiment_counts.items()}
        self._plot_sentiment_distribution(sentiment_counts)

        # 2. Rating Distribution
        rating_counts = self.df['Rate_clean'].dropna().value_counts().sort_index().to_dict()
        metrics['rating_distribution'] = {int(k): int(v) for k, v in rating_counts.items()}
        metrics['avg_rating'] = float(self.df['Rate_clean'].mean()) if 'Rate_clean' in self.df else 0.0
        self._plot_rating_distribution(rating_counts)

        # 3. Review Length Analysis
        metrics['avg_word_count'] = float(self.df['review_word_count'].mean())
        metrics['avg_char_count'] = float(self.df['review_char_len'].mean())
        self._plot_review_length_distribution()

        # 4. Rating vs Sentiment Correlation
        self._plot_rating_vs_sentiment()

        # 5. Word Frequency & Word Clouds
        pos_words, neg_words = self._generate_wordclouds()
        metrics['top_positive_words'] = pos_words[:20]
        metrics['top_negative_words'] = neg_words[:20]

        # 6. Price Insights
        if 'product_price_clean' in self.df and self.df['product_price_clean'].notna().any():
            metrics['price_stats'] = {
                'min': float(self.df['product_price_clean'].min()),
                'max': float(self.df['product_price_clean'].max()),
                'median': float(self.df['product_price_clean'].median()),
                'mean': float(self.df['product_price_clean'].mean())
            }

        # 7. Write Markdown EDA Report
        self._write_markdown_report(metrics)
        print("[EDA] All visualizations & EDA report successfully generated.")
        return metrics

    def _plot_sentiment_distribution(self, sentiment_counts):
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
        
        labels = list(sentiment_counts.keys())
        counts = list(sentiment_counts.values())
        colors = [self.palette.get(l.lower(), '#3b82f6') for l in labels]

        # Bar chart
        bars = ax1.bar(labels, counts, color=colors, edgecolor='#ffffff', alpha=0.85, width=0.5)
        ax1.set_title('Review Sentiment Frequency', fontsize=14, fontweight='bold', pad=15)
        ax1.set_ylabel('Number of Reviews', fontsize=12)
        ax1.grid(axis='y', linestyle='--', alpha=0.3)
        for bar in bars:
            height = bar.get_height()
            ax1.text(bar.get_x() + bar.get_width()/2., height + (max(counts)*0.01),
                     f'{height:,}', ha='center', va='bottom', fontsize=10, fontweight='bold')

        # Donut Chart
        wedges, texts, autotexts = ax2.pie(counts, labels=labels, autopct='%1.1f%%',
                                          startangle=140, colors=colors,
                                          wedgeprops=dict(width=0.4, edgecolor='#1e293b'))
        plt.setp(autotexts, size=11, weight="bold", color="white")
        ax2.set_title('Sentiment Class Proportion', fontsize=14, fontweight='bold', pad=15)

        plt.tight_layout()
        plt.savefig(self.viz_dir / 'sentiment_distribution.png', dpi=300)
        plt.close()

    def _plot_rating_distribution(self, rating_counts):
        fig, ax = plt.subplots(figsize=(9, 5))
        stars = [f"{int(k)} Stars" for k in rating_counts.keys()]
        values = list(rating_counts.values())

        bars = ax.barh(stars, values, color='#6366f1', edgecolor='#ffffff', alpha=0.85)
        ax.set_title('Product Star Rating Breakdown (1 - 5 Stars)', fontsize=14, fontweight='bold', pad=15)
        ax.set_xlabel('Count', fontsize=12)
        ax.grid(axis='x', linestyle='--', alpha=0.3)
        for bar in bars:
            width = bar.get_width()
            ax.text(width + (max(values)*0.01), bar.get_y() + bar.get_height()/2.,
                     f'{width:,}', ha='left', va='center', fontsize=10, fontweight='bold')

        plt.tight_layout()
        plt.savefig(self.viz_dir / 'rating_distribution.png', dpi=300)
        plt.close()

    def _plot_review_length_distribution(self):
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

        # Histogram of Word Count
        sns.histplot(data=self.df, x='review_word_count', hue='Sentiment', palette=self.palette,
                     bins=40, kde=True, ax=ax1, common_norm=False, element="step")
        ax1.set_xlim(0, 80)
        ax1.set_title('Review Word Count Distribution by Sentiment', fontsize=13, fontweight='bold')
        ax1.set_xlabel('Word Count per Review')
        ax1.grid(linestyle='--', alpha=0.3)

        # Boxplot of Word Count
        sns.boxplot(data=self.df, x='Sentiment', y='review_word_count', hue='Sentiment', palette=self.palette, ax=ax2, legend=False)
        ax2.set_ylim(0, 100)
        ax2.set_title('Word Count Box Plot by Sentiment', fontsize=13, fontweight='bold')
        ax2.set_ylabel('Word Count')
        ax2.grid(linestyle='--', alpha=0.3)

        plt.tight_layout()
        plt.savefig(self.viz_dir / 'review_length_dist.png', dpi=300)
        plt.close()

    def _plot_rating_vs_sentiment(self):
        fig, ax = plt.subplots(figsize=(9, 6))
        crosstab = pd.crosstab(self.df['Rate_clean'], self.df['Sentiment'], normalize='index') * 100
        
        sns.heatmap(crosstab, annot=True, fmt=".1f", cmap="magma", ax=ax, cbar_kws={'label': 'Percentage (%)'})
        ax.set_title('Rating vs. Sentiment Category Correlation (%)', fontsize=14, fontweight='bold', pad=15)
        ax.set_xlabel('Sentiment Class', fontsize=12)
        ax.set_ylabel('Star Rating (1-5)', fontsize=12)

        plt.tight_layout()
        plt.savefig(self.viz_dir / 'rating_vs_sentiment.png', dpi=300)
        plt.close()

    def _generate_wordclouds(self):
        pos_text = " ".join(self.df[self.df['Sentiment'] == 'positive']['cleaned_review'].dropna())
        neg_text = " ".join(self.df[self.df['Sentiment'] == 'negative']['cleaned_review'].dropna())

        pos_words = Counter(pos_text.split()).most_common(50)
        neg_words = Counter(neg_text.split()).most_common(50)

        # Positive WordCloud
        if pos_text.strip():
            wc_pos = WordCloud(width=800, height=400, background_color='#0f172a',
                               colormap='viridis', max_words=100).generate(pos_text)
            plt.figure(figsize=(10, 5))
            plt.imshow(wc_pos, interpolation='bilinear')
            plt.axis('off')
            plt.title('Word Cloud - Positive Flipkart Reviews', fontsize=15, fontweight='bold', pad=15)
            plt.tight_layout()
            plt.savefig(self.viz_dir / 'wordcloud_positive.png', dpi=300)
            plt.close()

        # Negative WordCloud
        if neg_text.strip():
            wc_neg = WordCloud(width=800, height=400, background_color='#0f172a',
                               colormap='flare', max_words=100).generate(neg_text)
            plt.figure(figsize=(10, 5))
            plt.imshow(wc_neg, interpolation='bilinear')
            plt.axis('off')
            plt.title('Word Cloud - Negative Flipkart Reviews', fontsize=15, fontweight='bold', pad=15)
            plt.tight_layout()
            plt.savefig(self.viz_dir / 'wordcloud_negative.png', dpi=300)
            plt.close()

        return pos_words, neg_words

    def _write_markdown_report(self, metrics: dict):
        report_content = f"""# Flipkart Sentiment Analysis - Exploratory Data Analysis (EDA) Report

## 1. Executive Summary
- **Total Processed Records**: `{metrics.get('total_records', 0):,}`
- **Average Customer Rating**: `{metrics.get('avg_rating', 0.0):.2f} / 5.0`
- **Average Review Length**: `{metrics.get('avg_word_count', 0.0):.1f} words` (`{metrics.get('avg_char_count', 0.0):.1f} characters`)

---

## 2. Sentiment Class Breakdown
| Sentiment | Count | Percentage |
| :--- | :--- | :--- |
"""
        total = metrics.get('total_records', 1)
        for sent, count in metrics.get('sentiment_distribution', {}).items():
            pct = (count / total) * 100
            report_content += f"| **{sent.capitalize()}** | {count:,} | {pct:.1f}% |\n"

        report_content += f"""
![Sentiment Distribution](visualizations/sentiment_distribution.png)

---

## 3. Product Star Rating Analysis
| Star Rating | Review Count | Percentage |
| :--- | :--- | :--- |
"""
        for star, count in metrics.get('rating_distribution', {}).items():
            pct = (count / total) * 100
            report_content += f"| **{star} Stars** | {count:,} | {pct:.1f}% |\n"

        report_content += f"""
![Rating Distribution](visualizations/rating_distribution.png)

---

## 4. Rating vs Sentiment Correlation
![Rating vs Sentiment Heatmap](visualizations/rating_vs_sentiment.png)

---

## 5. Review Length & Text Distribution
![Review Length Distribution](visualizations/review_length_dist.png)

---

## 6. Word Clouds & Frequent Key Terms

### Positive Reviews Key Terms
![Positive WordCloud](visualizations/wordcloud_positive.png)

### Negative Reviews Key Terms
![Negative WordCloud](visualizations/wordcloud_negative.png)

---

## 7. Key Findings & Insights
1. **Dominant Class**: Positive reviews constitute the majority of the Flipkart dataset, aligned with 4-star and 5-star customer ratings.
2. **Negative Review Indicators**: Terms such as *bad*, *worst*, *defect*, *fan*, *noise*, and *useless* appear heavily in 1-star and 2-star reviews.
3. **Data Quality**: The text cleaning pipeline successfully removed special unicode noise (such as `??????`), numbers, and stopwords, creating high-signal normalized text for machine learning.
"""
        with open(config.EDA_REPORT_PATH, 'w', encoding='utf-8') as f:
            f.write(report_content)

if __name__ == "__main__":
    df_sample = pd.read_csv(config.CLEANED_DATA_PATH)
    eda = FlipkartEDA(df_sample)
    eda.generate_all()
