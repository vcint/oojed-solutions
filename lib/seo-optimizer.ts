/**
 * SEO Optimization Utility
 * Automatically generates SEO-friendly metadata for blog posts
 */

interface SEOMetadata {
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  suggestedKeywords: string[];
}

/**
 * Extract the most important keywords from text using frequency analysis
 */
function extractKeywords(text: string, limit = 10): string[] {
  // Common stop words to exclude
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'must', 'can', 'it', 'its', 'as',
    'if', 'that', 'this', 'which', 'who', 'what', 'where', 'when', 'why',
    'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other',
    'some', 'such', 'no', 'nor', 'not', 'only', 'same', 'so', 'than',
    'too', 'very', 'just', 'about', 'also', 'am', 'been', 'before', 'down',
    'further', 'here', 'just', 'me', 'my', 'myself', 'our', 'ours', 'out',
    'over', 'should', 'such', 'than', 'then', 'there', 'these', 'they',
    'their', 'theirs', 'them', 'you', 'your', 'yours', 'yourself', 'yours',
    'yourselves', 'we', 'us', 'above', 'across', 'after', 'against', 'along',
    'among', 'around', 'before', 'behind', 'below', 'beneath', 'beside',
    'besides', 'between', 'beyond', 'during', 'except', 'following', 'inside',
    'instead', 'into', 'like', 'near', 'off', 'plus', 'rather', 'since',
    'through', 'throughout', 'toward', 'under', 'underneath', 'unlike', 'until',
    'up', 'upon', 'within', 'without', 'etc', 'i.e', 'e.g', 'vs', 'etc',
  ]);

  // Convert to lowercase and extract words
  const words: string[] = text.toLowerCase().match(/\b(?!-)[a-z]+(?!-)\b/g) || [];

  // Count word frequency
  const frequency: Record<string, number> = {};
  words.forEach((word: string) => {
    if (!stopWords.has(word) && word.length > 3) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });

  // Sort by frequency and return top keywords
  const keywords = Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([word]) => word);

  return keywords;
}

/**
 * Extract multi-word phrases (2-3 words) that appear frequently
 */
function extractPhrases(text: string, limit = 5): string[] {
  const lowerText = text.toLowerCase();
  const words = lowerText.match(/\b(?!-)[a-z]+(?!-)\b/g) || [];

  const phrases: Record<string, number> = {};

  // Extract 2-3 word phrases
  for (let i = 0; i < words.length - 1; i++) {
    // 2-word phrases
    const phrase2 = `${words[i]} ${words[i + 1]}`;
    if (words[i].length > 3 && words[i + 1].length > 3) {
      phrases[phrase2] = (phrases[phrase2] || 0) + 1;
    }

    // 3-word phrases
    if (i < words.length - 2) {
      const phrase3 = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
      if (words[i].length > 3 && words[i + 1].length > 3 && words[i + 2].length > 3) {
        phrases[phrase3] = (phrases[phrase3] || 0) + 1;
      }
    }
  }

  // Return top phrases that appear at least twice
  const topPhrases = Object.entries(phrases)
    .filter(([, count]) => count >= 2)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([phrase]) => phrase);

  return topPhrases;
}

/**
 * Generate SEO-optimized title (max 60 characters)
 */
function generateSEOTitle(title: string, keywords: string[]): string {
  // Truncate to 60 chars if needed
  if (title.length <= 60) {
    return title;
  }

  // Try to find a good breaking point
  const truncated = title.substring(0, 57);
  const lastSpace = truncated.lastIndexOf(' ');

  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
}

/**
 * Generate SEO-optimized description (meta description, max 160 chars)
 */
function generateSEODescription(content: string, excerpt: string, keywords: string[]): string {
  const baseDescription = excerpt || content.substring(0, 160);

  // Try to include a keyword in the description
  if (keywords.length > 0 && baseDescription && !baseDescription.toLowerCase().includes(keywords[0])) {
    // Keep description under 160 chars
    if (baseDescription.length > 150) {
      return baseDescription.substring(0, 157) + '...';
    }
    return baseDescription;
  }

  // Truncate to 160 chars
  if (baseDescription.length > 160) {
    const truncated = baseDescription.substring(0, 157);
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
  }

  return baseDescription;
}

/**
 * Main function to generate all SEO metadata
 */
export function generateSEOMetadata(
  title: string,
  content: string,
  excerpt: string = ''
): SEOMetadata {
  // Extract keywords from title and content
  const titleKeywords = extractKeywords(title, 3);
  const contentKeywords = extractKeywords(content, 15);
  const phrases = extractPhrases(content, 5);

  // Combine all keywords, removing duplicates
  const allKeywords = Array.from(new Set([...titleKeywords, ...contentKeywords])).slice(0, 10);

  // Generate optimized SEO fields
  const seoTitle = generateSEOTitle(title, allKeywords);
  const seoDescription = generateSEODescription(content, excerpt, allKeywords);

  // Create keyword string - combine single words and phrases
  const combinedKeywords = [
    ...allKeywords.slice(0, 5),
    ...phrases.slice(0, 3),
  ].join(', ');

  return {
    seo_title: seoTitle,
    seo_description: seoDescription,
    seo_keywords: combinedKeywords,
    suggestedKeywords: [...allKeywords, ...phrases].slice(0, 10),
  };
}

/**
 * Validate SEO metadata quality
 */
export function validateSEOQuality(metadata: SEOMetadata): {
  isOptimal: boolean;
  warnings: string[];
  suggestions: string[];
} {
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Check title length
  if (metadata.seo_title.length < 30) {
    suggestions.push('SEO title is quite short. Consider adding more descriptive terms.');
  }
  if (metadata.seo_title.length > 60) {
    warnings.push('SEO title exceeds 60 characters and may be cut off in search results.');
  }

  // Check description length
  if (metadata.seo_description.length < 50) {
    suggestions.push('SEO description is too short. Aim for 50-160 characters.');
  }
  if (metadata.seo_description.length > 160) {
    warnings.push('SEO description exceeds 160 characters and may be truncated.');
  }

  // Check keywords
  if (!metadata.seo_keywords || metadata.seo_keywords.length === 0) {
    warnings.push('No SEO keywords defined. Add relevant keywords for better search visibility.');
  }
  if (metadata.suggestedKeywords.length < 3) {
    suggestions.push('Only a few keywords identified. Consider adding more relevant terms.');
  }

  const isOptimal = warnings.length === 0 && metadata.seo_title.length >= 30 && metadata.seo_description.length >= 50;

  return {
    isOptimal,
    warnings,
    suggestions,
  };
}
