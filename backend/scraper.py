"""
Flipkart Live Review Scraper
Scrapes real customer reviews from Flipkart product pages using BeautifulSoup.
Uses Googlebot user-agent to receive server-rendered HTML since Flipkart
uses client-side rendering for regular browsers.
"""

import re
import gzip
import urllib.request
import urllib.parse
import http.cookiejar
from typing import List, Dict, Optional


# Googlebot user-agent — Flipkart serves server-rendered HTML to crawlers
SCRAPER_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate',
}

# Shared cookie jar for session persistence
_cookie_jar = http.cookiejar.CookieJar()
_opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(_cookie_jar))


def _fetch_html(url: str, timeout: int = 15) -> Optional[str]:
    """Fetch a page and return decoded HTML, handling gzip compression."""
    try:
        req = urllib.request.Request(url, headers=SCRAPER_HEADERS)
        with _opener.open(req, timeout=timeout) as response:
            content = response.read()
            encoding = response.info().get('Content-Encoding', '')
            if 'gzip' in encoding:
                content = gzip.decompress(content)
            return content.decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"[Scraper] Failed to fetch {url}: {e}")
        return None


def _product_url_to_reviews_url(product_url: str) -> str:
    """
    Convert a Flipkart product URL to its all-reviews page URL.
    
    Product:  .../product-slug/p/itm123
    Reviews:  .../product-slug/product-reviews/itm123
    """
    url = product_url.strip()
    if '/product-reviews/' in url:
        return url
    url = re.sub(r'/p/', '/product-reviews/', url, count=1)
    return url


def _parse_product_title_from_url(url: str) -> str:
    """Extract a clean product title from the URL slug."""
    parts = url.split('/')
    slug = ''
    for p in parts:
        if '-' in p and 'flipkart.com' not in p and not p.startswith('product-reviews') and not p.startswith('p/'):
            slug = p
            break
    
    if not slug:
        return "Flipkart Product"
    
    title = slug.replace('-', ' ').title()
    title = re.sub(r'\s+P\s+Itm.*', '', title, flags=re.I).strip()
    title = re.sub(r'\b(Buy|Online|At|Best|Price|In|India)\b', '', title, flags=re.I).strip()
    title = re.sub(r'\s{2,}', ' ', title).strip()
    return title if len(title) > 3 else "Flipkart Product"


def _extract_reviews_from_html(html: str) -> List[Dict]:
    """
    Parse individual reviews from Flipkart server-rendered HTML.
    
    1. Primary method: Extract from embedded `window.__INITIAL_STATE__` JSON.
       Flipkart embeds complete structured review objects (ProductReviewValue)
       inside the page's React initial state script tag.
    2. Fallback method: BeautifulSoup DOM traversal anchoring on Verified Purchase cards.
    """
    reviews = []
    seen_texts = set()

    # --- Method 1: Parse from window.__INITIAL_STATE__ ---
    try:
        import json
        prefix = 'window.__INITIAL_STATE__ = '
        idx = html.find(prefix)
        if idx != -1:
            raw_json = html[idx + len(prefix):].strip()
            if raw_json.endswith(';'):
                raw_json = raw_json[:-1]
            decoder = json.JSONDecoder()
            state_data, _ = decoder.raw_decode(raw_json)

            def find_reviews_in_json(obj):
                if isinstance(obj, dict):
                    if obj.get("type") == "ProductReviewValue":
                        text = (obj.get("text") or "").strip()
                        title = (obj.get("title") or "").strip()
                        if text or title:
                            raw_rating = obj.get("rating")
                            try:
                                rating_val = int(float(raw_rating)) if raw_rating else 5
                            except Exception:
                                rating_val = 5
                            
                            author = obj.get("author") or "Flipkart Customer"
                            date = obj.get("created") or ""
                            
                            loc = obj.get("location")
                            loc_str = ""
                            if isinstance(loc, dict):
                                city = loc.get("city", "")
                                state = loc.get("state", "")
                                loc_str = f"{city}, {state}".strip(", ")

                            reviews.append({
                                "text": text if text else title,
                                "title": title,
                                "reviewer": author,
                                "rating": rating_val,
                                "date": date,
                                "location": loc_str,
                                "helpfulCount": obj.get("helpfulCount", 0)
                            })
                    for k, v in obj.items():
                        find_reviews_in_json(v)
                elif isinstance(obj, list):
                    for item in obj:
                        find_reviews_in_json(item)

            find_reviews_in_json(state_data)
            if reviews:
                return reviews
    except Exception as e:
        print(f"[Scraper] Warning parsing INITIAL_STATE: {e}")

    # --- Method 2: DOM traversal fallback ---
    try:
        from bs4 import BeautifulSoup
    except ImportError:
        return []

    soup = BeautifulSoup(html, 'lxml')
    vp_nodes = soup.find_all(string=lambda t: t and 'Verified Purchase' in t)
    
    for v in vp_nodes:
        try:
            card = v.parent
            for _ in range(8):
                if card.parent and len(card.parent.get_text(strip=True)) < 1500 and card.parent.name not in ['body', 'html']:
                    card = card.parent
                else:
                    break
            
            card_strings = [s.strip() for s in card.stripped_strings if s.strip()]
            if not card_strings:
                continue

            # Look for rating (1-5 or 1.0-5.0)
            rating_val = 5
            for s in card_strings:
                if re.match(r'^[1-5](\.0)?$', s):
                    rating_val = int(float(s))
                    break

            # Find longest string for review body
            longest = ""
            for s in card_strings:
                if len(s) > len(longest) and not s.startswith('Review for:') and 'Verified' not in s:
                    longest = s

            if not longest or len(longest) < 10:
                continue

            body_key = longest[:100]
            if body_key in seen_texts:
                continue
            seen_texts.add(body_key)

            reviews.append({
                "text": longest[:1500],
                "title": "",
                "reviewer": "Flipkart Customer",
                "rating": rating_val,
                "date": ""
            })
        except Exception:
            continue

    return reviews


def _extract_product_meta_from_html(html: str) -> Dict:
    """Extract product title, overall rating, and total review count from HTML."""
    meta = {
        "title": "",
        "rating": None,
        "total_ratings": None,
        "total_reviews": None
    }
    
    # Check window.__INITIAL_STATE__ for UgcRatingValue & page title
    try:
        import json
        prefix = 'window.__INITIAL_STATE__ = '
        idx = html.find(prefix)
        if idx != -1:
            raw_json = html[idx + len(prefix):].strip()
            if raw_json.endswith(';'):
                raw_json = raw_json[:-1]
            decoder = json.JSONDecoder()
            state_data, _ = decoder.raw_decode(raw_json)

            def find_meta_in_json(obj):
                if isinstance(obj, dict):
                    if obj.get("type") == "UgcRatingValue":
                        if "average" in obj:
                            meta["rating"] = round(float(obj["average"]), 1)
                        if "ratingCount" in obj:
                            meta["total_ratings"] = obj["ratingCount"]
                        if "reviewCount" in obj:
                            meta["total_reviews"] = obj["reviewCount"]
                    for k, v in obj.items():
                        find_meta_in_json(v)
                elif isinstance(obj, list):
                    for item in obj:
                        find_meta_in_json(item)

            find_meta_in_json(state_data)
    except Exception as e:
        print(f"[Scraper] Notice in meta JSON extraction: {e}")

    # Title from <title> tag
    title_match = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE)
    if title_match:
        raw = title_match.group(1).split('- Buy')[0].split('|')[0].strip()
        raw = re.sub(r'\s*-\s*Flipkart$', '', raw, flags=re.I).strip()
        # Clean up Flipkart review page title suffixes
        raw = re.sub(r'Reviews:\s*Latest Review of.*', '', raw, flags=re.I).strip()
        raw = re.sub(r'\s+Reviews\s*$', '', raw, flags=re.I).strip()
        if len(raw) > 3 and "buy products online" not in raw.lower():
            meta["title"] = raw
    
    # Fallback rating regex from HTML if JSON didn't find it
    if not meta["rating"]:
        rating_match = re.search(
            r'"ratingValue":\s*"?([1-5]\.[0-9])"?|"rating":\s*"?([1-5]\.[0-9])"?', html
        )
        if rating_match:
            try:
                meta["rating"] = float(rating_match.group(1) or rating_match.group(2))
            except Exception:
                pass
    
    # Review/rating counts
    count_match = re.search(r'"ratingCount":\s*"?(\d+)"?|"reviewCount":\s*"?(\d+)"?', html)
    if count_match:
        meta["total_ratings"] = count_match.group(1) or count_match.group(2)
    else:
        count_match2 = re.search(r'([\d,]{3,})\s*(?:Ratings)', html, re.IGNORECASE)
        if count_match2:
            meta["total_ratings"] = count_match2.group(1).replace(',', '')
        
        review_count_match = re.search(r'([\d,]{2,})\s*(?:Reviews)', html, re.IGNORECASE)
        if review_count_match:
            meta["total_reviews"] = review_count_match.group(1).replace(',', '')
    
    return meta


def _detect_category(url: str, title: str) -> Dict:
    """Auto-detect product category and emoji from URL + title text."""
    combined = (url + " " + title).lower()
    
    if re.search(r'jeans|pant|shirt|clothing|men|women|loose fit|fashion|denim|apparel|saree|kurta|dress', combined):
        return {"category": "Clothing", "emoji": "👔"}
    elif re.search(r'phone|galaxy|iphone|redmi|oneplus|mobile|samsung|realme|5g|s26|s24|pixel|vivo|oppo|poco', combined):
        return {"category": "Smartphones", "emoji": "📱"}
    elif re.search(r'audio|headset|earbuds|headphone|speaker|boat|jbl|sony|airpods|buds', combined):
        return {"category": "Audio", "emoji": "🎧"}
    elif re.search(r'laptop|macbook|dell|hp|lenovo|asus|chromebook|notebook', combined):
        return {"category": "Laptops", "emoji": "💻"}
    elif re.search(r'watch|fit|band|colorfit|noise|smartwatch', combined):
        return {"category": "Wearables", "emoji": "⌚"}
    elif re.search(r'tv|television|smart tv|led|oled|qled', combined):
        return {"category": "Television", "emoji": "📺"}
    elif re.search(r'camera|dslr|mirrorless|gopro|canon|nikon', combined):
        return {"category": "Cameras", "emoji": "📷"}
    elif re.search(r'shoe|sneaker|sandal|slipper|boot|footwear', combined):
        return {"category": "Footwear", "emoji": "👟"}
    else:
        return {"category": "Electronics", "emoji": "📦"}


def scrape_flipkart_reviews(product_url: str, max_pages: int = 3) -> Dict:
    """
    Main entry point: scrape real reviews from a Flipkart product page.
    
    Args:
        product_url: Flipkart product page URL
        max_pages: Number of review pages to scrape (1-5)
    
    Returns:
        Dict with product metadata and list of scraped reviews
    """
    max_pages = max(1, min(max_pages, 5))
    
    # Build the reviews page base URL
    reviews_base_url = _product_url_to_reviews_url(product_url)
    
    # Remove existing page param if any
    reviews_base_url = re.sub(r'[&?]page=\d+', '', reviews_base_url)
    
    # Parse title from URL as fallback
    url_title = _parse_product_title_from_url(product_url)
    
    all_reviews = []
    product_meta = None
    logs = []
    
    logs.append({"text": f"# Initiating scrape for: {product_url[:80]}...", "type": "primary"})
    logs.append({"text": "[INFO] Converting to reviews page URL...", "type": "info"})
    logs.append({"text": f"[INFO] Target: {reviews_base_url[:80]}...", "type": "info"})
    
    for page_num in range(1, max_pages + 1):
        # Build page URL
        separator = '&' if '?' in reviews_base_url else '?'
        page_url = f"{reviews_base_url}{separator}page={page_num}"
        
        logs.append({"text": f"> Fetching page {page_num}/{max_pages}...", "type": "pulse"})
        
        html = _fetch_html(page_url)
        if not html:
            logs.append({"text": f"[WARN] Failed to fetch page {page_num}. Skipping.", "type": "warn"})
            continue
        
        logs.append({"text": f"[INFO] Received {len(html):,} bytes. Parsing DOM...", "type": "info"})
        
        # Extract product metadata from first page
        if page_num == 1:
            product_meta = _extract_product_meta_from_html(html)
            if not product_meta["title"]:
                product_meta["title"] = url_title
        
        # Extract reviews
        page_reviews = _extract_reviews_from_html(html)
        logs.append({"text": f"[INFO] Page {page_num}: Found {len(page_reviews)} reviews.", "type": "info"})
        
        all_reviews.extend(page_reviews)
        
        # If no reviews found on a page, stop paginating
        if len(page_reviews) == 0:
            logs.append({"text": "[INFO] No more reviews found. Stopping pagination.", "type": "info"})
            break
    
    # Deduplicate reviews by text
    seen = set()
    unique_reviews = []
    for rev in all_reviews:
        key = rev["text"][:100]
        if key not in seen:
            seen.add(key)
            unique_reviews.append(rev)
    
    # Detect category
    title = product_meta["title"] if product_meta else url_title
    cat_info = _detect_category(product_url, title)
    
    logs.append({"text": f"> Scraping complete. {len(unique_reviews)} unique reviews extracted.", "type": "primary"})
    
    return {
        "product": {
            "name": title,
            "rating": product_meta.get("rating") if product_meta else None,
            "total_ratings": product_meta.get("total_ratings") if product_meta else None,
            "total_reviews": product_meta.get("total_reviews") if product_meta else None,
            "category": cat_info["category"],
            "emoji": cat_info["emoji"],
            "url": product_url
        },
        "reviews": unique_reviews,
        "total_scraped": len(unique_reviews),
        "pages_scraped": max_pages,
        "logs": logs
    }
